import json
import typing

from django.urls import reverse
from django.utils.http import urlencode
from rest_framework.test import APIClient

from features.feature_types import MULTIVARIATE, STANDARD
from features.value_types import STRING


def create_feature_with_api(
    client: APIClient,
    project_id: int,
    feature_name: str,
    initial_value: str,
    multivariate_options: typing.List[typing.Tuple[str, float]] = None,
) -> int:
    """
    Create a feature against the API using the provided test client.

    :param client: DRF api client to use to make the request
    :param feature_name: Name of the feature to create
    :param initial_value: Initial value to give the feature
    :param multivariate_options: List of 2-tuples containing the string value and percentage allocation
    :return: id of the created feature
    """
    multivariate_options = multivariate_options or []

    create_feature_url = reverse(
        "api-v1:projects:project-features-list", args=[project_id]
    )
    create_standard_feature_data = {
        "name": feature_name,
        "type": MULTIVARIATE if multivariate_options else STANDARD,
        "initial_value": initial_value,
        "default_enabled": True,
        "multivariate_options": [
            {
                "type": STRING,
                "string_value": mv_option[0],
                "default_percentage_allocation": mv_option[1],
            }
            for mv_option in multivariate_options
        ],
    }
    create_standard_feature_response = client.post(
        create_feature_url,
        data=json.dumps(create_standard_feature_data),
        content_type="application/json",
    )
    return create_standard_feature_response.json()["id"]


def get_env_feature_states_list_with_api(client: APIClient, query_params: dict) -> dict:
    """
    Returns feature states using the provided test client.

    :param client: DRF api client to use to make the request
    :param query_params: A Mapping object used as query params for filtering

    """
    url = reverse("api-v1:features:featurestates-list")
    return get_json_response(client, url, query_params)


def get_feature_segement_list_with_api(client: APIClient, query_params: dict) -> dict:
    """
    Returns feature segments using the provided test client.

    :param client: DRF api client to use to make the request
    :param query_params: A Mapping object used as query params for filtering

    """

    url = reverse("api-v1:features:feature-segment-list")
    return get_json_response(client, url, query_params)


def get_json_response(client: APIClient, url: str, query_params: dict) -> dict:
    if query_params:
        url = f"{url}?{urlencode(query_params)}"
    return client.get(url).json()


def update_feature_state_with_api(client: APIClient, data: dict):
    feature_state = data["id"]
    fs_update_url = reverse(
        "api-v1:features:featurestates-detail", args=[feature_state]
    )
    response = client.put(
        fs_update_url, data=json.dumps(data), content_type="application/json"
    )
    return response.json()
