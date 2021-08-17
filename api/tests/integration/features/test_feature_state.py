import json
from datetime import datetime, timedelta

import pytest
from django.urls import reverse
from django.utils import timezone
from freezegun import freeze_time
from rest_framework import status
from tests.integration.helpers import (
    get_env_feature_states_list_with_api,
    update_feature_state_with_api,
)


@pytest.fixture()
def frozen_time():
    with freeze_time(timezone.now() - timedelta(days=2)) as foop:
        yield foop


def test_updates_days_since_feature_last_updated_is_part_of_respone(
    frozen_time, admin_client, environment_api_key, environment, feature
):
    # Given
    url = reverse(
        "api-v1:environments:environment-featurestates-list",
        args=[environment_api_key],
    )

    # When
    frozen_time.move_to(datetime.now() + timedelta(days=2))
    response = admin_client.get(url)
    # Then
    assert response.json()["results"][0]["days_since_feature_last_updated"] == 2


def test_updating_feature_state_updates_days_since_feature_last_updated(
    frozen_time, admin_client, environment, environment_api_key, project, feature
):
    # Given
    url = reverse(
        "api-v1:environments:environment-featurestates-list",
        args=[environment_api_key],
    )
    # Get the feature state to update
    feature_state = get_env_feature_states_list_with_api(
        admin_client, {"environment": environment}
    )["results"][0]["id"]

    # When

    # Firstly, let's reset the time so that feature state update happen at t
    # instead of t-2
    frozen_time.move_to(datetime.now() + timedelta(days=2))

    # Update the feature state
    update_feature_state_with_api(
        admin_client,
        {
            "id": feature_state,
            "feature_state_value": {"type": "unicode", "string_value": "new_value"},
            "enabled": False,
            "feature": feature,
            "environment": environment,
            "identity": None,
            "feature_segment": None,
        },
    )
    response = admin_client.get(url)

    # Then
    assert response.json()["results"][0]["days_since_feature_last_updated"] == 0


def test_adding_feature_segment_udpates_days_since_feature_last_updated(
    frozen_time,
    admin_client,
    environment,
    environment_api_key,
    project,
    feature,
    segment,
    feature_segment,
):
    # Given
    frozen_time.move_to(datetime.now() + timedelta(days=2))

    # Let's create a feature segment override
    create_url = reverse("api-v1:features:featurestates-list")
    data = {
        "feature_state_value": {
            "type": "unicode",
            "boolean_value": None,
            "integer_value": None,
            "string_value": "dumb",
        },
        "multivariate_feature_state_values": [],
        "enabled": False,
        "feature": feature,
        "environment": environment,
        "identity": None,
        "feature_segment": feature_segment,
    }
    seg_override_response = admin_client.post(
        create_url, data=json.dumps(data), content_type="application/json"
    )
    # Make sure that override was a success
    assert seg_override_response.status_code == status.HTTP_201_CREATED

    url = reverse(
        "api-v1:environments:environment-featurestates-list",
        args=[environment_api_key],
    )
    response = admin_client.get(url)

    # Then
    assert response.json()["results"][0]["days_since_feature_last_updated"] == 0
