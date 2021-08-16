# django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from slack_sdk import WebClient

from integrations.common.views import IntegrationCommonViewSet
from integrations.slack.models import SlackConfiguration, SlackEnvironment
from integrations.slack.serializers import (
    SlackChannelListSerializer,
    SlackConfiguration,
    SlackEnvironmentSerializer,
)


class SlackConfigurationViewSet(IntegrationCommonViewSet):
    serializer_class = SlackEnvironmentSerializer
    pagination_class = None  # set here to ensure documentation is correct
    model_class = SlackEnvironment

    @action(
        detail=False,
        methods=["GET"],
        url_path="channels",
        serializer_class=SlackChannelListSerializer,
    )
    def get_channels(self, request, *args, **kwargs):
        env = self.get_environment_from_request()
        try:
            config = SlackConfiguration.objects.get(project=env.project)
        except ObjectDoesNotExist:
            # TODO: maybe redirect to oauth?
            return Response(
                "Slack Configuration not found", status.HTTP_400_BAD_REQUEST
            )
        slack_token = config.api_token
        client = WebClient(token=slack_token)
        # TODO: error handling
        response = client.conversations_list(exclude_archived=True)
        conversations = response["channels"]
        channel_data = [
            {"channel_name": channel["name"], "channel_id": channel["id"]}
            for channel in conversations
        ]
        serializer = self.get_serializer(data=channel_data, many=True)
        serializer.is_valid()
        return Response(serializer.data)
