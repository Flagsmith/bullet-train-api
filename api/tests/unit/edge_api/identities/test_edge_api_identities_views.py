from typing import Callable

from django.urls import reverse
from pytest_mock import MockerFixture
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.test import APIClient

from edge_api.identities.views import EdgeIdentityViewSet
from environments.models import Environment
from environments.permissions.constants import (
    MANAGE_IDENTITIES,
    VIEW_IDENTITIES,
)
from environments.permissions.permissions import NestedEnvironmentPermissions
from features.models import Feature


def test_edge_identity_view_set_get_permissions():
    # Given
    view_set = EdgeIdentityViewSet()

    # When
    permissions = view_set.get_permissions()

    # Then
    assert isinstance(permissions[0], IsAuthenticated)
    assert isinstance(permissions[1], NestedEnvironmentPermissions)

    assert permissions[1].action_permission_map == {
        "list": VIEW_IDENTITIES,
        "retrieve": VIEW_IDENTITIES,
        "create": MANAGE_IDENTITIES,
        "perform_destroy": MANAGE_IDENTITIES,
        "get_traits": VIEW_IDENTITIES,
        "update_traits": MANAGE_IDENTITIES,
    }


def test_user_with_manage_identity_permission_can_delete_identity(
    dynamo_enabled_project_environment_one,
    identity_document_without_fs,
    edge_identity_dynamo_wrapper_mock,
    test_user_client,
    view_environment_permission,
    view_identities_permission,
    view_project_permission,
    user_environment_permission,
    user_project_permission,
):
    # Given
    user_environment_permission.permissions.add(
        view_environment_permission, view_identities_permission
    )
    user_project_permission.permissions.add(view_project_permission)

    identity_uuid = identity_document_without_fs["identity_uuid"]

    url = reverse(
        "api-v1:environments:environment-edge-identities-detail",
        args=[dynamo_enabled_project_environment_one.api_key, identity_uuid],
    )

    edge_identity_dynamo_wrapper_mock.get_item_from_uuid_or_404.return_value = (
        identity_document_without_fs
    )

    # When
    response = test_user_client.delete(url)

    # Then
    assert response.status_code == status.HTTP_204_NO_CONTENT

    edge_identity_dynamo_wrapper_mock.get_item_from_uuid_or_404.assert_called_with(
        identity_uuid
    )
    edge_identity_dynamo_wrapper_mock.delete_item.assert_called_with(
        identity_document_without_fs["composite_key"]
    )


def test_edge_identity_viewset_returns_404_for_invalid_environment_key(admin_client):
    # Given
    api_key = "not-valid"
    url = reverse(
        "api-v1:environments:environment-edge-identities-list", args=[api_key]
    )

    # When
    response = admin_client.get(url)

    # Then
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_edge_identity_overrides_for_a_feature(
    staff_client: APIClient,
    with_environment_permissions: Callable,
    mocker: MockerFixture,
    feature: Feature,
    environment: Environment,
    edge_identity_override_document: dict,
) -> None:
    # Given
    url = reverse(
        "api-v1:environments:get-edge-identity-overrides", args=[environment.pk]
    )
    with_environment_permissions([VIEW_IDENTITIES])

    mock_dynamodb_wrapper = mocker.MagicMock()
    mocker.patch(
        "edge_api.identities.edge_identity_service.ddb_environment_v2_wrapper",
        mock_dynamodb_wrapper,
    )
    mock_dynamodb_wrapper.get_identity_overrides.return_value = [
        edge_identity_override_document
    ]

    # When
    response = staff_client.get(url)

    # Then
    assert response.status_code == status.HTTP_200_OK

    response_json = response.json()
    assert response_json["results"] == [
        {
            "feature_state_value": None,
            "multivariate_feature_state_values": [],
            "identity": {"identity_uuid": "", "identifier": "identity1"},
            "uuid": "1f74f8ff-3436-4090-bf48-65eea35d107e",
            "enabled": None,
            "feature": feature.id,
            "environment": environment.id,
        }
    ]
