import hashlib
import itertools
import typing

from integrations.amplitude.amplitude import AmplitudeWrapper
from integrations.heap.heap import HeapWrapper
from integrations.mixpanel.mixpanel import MixpanelWrapper
from integrations.pendo.pendo import PendoWrapper
from integrations.rudderstack.rudderstack import RudderstackWrapper
from integrations.segment.segment import SegmentWrapper

IDENTITY_INTEGRATIONS = [
    {"relation_name": "amplitude_config", "wrapper": AmplitudeWrapper},
    {"relation_name": "segment_config", "wrapper": SegmentWrapper},
    {"relation_name": "heap_config", "wrapper": HeapWrapper},
    {"relation_name": "mixpanel_config", "wrapper": MixpanelWrapper},
    {"relation_name": "rudderstack_config", "wrapper": RudderstackWrapper},
    {"relation_name": "pendo_config", "wrapper": PendoWrapper},
]


def identify_integrations(identity, all_feature_states):
    for integration in IDENTITY_INTEGRATIONS:
        config = getattr(identity.environment, integration.get("relation_name"), None)
        api_key = getattr(config, "api_key", None)
        if api_key:
            wrapper = integration.get("wrapper")
            wrapper_instance = wrapper(api_key)
            user_data = wrapper_instance.generate_user_data(
                identity=identity, feature_states=all_feature_states
            )
            wrapper_instance.identify_user_async(data=user_data)


def get_hashed_percentage_for_object_ids(
    object_ids: typing.Iterable[int], iterations: int = 1
) -> float:
    """
    Given a list of object ids, get a floating point number between 0 and 1 based on
    the hash of those ids. This should give the same value every time for any
    list of ids.

    :param object_ids: list of object ids to calculate the has for
    :param iterations: num times to include each id in the generated string to hash
    :return: (float) number between 0 (inclusive) and 1 (exclusive)
    """

    to_hash = ",".join(str(id_) for id_ in list(object_ids) * iterations)
    hashed_value = hashlib.md5(to_hash.encode("utf-8"))
    hashed_value_as_int = int(hashed_value.hexdigest(), base=16)
    value = (hashed_value_as_int % 9999) / 9998

    if value == 1:
        # since we want a number between 0 (inclusive) and 1 (exclusive), in the
        # unlikely case that we get the exact number 1, we call the method again
        # and increase the number of iterations to ensure we get a different result
        return get_hashed_percentage_for_object_ids(
            object_ids=object_ids, iterations=iterations + 1
        )

    return value
