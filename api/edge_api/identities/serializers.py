import copy
import typing

from django.utils import timezone
from drf_yasg2.utils import swagger_serializer_method
from flag_engine.features.models import FeatureStateModel
from flag_engine.features.models import (
    FeatureStateModel as EngineFeatureStateModel,
)
from flag_engine.features.models import (
    MultivariateFeatureStateValueModel as EngineMultivariateFeatureStateValueModel,
)
from flag_engine.features.schemas import MultivariateFeatureStateValueSchema
from flag_engine.identities.builders import build_identity_dict
from flag_engine.identities.models import IdentityModel as EngineIdentity
from flag_engine.utils.exceptions import (
    DuplicateFeatureState,
    InvalidPercentageAllocation,
)
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from environments.identities.models import Identity
from environments.models import Environment
from features.models import Feature, FeatureState, FeatureStateValue
from features.multivariate.models import MultivariateFeatureOption
from features.serializers import FeatureStateValueSerializer
from features.tasks import date_format

from .tasks import call_environment_webhook

engine_multi_fs_value_schema = MultivariateFeatureStateValueSchema()


class EdgeIdentitySerializer(serializers.Serializer):
    identity_uuid = serializers.CharField(read_only=True)
    identifier = serializers.CharField(required=True, max_length=2000)

    def save(self, **kwargs):
        identifier = self.validated_data.get("identifier")
        environment_api_key = self.context["view"].kwargs["environment_api_key"]
        self.instance = EngineIdentity(
            identifier=identifier, environment_api_key=environment_api_key
        )
        if Identity.dynamo_wrapper.get_item(self.instance.composite_key):
            raise ValidationError(
                f"Identity with identifier: {identifier} already exists"
            )
        Identity.dynamo_wrapper.put_item(build_identity_dict(self.instance))
        return self.instance


class EdgeMultivariateFeatureOptionField(serializers.IntegerField):
    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        return MultivariateFeatureOption.objects.get(id=data)

    def to_representation(self, obj):
        return obj.id


class EdgeMultivariateFeatureStateValueSerializer(serializers.Serializer):
    multivariate_feature_option = EdgeMultivariateFeatureOptionField()
    percentage_allocation = serializers.FloatField(max_value=100, min_value=0)

    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        return EngineMultivariateFeatureStateValueModel(**data)


class FeatureStateValueEdgeIdentityField(serializers.Field):
    def to_representation(self, obj):
        identity_id = self.parent.get_identity_uuid()
        return obj.get_value(identity_id=identity_id)

    def get_attribute(self, instance):
        # We pass the object instance onto `to_representation`,
        # not just the field attribute.
        return instance

    def to_internal_value(self, data):
        fsv_type = FeatureState.get_feature_state_value_type(data)
        feature_state_value_dict = {
            "type": fsv_type,
            FeatureState.get_feature_state_key_name(fsv_type): data,
        }
        fs_value_serializer = FeatureStateValueSerializer(data=feature_state_value_dict)
        fs_value_serializer.is_valid(raise_exception=True)
        return FeatureStateValue(**feature_state_value_dict).value


class EdgeFeatureField(serializers.Field):
    def __init__(self, *args, **kwargs):
        help_text = "ID(integer) or name(string) of the feature"
        kwargs.setdefault("help_text", help_text)

        return super().__init__(*args, **kwargs)

    def to_representation(self, obj: Feature) -> int:
        return obj.id

    def to_internal_value(self, data: typing.Union[int, str]) -> Feature:
        if isinstance(data, int):
            return Feature.objects.get(id=data)

        environment = Environment.objects.get(
            api_key=self.context["view"].kwargs["environment_api_key"]
        )
        return Feature.objects.get(
            name=data,
            project=environment.project,
        )

    class Meta:
        swagger_schema_fields = {"type": "integer/string"}


