# import time

from django.conf import settings
from slack_sdk import WebClient

from integrations.common.wrapper import AbstractBaseEventIntegrationWrapper


class SlackWrapper(AbstractBaseEventIntegrationWrapper):
    def __init__(self, api_token: str, channel_id: str):
        self.client = WebClient(token=api_token)
        self.channel_id = channel_id

    def _track_event(self, event: dict) -> None:
        # TODO: Add error handling
        self.client.chat_postMessage(channel=self.channel_id, text=event["text"])

    @staticmethod
    def generate_event_data(log: str, email: str, environment_name: str) -> dict:
        return {
            "text": f"{log} by user {email}",
            "title": "Flagsmith Feature Flag Event",
            "tags": [f"env:{environment_name}"],
        }
