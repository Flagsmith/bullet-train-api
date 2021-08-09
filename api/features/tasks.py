import typing
from threading import Thread

from webhooks.webhooks import (
    WebhookEventType,
    call_environment_webhooks,
    call_organisation_webhooks,
)

if typing.TYPE_CHECKING:
    from features.models import FeatureState

date_format = "%Y-%m-%dT%H:%M:%S.%fZ"


def trigger_feature_state_change_webhooks(
    instance: "FeatureState", deleted: bool = False
):
    history_instance = instance.history.first()
    timestamp = (
        history_instance.history_date.strftime(date_format)
        if history_instance and history_instance.history_date
        else ""
    )

    changed_by = (
        str(history_instance.history_user)
        if history_instance and history_instance.history_user
        else ""
    )

    new_state = _get_feature_state_webhook_data(instance) if not deleted else None
    event_type = (
        WebhookEventType.FLAG_DELETED if deleted else WebhookEventType.FLAG_UPDATED
    )

    data = {"new_state": new_state, "changed_by": changed_by, "timestamp": timestamp}

    if history_instance.prev_record:
        data["previous_state"] = _get_feature_state_webhook_data(
            history_instance.prev_record.instance, previous=True
        )

    Thread(
        target=call_environment_webhooks,
        args=(instance.environment, data, event_type),
    ).start()

    Thread(
        target=call_organisation_webhooks,
        args=(instance.environment.project.organisation, data, event_type),
    ).start()


def _get_feature_state_webhook_data(feature_state, previous=False):
    # TODO: fix circular imports and use serializers instead.
    feature = feature_state.feature
    feature_state_value = (
        feature_state.get_feature_state_value()
        if not previous
        else feature_state.previous_feature_state_value
    )
    identity_identifier = (
        feature_state.identity.identifier if feature_state.identity else None
    )

    data = {
        "feature": {
            "id": feature.id,
            "created_date": feature.created_date.strftime(date_format),
            "default_enabled": feature.default_enabled,
            "description": feature.description,
            "initial_value": feature.initial_value,
            "name": feature.name,
            "project": {
                "id": feature.project_id,
                "name": feature.project.name,
            },
            "type": feature.type,
        },
        "environment": {
            "id": feature_state.environment_id,
            "name": feature_state.environment.name,
        },
        "identity": feature_state.identity_id,
        "identity_identifier": identity_identifier,
        "feature_segment": None,  # default to none, will be updated below if it exists
        "enabled": feature_state.enabled,
        "feature_state_value": feature_state_value,
    }

    if feature_state.feature_segment:
        feature_segment = feature_state.feature_segment
        data["feature_segment"] = {
            "segment": {
                "id": feature_segment.segment.id,
                "name": feature_segment.segment.name,
                "description": feature_segment.segment.description,
            },
            "priority": feature_segment.priority,
        }

    return data
