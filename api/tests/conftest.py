import typing

import pytest
from mypy_boto3_dynamodb.service_resource import DynamoDBServiceResource, Table
from pytest_django.fixtures import SettingsWrapper

from environments.dynamodb import (
    DynamoEnvironmentV2Wrapper,
    DynamoEnvironmentWrapper,
    DynamoIdentityWrapper,
)
from environments.models import Environment
from features.models import Feature
from projects.models import Project
from util.mappers import map_environment_to_environment_document


@pytest.fixture()
def edge_identity_dynamo_wrapper_mock(mocker):
    return mocker.patch(
        "edge_api.identities.models.EdgeIdentity.dynamo_wrapper",
    )


@pytest.fixture()
def flagsmith_environment_api_key_table(dynamodb: "DynamoDBServiceResource") -> "Table":
    return dynamodb.create_table(
        TableName="flagsmith_environment_api_key",
        KeySchema=[{"AttributeName": "key", "KeyType": "HASH"}],
        AttributeDefinitions=[
            {"AttributeName": "key", "AttributeType": "S"},
        ],
        BillingMode="PAY_PER_REQUEST",
    )


@pytest.fixture()
def flagsmith_environment_table(dynamodb: "DynamoDBServiceResource") -> "Table":
    return dynamodb.create_table(
        TableName="flagsmith_environments",
        KeySchema=[{"AttributeName": "api_key", "KeyType": "HASH"}],
        AttributeDefinitions=[
            {"AttributeName": "api_key", "AttributeType": "S"},
        ],
        BillingMode="PAY_PER_REQUEST",
    )


@pytest.fixture()
def flagsmith_project_metadata_table(dynamodb: "DynamoDBServiceResource") -> "Table":
    return dynamodb.create_table(
        TableName="flagsmith_project_metadata",
        KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
        AttributeDefinitions=[
            {"AttributeName": "id", "AttributeType": "N"},
        ],
        BillingMode="PAY_PER_REQUEST",
    )


@pytest.fixture
def dynamodb_identity_wrapper(
    settings: SettingsWrapper,
    flagsmith_identities_table: Table,
) -> DynamoIdentityWrapper:
    settings.IDENTITIES_TABLE_NAME_DYNAMO = flagsmith_identities_table.name
    return DynamoIdentityWrapper()


@pytest.fixture
def dynamodb_wrapper_v2(
    settings: SettingsWrapper,
    flagsmith_environments_v2_table: Table,
) -> DynamoEnvironmentV2Wrapper:
    settings.ENVIRONMENTS_V2_TABLE_NAME_DYNAMO = flagsmith_environments_v2_table.name
    return DynamoEnvironmentV2Wrapper()


@pytest.fixture()
def dynamo_enabled_project_environment_one_document(
    flagsmith_environment_table: Table,
    dynamo_enabled_project_environment_one: Environment,
) -> dict:
    environment_dict = map_environment_to_environment_document(
        dynamo_enabled_project_environment_one
    )

    flagsmith_environment_table.put_item(
        Item=environment_dict,
    )
    return environment_dict


@pytest.fixture()
def dynamo_environment_wrapper(
    flagsmith_environment_table: Table,
) -> DynamoEnvironmentWrapper:
    wrapper = DynamoEnvironmentWrapper()
    wrapper.table_name = flagsmith_environment_table.name
    return wrapper


@pytest.fixture()
def app_settings_for_dynamodb(
    settings: SettingsWrapper,
    flagsmith_environment_table: Table,
    flagsmith_environments_v2_table: Table,
    flagsmith_identities_table: Table,
) -> None:
    settings.ENVIRONMENTS_TABLE_NAME_DYNAMO = flagsmith_environment_table.name
    settings.ENVIRONMENTS_V2_TABLE_NAME_DYNAMO = flagsmith_environments_v2_table.name
    settings.IDENTITIES_TABLE_NAME_DYNAMO = flagsmith_identities_table.name
    return


@pytest.fixture()
def features_for_identity_clone_flag_states_from() -> (
    typing.Callable[..., tuple[Feature, Feature, Feature]]
):
    def make(project: Project) -> tuple[Feature, Feature, Feature]:
        # Create 3 features
        feature_1: Feature = Feature.objects.create(
            name="feature_1",
            project=project,
            default_enabled=True,
        )
        feature_2: Feature = Feature.objects.create(
            name="feature_2",
            project=project,
            default_enabled=True,
        )

        feature_3: Feature = Feature.objects.create(
            name="feature_3",
            project=project,
            default_enabled=True,
        )
        return feature_1, feature_2, feature_3

    return make
