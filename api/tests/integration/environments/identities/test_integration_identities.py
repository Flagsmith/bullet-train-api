import json
from unittest import mock

import pytest
from django.conf import settings
from django.urls import base, reverse
from rest_framework import status
from tests.integration.helpers import create_feature_with_api

variant_1_value = "variant-1-value"
variant_2_value = "variant-2-value"
control_value = "control"

variant_1_percentage_allocation = 20
variant_2_percentage_allocation = 30
total_variance_percentage = (
    variant_1_percentage_allocation + variant_2_percentage_allocation
)


# mock the returned percentage for the identity to simulate them falling into each of
# the percentage allocation brackets for the feature variants
@pytest.mark.parametrize(
    "hashed_percentage, expected_mv_value",
    (
        (variant_1_percentage_allocation / 100 - 0.01, variant_1_value),
        (total_variance_percentage / 100 - 0.01, variant_2_value),
        (total_variance_percentage / 100 + 0.01, control_value),
    ),
)
@mock.patch("features.models.get_hashed_percentage_for_object_ids")
def test_get_feature_states_for_identity(
    mock_get_hashed_percentage_value,
    hashed_percentage,
    expected_mv_value,
    sdk_client,
    admin_client,
    project,
    environment_api_key,
    environment,
    identity,
    identity_identifier,
):
    # Firstly, let's create some features to use
    # one standard feature
    standard_feature_initial_value = "control"
    standard_feature_id = create_feature_with_api(
        client=admin_client,
        project_id=project,
        feature_name="standard_feature",
        initial_value=standard_feature_initial_value,
    )

    # and one multivariate feature
    multivariate_feature_id = create_feature_with_api(
        client=admin_client,
        project_id=project,
        feature_name="multivariate_feature",
        initial_value=control_value,
        multivariate_options=[
            (variant_1_value, variant_1_percentage_allocation),
            (variant_2_value, variant_2_percentage_allocation),
        ],
    )

    # Now, when we mock the hashed percentage that the user gets
    # to avoid the randomness factor
    mock_get_hashed_percentage_value.return_value = hashed_percentage

    # and request the flags for the identity
    base_identity_flags_url = reverse("api-v1:sdk-identities")
    identity_flags_url = f"{base_identity_flags_url}?identifier={identity_identifier}"
    identity_response_1 = sdk_client.get(identity_flags_url)

    # Then, we get a result for both of the features we created
    assert identity_response_1.status_code == status.HTTP_200_OK
    identity_response_json = identity_response_1.json()
    assert len(identity_response_json["flags"]) == 2

    # and the correct values are returned for the features
    values_dict = {
        flag["feature"]["id"]: flag["feature_state_value"]
        for flag in identity_response_json["flags"]
    }
    assert values_dict[standard_feature_id] == standard_feature_initial_value
    assert values_dict[multivariate_feature_id] == expected_mv_value

    # Now, let's change the percentage allocations on the mv options
    # first, we need to get the feature state id for the feature in the given
    # environment
    feature_state_id = next(
        filter(
            lambda flag: flag["feature"]["id"] == multivariate_feature_id,
            identity_response_json["flags"],
        )
    )["id"]

    # now let's get the existing data for the feature state so we can alter it and
    # then PUT it back
    feature_state_detail_url = reverse(
        "api-v1:environments:environment-featurestates-detail",
        args=[environment_api_key, feature_state_id],
    )
    retrieve_feature_state_response = admin_client.get(feature_state_detail_url)
    feature_state_data = retrieve_feature_state_response.json()

    # now let's amend the data so that all identities should receive variant 2
    mv_values = feature_state_data["multivariate_feature_state_values"]
    mv_values[0]["percentage_allocation"] = 0
    mv_values[1]["percentage_allocation"] = 100

    # and PUT the data back
    update_feature_state_response = admin_client.put(
        feature_state_detail_url,
        data=json.dumps(feature_state_data),
        content_type="application/json",
    )
    assert update_feature_state_response.status_code == status.HTTP_200_OK

    # Then when we get the flags for an identity, the multivariate feature returns the
    # value of the 2nd variate
    identity_response_2 = sdk_client.get(identity_flags_url)
    values_dict = {
        flag["feature"]["id"]: flag["feature_state_value"]
        for flag in identity_response_2.json()["flags"]
    }
    assert values_dict[multivariate_feature_id] == variant_2_value


def test_get_feature_states_for_identity_only_makes_one_query_to_get_mv_feature_states(
    sdk_client,
    admin_client,
    project,
    environment,
    identity,
    identity_identifier,
    django_assert_num_queries,
):
    # Firstly, let's create some features to use
    for i in range(2):
        create_feature_with_api(
            client=admin_client,
            project_id=project,
            feature_name=f"multivariate_feature_{i}",
            initial_value=control_value,
            multivariate_options=[
                (variant_1_value, variant_1_percentage_allocation),
                (variant_2_value, variant_2_percentage_allocation),
            ],
        )

    base_number_of_queries = 4
    number_of_integrations = len(
        list(
            filter(lambda app: app.startswith("integrations."), settings.INSTALLED_APPS)
        )
    )

    # When we make a request to get the flags for the identity, 12 queries are made
    # (although 4 of these are made in a separate thread)
    # TODO: can we reduce the number of queries?!
    base_url = reverse("api-v1:sdk-identities")
    url = f"{base_url}?identifier={identity_identifier}"
    with django_assert_num_queries(base_number_of_queries + number_of_integrations):
        first_identity_response = sdk_client.get(url)

    # Now, if we add another feature
    create_feature_with_api(
        client=admin_client,
        project_id=project,
        feature_name=f"another_multivariate_feature",
        initial_value=control_value,
        multivariate_options=[
            (variant_1_value, variant_1_percentage_allocation),
            (variant_2_value, variant_2_percentage_allocation),
        ],
    )

    # Then one fewer db queries are made (since the environment is now cached)
    with django_assert_num_queries(base_number_of_queries + number_of_integrations - 1):
        second_identity_response = sdk_client.get(url)

    # Finally, we check that the requests were successful and we got the correct number
    # of flags in each case
    assert first_identity_response.status_code == status.HTTP_200_OK
    assert second_identity_response.status_code == status.HTTP_200_OK

    first_identity_response_json = first_identity_response.json()
    assert len(first_identity_response_json["flags"]) == 2

    second_identity_response_json = second_identity_response.json()
    assert len(second_identity_response_json["flags"]) == 3
