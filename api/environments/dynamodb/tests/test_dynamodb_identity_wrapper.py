from boto3.dynamodb.conditions import Key

from environments.dynamodb import DynamoIdentityWrapper


def test_get_item_from_uuid_calls_query_with_correct_argument(mocker):
    # Given
    dynamo_identity_wrapper = DynamoIdentityWrapper()
    mocked_dynamo_table = mocker.patch.object(dynamo_identity_wrapper, "_table")
    environment_key = "environment_key"
    identity_uuid = "test_uuid"

    # When
    dynamo_identity_wrapper.get_item_from_uuid(environment_key, identity_uuid)
    # Then
    mocked_dynamo_table.query.assert_called_with(
        IndexName="identity_uuid-index",
        Limit=1,
        KeyConditionExpression=Key("identity_uuid").eq(identity_uuid),
    )


def test_delete_item_calls_dynamo_delete_item_with_correct_arguments(mocker):
    # Given
    dynamo_identity_wrapper = DynamoIdentityWrapper()
    composite_key = "test_key"
    mocked_dynamo_table = mocker.patch.object(dynamo_identity_wrapper, "_table")

    # When
    dynamo_identity_wrapper.delete_item(composite_key)

    # Then
    mocked_dynamo_table.delete_item.assert_called_with(
        Key={"composite_key": composite_key}
    )


def test_get_item_calls_dynamo_get_item_with_correct_arguments(mocker):
    # Given
    dynamo_identity_wrapper = DynamoIdentityWrapper()
    composite_key = "test_key"
    mocked_dynamo_table = mocker.patch.object(dynamo_identity_wrapper, "_table")

    # When
    dynamo_identity_wrapper.get_item(composite_key)

    # Then
    mocked_dynamo_table.get_item.assert_called_with(
        Key={"composite_key": composite_key}
    )


def test_get_all_items_without_start_key_calls_query_with_correct_arguments(mocker):
    # Given
    dynamo_identity_wrapper = DynamoIdentityWrapper()
    environment_key = "environment_key"
    mocked_dynamo_table = mocker.patch.object(dynamo_identity_wrapper, "_table")

    # When
    dynamo_identity_wrapper.get_all_items(environment_key, 999)

    # Then
    mocked_dynamo_table.query.assert_called_with(
        IndexName="environment_api_key-identifier-index",
        Limit=999,
        KeyConditionExpression=Key("environment_api_key").eq(environment_key),
    )


def test_get_all_items_with_start_key_calls_query_with_correct_arguments(mocker):
    # Given
    dynamo_identity_wrapper = DynamoIdentityWrapper()

    environment_key = "environment_key"
    mocked_dynamo_table = mocker.patch.object(dynamo_identity_wrapper, "_table")
    start_key = {"key": "value"}

    # When
    dynamo_identity_wrapper.get_all_items(environment_key, 999, start_key)

    # Then
    mocked_dynamo_table.query.assert_called_with(
        IndexName="environment_api_key-identifier-index",
        Limit=999,
        KeyConditionExpression=Key("environment_api_key").eq(environment_key),
        ExclusiveStartKey=start_key,
    )


def test_search_items_with_identifier_calls_query_with_correct_arguments(mocker):
    dynamo_identity_wrapper = DynamoIdentityWrapper()
    environment_key = "environment_key"
    identifier = "test_user"
    mocked_dynamo_table = mocker.patch.object(dynamo_identity_wrapper, "_table")
    start_key = {"key": "value"}
    search_function = lambda x: Key("identifier").eq(x)  # noqa: E731

    # When
    dynamo_identity_wrapper.search_items_with_identifier(
        environment_key, identifier, search_function, 999, start_key
    )

    # Then
    mocked_dynamo_table.query.assert_called_with(
        IndexName="environment_api_key-identifier-index",
        Limit=999,
        KeyConditionExpression=Key("environment_api_key").eq(environment_key)
        & search_function(identifier),
        ExclusiveStartKey=start_key,
    )


def test_is_enabled_is_false_if_dynamo_table_name_is_not_set(settings):
    # Given
    settings.IDENTITIES_TABLE_NAME_DYNAMO = None

    # When
    dynamo_identity_wrapper = DynamoIdentityWrapper()

    # Then
    assert dynamo_identity_wrapper.is_enabled is False


def test_is_enabled_is_true_if_dynamo_table_name_is_set(settings, mocker):
    # Given
    table_name = "random_table_name"
    settings.IDENTITIES_TABLE_NAME_DYNAMO = table_name
    mocked_boto3 = mocker.patch("environments.dynamodb.dynamodb_wrapper.boto3")

    # When
    dynamo_identity_wrapper = DynamoIdentityWrapper()
    # Then

    assert dynamo_identity_wrapper.is_enabled is True
    mocked_boto3.resource.assert_called_with("dynamodb")
    mocked_boto3.resource.return_value.Table.assert_called_with(table_name)
