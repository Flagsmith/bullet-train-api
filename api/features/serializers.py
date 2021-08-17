from django.utils import timezone
from drf_writable_nested import WritableNestedModelSerializer
from rest_framework import serializers

from audit.models import (
    FEATURE_CREATED_MESSAGE,
    FEATURE_STATE_UPDATED_MESSAGE,
    FEATURE_UPDATED_MESSAGE,
    IDENTITY_FEATURE_STATE_UPDATED_MESSAGE,
    AuditLog,
    RelatedObjectType,
)
from environments.identities.models import Identity

from .models import Feature, FeatureState, FeatureStateValue
from .multivariate.serializers import (
    MultivariateFeatureOptionSerializer,
    MultivariateFeatureStateValueSerializer,
)


class ListCreateFeatureSerializer(WritableNestedModelSerializer):
    multivariate_options = MultivariateFeatureOptionSerializer(
        many=True, required=False
    )

    class Meta:
        model = Feature
        fields = (
            "id",
            "name",
            "type",
            "default_enabled",
            "initial_value",
            "created_date",
            "description",
            "tags",
            "multivariate_options",
        )
        read_only_fields = ("feature_segments", "created_date")

    def to_internal_value(self, data):
        if data.get("initial_value") and not isinstance(data["initial_value"], str):
            data["initial_value"] = str(data["initial_value"])
        return super(ListCreateFeatureSerializer, self).to_internal_value(data)

    def create(self, validated_data):
        instance = super(ListCreateFeatureSerializer, self).create(validated_data)
        self._create_audit_log(instance, True)
        return instance

    def update(self, instance, validated_data):
        updated_instance = super(ListCreateFeatureSerializer, self).update(
            instance, validated_data
        )
        self._create_audit_log(updated_instance, False)
        return updated_instance

    def _create_audit_log(self, instance, created):
        message = (
            FEATURE_CREATED_MESSAGE % instance.name
            if created
            else FEATURE_UPDATED_MESSAGE % instance.name
        )
        request = self.context.get("request")
        AuditLog.objects.create(
            author=getattr(request, "user", None),
            related_object_id=instance.id,
            related_object_type=RelatedObjectType.FEATURE.name,
            project=instance.project,
            log=message,
        )

    def validate(self, attrs):
        view = self.context["view"]
        project_id = str(view.kwargs.get("project_pk"))
        if not project_id.isdigit():
            raise serializers.ValidationError("Invalid project ID.")

        unique_filters = {"project__id": project_id, "name__iexact": attrs["name"]}
        existing_feature_queryset = Feature.objects.filter(**unique_filters)
        if self.instance:
            existing_feature_queryset = existing_feature_queryset.exclude(
                id=self.instance.id
            )

        if existing_feature_queryset.exists():
            raise serializers.ValidationError(
                "Feature with that name already exists for this "
                "project. Note that feature names are case "
                "insensitive."
            )

        # If tags selected check they from the same Project as Feature Project
        if any(tag.project_id != int(project_id) for tag in attrs.get("tags", [])):
            raise serializers.ValidationError(
                "Selected Tags must be from the same Project as current Feature"
            )

        return attrs


class UpdateFeatureSerializer(ListCreateFeatureSerializer):
    """prevent users from changing the value of default enabled after creation"""

    class Meta(ListCreateFeatureSerializer.Meta):
        read_only_fields = ListCreateFeatureSerializer.Meta.read_only_fields + (
            "default_enabled",
            "initial_value",
        )


class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = (
            "id",
            "name",
            "created_date",
            "description",
            "initial_value",
            "default_enabled",
            "type",
        )
        writeonly_fields = ("initial_value", "default_enabled")


class FeatureStateSerializerFull(serializers.ModelSerializer):
    feature = FeatureSerializer()
    feature_state_value = serializers.SerializerMethodField()

    class Meta:
        model = FeatureState
        fields = "__all__"

    def get_feature_state_value(self, obj):
        return obj.get_feature_state_value(identity=self.context.get("identity"))


