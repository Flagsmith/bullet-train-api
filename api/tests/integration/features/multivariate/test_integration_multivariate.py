import json

from django.urls import reverse
from rest_framework import status

from features.feature_types import MULTIVARIATE


def test_create_and_update_multivariate_feature_with_2_variations_50_percent(
    project, environment, environment_api_key, admin_client
):
    """
    Specific test to reproduce issue #234 in Github
    https://github.com/Flagsmith/flagsmith/issues/234
    """
    # Create an MV feature with 2 variations, both with 50% weighting
    create_feature_data = {
        "name": "mv_feature",
        "initial_value": "big",
        "multivariate_options": [
            {
                "type": "unicode",
                "string_value": "bigger",
                "default_percentage_allocation": 50,
            },
            {
                "type": "unicode",
                "string_value": "biggest",
                "default_percentage_allocation": 50,
            },
        ],
        "project": project,
        "type": MULTIVARIATE,
    }
    create_url = reverse("api-v1:projects:project-features-list", args=[project])
    create_feature_response = admin_client.post(
        create_url,
        data=json.dumps(create_feature_data),
        content_type="application/json",
    )
    create_feature_response_json = create_feature_response.json()
    feature_id = create_feature_response_json["id"]
    mv_option_ids = [
        mvo["id"] for mvo in create_feature_response_json["multivariate_options"]
    ]
    assert create_feature_response.status_code == status.HTTP_201_CREATED
    assert len(mv_option_ids) == 2

    # Now get the feature states for the environment so we can get the id of the
    # feature state and multivariate feature states in the given environment
    get_feature_states_url = reverse(
        "api-v1:environments:environment-featurestates-list", args=[environment_api_key]
    )
    get_feature_states_response = admin_client.get(get_feature_states_url)
    results = get_feature_states_response.json()["results"]
    feature_state = next(filter(lambda fs: fs["feature"] == feature_id, results))
    feature_state_id = feature_state["id"]
    mv_fsv_ids = [
        mv_fsv["id"] for mv_fsv in feature_state["multivariate_feature_state_values"]
    ]
    assert get_feature_states_response.status_code == status.HTTP_200_OK
    assert len(mv_fsv_ids) == 2

    # Now we just want to try and update the feature state in the environment without
    # changing anything
    update_url = reverse(
        "api-v1:environments:environment-featurestates-detail",
        args=[environment_api_key, feature_state_id],
    )
    update_feature_state_data = {
        "id": feature_state_id,
        "feature_state_value": "big",
        "multivariate_feature_state_values": [
            {
                "multivariate_feature_option": mv_option_id,
                "id": mv_fsv_id,
                "percentage_allocation": 50,
            }
            for mv_option_id, mv_fsv_id in zip(mv_option_ids, mv_fsv_ids)
        ],
        "identity": None,
        "enabled": False,
        "feature": feature_id,
        "environment": environment,
        "feature_segment": None,
    }
    update_feature_state_response = admin_client.put(
        update_url,
        data=json.dumps(update_feature_state_data),
        content_type="application/json",
    )
    assert update_feature_state_response.status_code == status.HTTP_200_OK
