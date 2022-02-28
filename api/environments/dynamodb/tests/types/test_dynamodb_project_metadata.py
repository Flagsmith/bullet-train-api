from datetime import datetime
from decimal import Decimal

from environments.dynamodb.types import (
    DynamoProjectMetadata,
    ProjectIdentityMigrationStatus,
)


def test_get_or_new_returns_instance_with_default_values_if_document_does_not_exists(
    mocker,
):
    # Given
    project_id = 1
    mocked_dynamo_table = mocker.patch(
        "environments.dynamodb.types.project_metadata_table"
    )
    mocked_dynamo_table.get_item.return_value = {
        "ResponseMetadata": {"some_key": "some_value"}
    }

    # When
    project_metadata = DynamoProjectMetadata.get_or_new(project_id)
    # Then
    assert project_metadata.id == project_id
    assert (
        project_metadata.identity_migration_status
        == ProjectIdentityMigrationStatus.MIGRATION_NOT_STARTED.name
    )
    mocked_dynamo_table.get_item.assert_called_with(Key={"id": project_id})


def test_get_or_new_returns_instance_with_document_data_if_document_does_exists(mocker):
    # Given
    project_id = 1

    mocked_dynamo_table = mocker.patch(
        "environments.dynamodb.types.project_metadata_table"
    )
    mocked_dynamo_table.get_item.return_value = {
        "ResponseMetadata": {"some_key": "some_value"},
        "Item": {
            "id": Decimal(project_id),
            "identity_migration_status": ProjectIdentityMigrationStatus.MIGRATION_IN_PROGRESS.name,
        },
    }
    # When
    project_metadata = DynamoProjectMetadata.get_or_new(project_id)

    # Then
    assert project_metadata.id == project_id
    assert (
        project_metadata.identity_migration_status
        == ProjectIdentityMigrationStatus.MIGRATION_IN_PROGRESS.name
    )
    mocked_dynamo_table.get_item.assert_called_with(Key={"id": project_id})


def test_start_identity_migration_calls_put_item_with_correct_arguments(mocker):
    # Given
    project_id = 1
    migration_start_time = datetime.now()
    mocked_dynamo_table = mocker.patch(
        "environments.dynamodb.types.project_metadata_table"
    )
    mocked_dynamo_table.get_item.return_value = {
        "ResponseMetadata": {"some_key": "some_value"}
    }
    mocked_datetime = mocker.patch("environments.dynamodb.types.datetime")
    mocked_datetime.now = mocker.MagicMock(return_value=migration_start_time)
    project_metadata = DynamoProjectMetadata.get_or_new(project_id)

    # When
    project_metadata.start_identity_migration()
    # Then
    mocked_dynamo_table.get_item.assert_called_with(Key={"id": project_id})
    mocked_dynamo_table.put_item.assert_called_with(
        Item={
            "id": project_id,
            "identity_migration_status": ProjectIdentityMigrationStatus.MIGRATION_IN_PROGRESS.name,
            "migration_start_time": migration_start_time,
        }
    )


def test_finish_identity_migration_calls_put_item_with_correct_arguments(
    mocker,
):
    # Given
    project_id = 1
    migration_start_time = datetime.now()

    mocked_dynamo_table = mocker.patch(
        "environments.dynamodb.types.project_metadata_table"
    )

    project_metadata = DynamoProjectMetadata(
        id=project_id, migration_start_time=migration_start_time
    )

    # When
    project_metadata.finish_identity_migration()

    # Then
    mocked_dynamo_table.put_item.assert_called_with(
        Item={
            "id": project_id,
            "identity_migration_status": ProjectIdentityMigrationStatus.MIGRATION_COMPLETED.name,
            "migration_start_time": migration_start_time,
        }
    )