class EdgeIdentityFeatureStateSerializer(serializers.Serializer):
    feature_state_value = FeatureStateValueEdgeIdentityField(
        allow_null=True, required=False, default=None
    )
    feature = EdgeFeatureField()
    multivariate_feature_state_values = EdgeMultivariateFeatureStateValueSerializer(
        many=True, required=False
    )
    enabled = serializers.BooleanField(required=False, default=False)
    identity_uuid = serializers.SerializerMethodField()

    featurestate_uuid = serializers.CharField(required=False, read_only=True)

    def get_identity_uuid(self, obj=None):
        return self.context["view"].identity.identity_uuid

    def save(self, **kwargs):
        identity = self.context["view"].identity
        feature_state_value = self.validated_data.pop("feature_state_value", None)

        previous_state = copy.deepcopy(self.instance)

        if not self.instance:
            self.instance = EngineFeatureStateModel(**self.validated_data)
            try:
                identity.identity_features.append(self.instance)
            except DuplicateFeatureState as e:
                raise serializers.ValidationError(
                    "Feature state already exists."
                ) from e
        self.instance.set_value(feature_state_value)
        self.instance.enabled = self.validated_data.get(
            "enabled", self.instance.enabled
        )
        self.instance.multivariate_feature_state_values = self.validated_data.get(
            "multivariate_feature_state_values",
            self.instance.multivariate_feature_state_values,
        )

        try:
            identity_dict = build_identity_dict(identity)
        except InvalidPercentageAllocation as e:
            raise serializers.ValidationError(
                {
                    "multivariate_feature_state_values": "Total percentage allocation "
                    "for feature must be less than 100 percent"
                }
            ) from e

        Identity.dynamo_wrapper.put_item(identity_dict)

        call_environment_webhook.delay(
            feature_id=self.instance.feature.id,
            environment_api_key=identity.environment_api_key,
            identity_id=identity.django_id or identity.identity_uuid,
            identity_identifier=identity.identifier,
            changed_by_user_id=self.context["request"].user.id,
            new_enabled_state=self.instance.enabled,
            new_value=self.instance.get_value(
                identity.django_id or identity.identity_uuid
            ),
            previous_enabled_state=getattr(previous_state, "enabled", None),
            previous_value=previous_state.get_value(
                identity.django_id or identity.identity_uuid
            )
            if previous_state
            else None,
            timestamp=timezone.now().strftime(
                date_format
            ),  # TODO: refactor date_format
        )

        return self.instance


class EdgeIdentityIdentifierSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True, max_length=2000)


# NOTE: This is only used for generating swagger docs
class EdgeIdentityWithIdentifierFeatureStateRequestBody(
    EdgeIdentityFeatureStateSerializer, EdgeIdentityIdentifierSerializer
):
    pass


# NOTE: This is only used for generating swagger docs
class EdgeIdentityWithIdentifierFeatureStateDeleteRequestBody(
    EdgeIdentityIdentifierSerializer
):
    feature = EdgeFeatureField()


class EdgeIdentityTraitsSerializer(serializers.Serializer):
    trait_key = serializers.CharField()
    trait_value = serializers.CharField(allow_null=True)


class EdgeIdentityFsQueryparamSerializer(serializers.Serializer):
    feature = serializers.IntegerField(
        required=False, help_text="ID of the feature to filter by"
    )


class EdgeIdentityAllFeatureStatesFeatureSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    type = serializers.CharField()


class EdgeIdentityAllFeatureStatesSegmentSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()


class EdgeIdentityAllFeatureStatesMVFeatureOptionSerializer(serializers.Serializer):
    value = serializers.SerializerMethodField(
        help_text="Can be any of the following types: integer, boolean, string."
    )

    def get_value(self, instance) -> typing.Union[str, int, bool]:
        return instance.value


class EdgeIdentityAllFeatureStatesMVFeatureStateValueSerializer(serializers.Serializer):
    multivariate_feature_option = (
        EdgeIdentityAllFeatureStatesMVFeatureOptionSerializer()
    )
    percentage_allocation = serializers.FloatField()


class EdgeIdentityAllFeatureStatesSerializer(serializers.Serializer):
    feature = EdgeIdentityAllFeatureStatesFeatureSerializer()
    enabled = serializers.BooleanField()
    feature_state_value = serializers.SerializerMethodField(
        help_text="Can be any of the following types: integer, boolean, string."
    )
    overridden_by = serializers.SerializerMethodField(
        help_text="One of: null, 'SEGMENT', 'IDENTITY'."
    )
    segment = serializers.SerializerMethodField()
    multivariate_feature_state_values = (
        EdgeIdentityAllFeatureStatesMVFeatureStateValueSerializer(many=True)
    )

    def get_feature_state_value(
        self, instance: typing.Union[FeatureState, FeatureStateModel]
    ) -> typing.Union[str, int, bool]:
        identity = self.context["identity"]
        identity_id = getattr(identity, "id", None) or getattr(
            identity, "django_id", identity.identity_uuid
        )

        if type(instance) == FeatureState:
            return instance.get_feature_state_value_by_id(identity_id)

        return instance.get_value(identity_id)

    def get_overridden_by(self, instance) -> typing.Optional[str]:
        if getattr(instance, "feature_segment_id", None) is not None:
            return "SEGMENT"
        elif instance.feature.name in self.context.get("identity_feature_names", []):
            return "IDENTITY"
        return None

    @swagger_serializer_method(
        serializer_or_field=EdgeIdentityAllFeatureStatesSegmentSerializer
    )
    def get_segment(self, instance) -> typing.Optional[typing.Dict[str, typing.Any]]:
        if getattr(instance, "feature_segment_id", None) is not None:
            return EdgeIdentityAllFeatureStatesSegmentSerializer(
                instance=instance.feature_segment.segment
            ).data
        return None
