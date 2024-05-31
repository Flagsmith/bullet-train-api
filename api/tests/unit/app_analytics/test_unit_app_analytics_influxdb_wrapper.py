from datetime import date, timedelta
from typing import Generator, Type
from unittest import mock
from unittest.mock import MagicMock

import app_analytics
import pytest
from _pytest.monkeypatch import MonkeyPatch
from app_analytics.influxdb_wrapper import (
    InfluxDBWrapper,
    build_filter_string,
    get_event_list_for_organisation,
    get_events_for_organisation,
    get_feature_evaluation_data,
    get_multiple_event_list_for_feature,
    get_multiple_event_list_for_organisation,
    get_top_organisations,
    get_usage_data,
)
from django.conf import settings
from django.utils import timezone
from influxdb_client.client.exceptions import InfluxDBError
from influxdb_client.rest import ApiException
from pytest_mock import MockerFixture
from urllib3.exceptions import HTTPError

from organisations.models import Organisation

# Given
org_id = 123
env_id = 1234
feature_id = 12345
feature_name = "test_feature"
influx_org = settings.INFLUXDB_ORG
read_bucket = settings.INFLUXDB_BUCKET + "_downsampled_15m"


@pytest.fixture()
def mock_influxdb_client(monkeypatch: Generator[MonkeyPatch, None, None]) -> MagicMock:
    mock_influxdb_client = mock.MagicMock()
    monkeypatch.setattr(
        app_analytics.influxdb_wrapper, "influxdb_client", mock_influxdb_client
    )
    return mock_influxdb_client


@pytest.fixture()
def mock_write_api(mock_influxdb_client: MagicMock) -> MagicMock:
    mock_write_api = mock.MagicMock()
    mock_influxdb_client.write_api.return_value = mock_write_api
    return mock_write_api


def test_write(mock_write_api: MagicMock) -> None:
    # Given
    influxdb = InfluxDBWrapper("name")
    influxdb.add_data_point("field_name", "field_value")

    # When
    influxdb.write()

    # Then
    mock_write_api.write.assert_called()


@pytest.mark.parametrize("exception_class", [HTTPError, InfluxDBError, ApiException])
def test_write_handles_errors(
    mock_write_api: MagicMock,
    exception_class: Type[Exception],
    caplog: pytest.LogCaptureFixture,
) -> None:
    # Given
    mock_write_api.write.side_effect = exception_class

    influxdb = InfluxDBWrapper("name")
    influxdb.add_data_point("field_name", "field_value")

    # When
    influxdb.write()

    # Then
    # The write API was called
    mock_write_api.write.assert_called()
    # but the exception was not raised


def test_influx_db_query_when_get_events_then_query_api_called(monkeypatch):
    expected_query = (
        (
            f'from(bucket:"{read_bucket}") |> range(start: -30d, stop: now()) '
            f'|> filter(fn:(r) => r._measurement == "api_call")         '
            f'|> filter(fn: (r) => r["_field"] == "request_count")         '
            f'|> filter(fn: (r) => r["organisation_id"] == "{org_id}") '
            f'|> drop(columns: ["organisation", "project", "project_id", "environment", '
            f'"environment_id"])'
            f"|> sum()"
        )
        .replace(" ", "")
        .replace("\n", "")
    )
    mock_influxdb_client = mock.MagicMock()
    monkeypatch.setattr(
        app_analytics.influxdb_wrapper, "influxdb_client", mock_influxdb_client
    )

    mock_query_api = mock.MagicMock()
    mock_influxdb_client.query_api.return_value = mock_query_api

    # When
    get_events_for_organisation(org_id)

    # Then
    mock_query_api.query.assert_called_once()

    call = mock_query_api.query.mock_calls[0]
    assert call[2]["org"] == influx_org
    assert call[2]["query"].replace(" ", "").replace("\n", "") == expected_query


def test_influx_db_query_when_get_events_list_then_query_api_called(monkeypatch):
    query = (
        f'from(bucket:"{read_bucket}") '
        f"|> range(start: -30d, stop: now()) "
        f'|> filter(fn:(r) => r._measurement == "api_call")                   '
        f'|> filter(fn: (r) => r["organisation_id"] == "{org_id}") '
        f'|> drop(columns: ["organisation", "organisation_id", "type", "project", '
        f'"project_id", "environment", "environment_id", "host"])'
        f"|> aggregateWindow(every: 24h, fn: sum)"
    )
    mock_influxdb_client = mock.MagicMock()
    monkeypatch.setattr(
        app_analytics.influxdb_wrapper, "influxdb_client", mock_influxdb_client
    )

    mock_query_api = mock.MagicMock()
    mock_influxdb_client.query_api.return_value = mock_query_api

    # When
    get_event_list_for_organisation(org_id)

    # Then
    mock_query_api.query.assert_called_once_with(org=influx_org, query=query)


