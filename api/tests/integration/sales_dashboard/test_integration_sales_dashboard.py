from django.urls import reverse
from rest_framework import status


def test_sales_dashboard_index(superuser_authenticated_client):
    """
    VERY basic test to check that the index page loads.
    """

    # Given
    url = reverse("sales_dashboard:index")

    # When
    response = superuser_authenticated_client.get(url)

    # Then
    assert response.status_code == 200


def test_migrate_identities_to_edge_calls_migrate_identity_with_correct_arguments_if_migration_is_not_done(
    superuser_authenticated_client, mocker, project
):
    # Given
    url = reverse("sales_dashboard:migrate_identities", args=[project])

    mocked_dynamo_wrapper = mocker.patch("sales_dashboard.views.DynamoIdentityWrapper")
    mocked_is_migration_done = mocker.MagicMock(return_value=False)
    mocked_dynamo_wrapper.return_value.is_migration_done = mocked_is_migration_done

    # When
    response = superuser_authenticated_client.post(url)

    # Then
    assert response.status_code == status.HTTP_302_FOUND
    mocked_dynamo_wrapper.assert_called_with()
    mocked_is_migration_done.assert_called_with(project)
    mocked_dynamo_wrapper.return_value.migrate_identities.assert_called_with(project)


def test_migrate_identities_to_edge_does_not_call_migrate_identity_with_correct_arguments_if_migration_is_already_done(
    superuser_authenticated_client, mocker, project
):
    # Given
    url = reverse("sales_dashboard:migrate_identities", args=[project])

    mocked_dynamo_wrapper = mocker.patch("sales_dashboard.views.DynamoIdentityWrapper")
    mocked_is_migration_done = mocker.MagicMock(return_value=True)
    mocked_dynamo_wrapper.return_value.is_migration_done = mocked_is_migration_done

    # When
    response = superuser_authenticated_client.post(url)

    # Then
    assert response.status_code == status.HTTP_302_FOUND
    mocked_dynamo_wrapper.assert_called_with()
    mocked_is_migration_done.assert_called_with(project)
    mocked_dynamo_wrapper.return_value.migrate_identities.assert_not_called()