class FeatureStateSerializerBasic(WritableNestedModelSerializer):
    feature_state_value = serializers.SerializerMethodField()
    multivariate_feature_state_values = MultivariateFeatureStateValueSerializer(
        many=True, required=False
    )
    # TODO: better variable name
    days_since_feature_last_updated = serializers.SerializerMethodField()

    class Meta:
        model = FeatureState
        fields = "__all__"

    def get_days_since_feature_last_updated(self, obj) -> int:
        cache = self.context.get("feature_updated_at_cache")
        updated_at = [
            x["updated_at"] for x in cache if x["feature__id"] == obj.feature.pk
        ][0]
        return (timezone.now() - updated_at).days

    def get_feature_state_value(self, obj):
        return obj.get_feature_state_value(identity=self.context.get("identity"))

    def create(self, validated_data):
        instance = super(FeatureStateSerializerBasic, self).create(validated_data)
        self._create_audit_log(instance=instance)
        return instance

    def update(self, instance, validated_data):
        updated_instance = super(FeatureStateSerializerBasic, self).update(
            instance, validated_data
        )
        self._create_audit_log(updated_instance)
        return updated_instance

    def _create_audit_log(self, instance):
        create_feature_state_audit_log(instance, self.context.get("request"))

    def validate(self, attrs):
        environment = attrs.get("environment")
        identity = attrs.get("identity")
        feature_segment = attrs.get("feature_segment")

        if identity and not identity.environment == environment:
            raise serializers.ValidationError("Identity does not exist in environment.")

        if feature_segment and not feature_segment.environment == environment:
            raise serializers.ValidationError(
                "Feature Segment does not belong to environment."
            )

        # validate uniqueness
        # Note: we get the attribute from the instance if it's not in attrs to handle
        # the case of a partial update
        environment = environment or getattr(self.instance, "environment", None)
        identity = identity or getattr(self.instance, "identity", None)
        feature_segment = attrs.get("feature_segment") or getattr(
            self.instance, "feature_segment", None
        )
        feature = attrs.get("feature") or getattr(self.instance, "feature", None)
        queryset = FeatureState.objects.filter(
            environment=environment,
            feature=feature,
            identity=identity,
            feature_segment=feature_segment,
        ).exclude(pk=getattr(self.instance, "pk", None))

        if queryset.exists():
            raise serializers.ValidationError("Feature state already exists.")

        return attrs


class FeatureStateSerializerWithIdentity(FeatureStateSerializerBasic):
    class _IdentitySerializer(serializers.ModelSerializer):
        class Meta:
            model = Identity
            fields = ("id", "identifier")

    identity = _IdentitySerializer()


class FeatureStateSerializerFullWithIdentity(FeatureStateSerializerFull):
    identity_identifier = serializers.SerializerMethodField()

    def get_identity_identifier(self, instance):
        return instance.identity.identifier if instance.identity else None


class FeatureStateSerializerCreate(serializers.ModelSerializer):
    class Meta:
        model = FeatureState
        fields = ("feature", "enabled")

    def create(self, validated_data):
        instance = super(FeatureStateSerializerCreate, self).create(validated_data)
        self._create_audit_log(instance=instance)
        return instance

    def _create_audit_log(self, instance):
        create_feature_state_audit_log(instance, self.context.get("request"))

    def validate(self, attrs):
        return super(FeatureStateSerializerCreate, self).validate(attrs)


def create_feature_state_audit_log(feature_state, request):
    if feature_state.identity:
        message = IDENTITY_FEATURE_STATE_UPDATED_MESSAGE % (
            feature_state.feature.name,
            feature_state.identity.identifier,
        )
    else:
        message = FEATURE_STATE_UPDATED_MESSAGE % feature_state.feature.name

    AuditLog.objects.create(
        author=getattr(request, "user", None),
        related_object_id=feature_state.id,
        related_object_type=RelatedObjectType.FEATURE_STATE.name,
        environment=feature_state.environment,
        project=feature_state.environment.project,
        log=message,
    )


class FeatureStateValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureStateValue
        fields = ("type", "string_value", "integer_value", "boolean_value")


class FeatureInfluxDataSerializer(serializers.Serializer):
    events_list = serializers.ListSerializer(child=serializers.DictField())


class GetInfluxDataQuerySerializer(serializers.Serializer):
    period = serializers.CharField(required=False, default="24h")
    environment_id = serializers.CharField(required=True)


class WritableNestedFeatureStateSerializer(FeatureStateSerializerBasic):
    feature_state_value = FeatureStateValueSerializer(required=False)
    days_since_feature_last_updated = None

    class Meta(FeatureStateSerializerBasic.Meta):
        extra_kwargs = {"environment": {"required": True}}