@pytest.mark.parametrize(
    "project_id, environment_id, expected_filters",
    (
        (
            None,
            None,
            ['r._measurement == "api_call"', f'r["organisation_id"] == "{org_id}"'],
        ),
        (
            1,
            None,
            [
                'r._measurement == "api_call"',
                f'r["organisation_id"] == "{org_id}"',
                'r["project_id"] == "1"',
            ],
        ),
        (
            None,
            1,
            [
                'r._measurement == "api_call"',
                f'r["organisation_id"] == "{org_id}"',
                'r["environment_id"] == "1"',
            ],
        ),
        (
            1,
            1,
            [
                'r._measurement == "api_call"',
                f'r["organisation_id"] == "{org_id}"',
                'r["project_id"] == "1"',
                'r["environment_id"] == "1"',
            ],
        ),
    ),
)
def test_influx_db_query_when_get_multiple_events_for_organisation_then_query_api_called(
    monkeypatch, project_id, environment_id, expected_filters
):

    expected_query = (
        (
            f'from(bucket:"{read_bucket}") '
            "|> range(start: -30d, stop: now()) "
            f"{build_filter_string(expected_filters)}"
            '|> drop(columns: ["organisation", "organisation_id", "type", "project", '
            '"project_id", "environment", "environment_id", "host"]) '
            "|> aggregateWindow(every: 24h, fn: sum)"
        )
        .replace(" ", "")
        .replace("\n", "")
    )
    mock_influxdb_client = mock.MagicMock()
    monkeypatch.setattr(
        app_analytics.influxdb_wrapper, "influxdb_client", mock_influxdb_client
    )

    mock_query_api = mock.MagicMock()
    mock_influxdb_client.query_api.return_value = mock_query_api

    # When
    get_multiple_event_list_for_organisation(
        org_id, project_id=project_id, environment_id=environment_id
    )

    # Then
    mock_query_api.query.assert_called_once()

    call = mock_query_api.query.mock_calls[0]
    assert call[2]["org"] == influx_org
    assert call[2]["query"].replace(" ", "").replace("\n", "") == expected_query


def test_influx_db_query_when_get_multiple_events_for_feature_then_query_api_called(
    monkeypatch,
):
    query = (
        f'from(bucket:"{read_bucket}") '
        "|> range(start: -30d, stop: now()) "
        '|> filter(fn:(r) => r._measurement == "feature_evaluation")                   '
        '|> filter(fn: (r) => r["_field"] == "request_count")                   '
        f'|> filter(fn: (r) => r["environment_id"] == "{env_id}")                   '
        f'|> filter(fn: (r) => r["feature_id"] == "{feature_name}") '
        '|> drop(columns: ["organisation", "organisation_id", "type", "project", '
        '"project_id", "environment", "environment_id", "host"])'
        "|> aggregateWindow(every: 24h, fn: sum, createEmpty: false)                    "
        '|> yield(name: "sum")'
    )

    mock_influxdb_client = mock.MagicMock()
    monkeypatch.setattr(
        app_analytics.influxdb_wrapper, "influxdb_client", mock_influxdb_client
    )

    mock_query_api = mock.MagicMock()
    mock_influxdb_client.query_api.return_value = mock_query_api

    # When
    assert get_multiple_event_list_for_feature(env_id, feature_name) == []

    # Then
    mock_query_api.query.assert_called_once_with(org=influx_org, query=query)


def test_get_usage_data(mocker):
    # Given
    influx_data = [
        {
            "Environment-document": None,
            "name": "2023-02-02",
            "Flags": 200,
            "Identities": 300,
            "Traits": 400,
        },
        {
            "Environment-document": 10,
            "name": "2023-02-03",
            "Flags": 10,
            "Identities": 20,
            "Traits": 30,
        },
    ]
    mocked_get_multiple_event_list_for_organisation = mocker.patch(
        "app_analytics.influxdb_wrapper.get_multiple_event_list_for_organisation",
        autospec=True,
        return_value=influx_data,
    )

    # When
    usage_data = get_usage_data(org_id)

    # Then
    mocked_get_multiple_event_list_for_organisation.assert_called_once_with(
        organisation_id=org_id,
        environment_id=None,
        project_id=None,
        date_start="-30d",
        date_stop="now()",
    )

    assert len(usage_data) == 2

    assert usage_data[0].day == date(year=2023, month=2, day=2)
    assert usage_data[0].flags == 200
    assert usage_data[0].identities == 300
    assert usage_data[0].traits == 400
    assert usage_data[0].environment_document is None

    assert usage_data[1].day == date(year=2023, month=2, day=3)
    assert usage_data[1].flags == 10
    assert usage_data[1].identities == 20
    assert usage_data[1].traits == 30
    assert usage_data[1].environment_document == 10


