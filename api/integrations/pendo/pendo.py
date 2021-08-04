import json
import logging
import typing

import requests

from integrations.common.wrapper import AbstractBaseIdentityIntegrationWrapper

if typing.TYPE_CHECKING:
    from environments.identities.models import Identity
    from features.models import FeatureState

logger = logging.getLogger(__name__)

PENDO_API_URL = "https://app.pendo.io"


class PendoWrapper(AbstractBaseIdentityIntegrationWrapper):
    def __init__(self, api_key: str):
        self.url = f"{PENDO_API_URL}/api/v1/metadata/visitor/agent/value"
        self.headers = {
            "x-pendo-integration-key": api_key,
            "content-type": "application/json",
        }

    def _identify_user(self, user_data: dict) -> None:
        response = requests.post(
            self.url, headers=self.headers, data=json.dumps(user_data)
        )

        logger.debug(
            "Sent event to Pendo. Response code was: %s" % response.status_code
        )
        logger.debug("Sent event to Pendo. Body code was: %s" % response.content)

    def generate_user_data(
        self, identity: "Identity", feature_states: typing.List["FeatureState"]
    ) -> dict:
        feature_properties = {}

        for feature_state in feature_states:
            value = feature_state.get_feature_state_value(identity=identity)
            feature_properties[feature_state.feature.name] = (
                value if (feature_state.enabled and value) else feature_state.enabled
            )

        return [
            {
                "visitorId": identity.identifier,
                "values": feature_properties,
            }
        ]
