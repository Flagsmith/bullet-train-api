from rest_framework import serializers

from features.serializers import CreateSegmentOverrideFeatureStateSerializer
from features.versioning.models import EnvironmentFeatureVersion
from integrations.github.constants import GitHubEventType
from integrations.github.github import call_github_task
from users.models import FFAdminUser


class EnvironmentFeatureVersionFeatureStateSerializer(
    CreateSegmentOverrideFeatureStateSerializer
):
    class Meta(CreateSegmentOverrideFeatureStateSerializer.Meta):
        read_only_fields = (
            CreateSegmentOverrideFeatureStateSerializer.Meta.read_only_fields
            + ("feature",)
        )

    def save(self, **kwargs):
        response = super().save(**kwargs)

        feature_state = self.instance
        if (
            not feature_state.identity_id
            and feature_state.feature.external_resources.exists()
            and feature_state.environment.project.github_project.exists()
            and feature_state.environment.project.organisation.github_config.exists()
        ):

            call_github_task(
                organisation_id=feature_state.environment.project.organisation_id,
                type=GitHubEventType.FLAG_UPDATED.value,
                feature=feature_state.feature,
                segment_name=None,
                url=None,
                feature_states=[feature_state],
            )

        return response


class EnvironmentFeatureVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvironmentFeatureVersion
        fields = (
            "created_at",
            "updated_at",
            "published",
            "live_from",
            "uuid",
            "is_live",
            "published_by",
            "created_by",
            "description",
        )
        read_only_fields = (
            "updated_at",
            "created_at",
            "published",
            "uuid",
            "is_live",
            "published_by",
            "created_by",
        )


class EnvironmentFeatureVersionPublishSerializer(serializers.Serializer):
    live_from = serializers.DateTimeField(required=False)

    def save(self, **kwargs):
        live_from = self.validated_data.get("live_from")

        request = self.context["request"]
        published_by = request.user if isinstance(request.user, FFAdminUser) else None

        self.instance.publish(live_from=live_from, published_by=published_by)
        return self.instance


class EnvironmentFeatureVersionQuerySerializer(serializers.Serializer):
    is_live = serializers.BooleanField(allow_null=True, required=False, default=None)