def test_get_feature_evaluation_data(mocker):
    # Given
    influx_data = [
        {"some-feature": 100, "datetime": "2023-01-08"},
        {"some-feature": 200, "datetime": "2023-01-09"},
    ]
    mocked_get_multiple_event_list_for_feature = mocker.patch(
        "app_analytics.influxdb_wrapper.get_multiple_event_list_for_feature",
        autospec=True,
        return_value=influx_data,
    )

    # When
    feature_evaluation_data = get_feature_evaluation_data(
        feature_name,
        env_id,
    )

    # Then
    mocked_get_multiple_event_list_for_feature.assert_called_once_with(
        feature_name=feature_name, environment_id=env_id, date_start="-30d"
    )

    assert len(feature_evaluation_data) == 2

    assert feature_evaluation_data[0].day == date(year=2023, month=1, day=8)
    assert feature_evaluation_data[0].count == 100

    assert feature_evaluation_data[1].day == date(year=2023, month=1, day=9)
    assert feature_evaluation_data[1].count == 200


@pytest.mark.parametrize("date_stop", ["now()", "-5d"])
@pytest.mark.freeze_time("2023-01-19T09:09:47.325132+00:00")
def test_get_event_list_for_organisation_with_date_stop_set_to_now_and_previously(
    date_stop: str,
    mocker: MockerFixture,
    organisation: Organisation,
) -> None:
    # Given
    now = timezone.now()
    one_day_ago = now - timedelta(days=1)
    two_days_ago = now - timedelta(days=2)

    record_mock1 = mock.MagicMock()
    record_mock1.__getitem__.side_effect = lambda key: {
        "resource": "resource23",
        "_value": 23,
    }.get(key)
    record_mock1.values = {"_time": one_day_ago}

    record_mock2 = mock.MagicMock()
    record_mock2.__getitem__.side_effect = lambda key: {
        "resource": "resource24",
        "_value": 24,
    }.get(key)
    record_mock2.values = {"_time": two_days_ago}

    result = mock.MagicMock()
    result.records = [record_mock1, record_mock2]

    influx_mock = mocker.patch(
        "app_analytics.influxdb_wrapper.InfluxDBWrapper.influx_query_manager"
    )

    influx_mock.return_value = [result]

    # When
    dataset, labels = get_event_list_for_organisation(
        organisation_id=organisation.id,
        date_stop=date_stop,
    )

    # Then
    assert dataset == {"resource23": [23], "resource24": [24]}
    assert labels == ["2023-01-18", "2023-01-17"]


@pytest.mark.parametrize("limit", ["10", ""])
def test_get_top_organisations(
    limit: str,
    mocker: MockerFixture,
) -> None:
    # Given
    mocker.patch("app_analytics.influxdb_wrapper.range_bucket_mappings")

    record_mock1 = mock.MagicMock()
    record_mock1.values = {"organisation": "123-TestOrg"}
    record_mock1.get_value.return_value = 23

    record_mock2 = mock.MagicMock()
    record_mock2.values = {"organisation": "456-TestCorp"}
    record_mock2.get_value.return_value = 43

    result = mock.MagicMock()
    result.records = [record_mock1, record_mock2]

    influx_mock = mocker.patch(
        "app_analytics.influxdb_wrapper.InfluxDBWrapper.influx_query_manager"
    )

    influx_mock.return_value = [result]

    # When
    dataset = get_top_organisations(date_start="-30d", limit=limit)

    # Then
    assert dataset == {123: 23, 456: 43}


def test_get_top_organisations_value_error(
    mocker: MockerFixture,
) -> None:
    # Given
    mocker.patch("app_analytics.influxdb_wrapper.range_bucket_mappings")

    record_mock1 = mock.MagicMock()
    record_mock1.values = {"organisation": "BadData-TestOrg"}
    record_mock1.get_value.return_value = 23

    record_mock2 = mock.MagicMock()
    record_mock2.values = {"organisation": "456-TestCorp"}
    record_mock2.get_value.return_value = 43

    result = mock.MagicMock()
    result.records = [record_mock1, record_mock2]

    influx_mock = mocker.patch(
        "app_analytics.influxdb_wrapper.InfluxDBWrapper.influx_query_manager"
    )

    influx_mock.return_value = [result]

    # When
    dataset = get_top_organisations(date_start="-30d")

    # Then
    # The wrongly typed data does not stop the remaining data
    # from being returned.
    assert dataset == {456: 43}
