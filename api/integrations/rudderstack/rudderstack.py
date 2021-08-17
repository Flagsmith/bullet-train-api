import logging
import typing

import rudder_analytics

from integrations.common.wrapper import AbstractBaseIdentityIntegrationWrapper

if typing.TYPE_CHECKING:
    from environments.identities.models import Identity
    from features.models import FeatureState

logger = logging.getLogger(__name__)


class RudderstackWrapper(AbstractBaseIdentityIntegrationWrapper):
    def __init__(self, base_url: str, api_key: str):
        rudder_analytics.write_key = api_key
        rudder_analytics.data_plane_url = base_url

    def _identify_user(self, user_data: dict) -> None:
        rudder_analytics.identify(**user_data)
        logger.debug(f"Sent event to Rudderstack.")

    def generate_user_data(
        self, identity: "Identity", feature_states: typing.List["FeatureState"]
    ) -> dict:
        feature_properties = {}

        for feature_state in feature_states:
            value = feature_state.get_feature_state_value(identity=identity)
            feature_properties[feature_state.feature.name] = (
                value if (feature_state.enabled and value) else feature_state.enabled
            )

        return {
            "user_id": identity.identifier,
            "traits": feature_properties,
        }
