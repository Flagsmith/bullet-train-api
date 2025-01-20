import json
import pathlib
from typing import Generator
from unittest import mock

import pytest
from pytest_mock import MockerFixture

from app.utils import get_version_info


@pytest.fixture(autouse=True)
def clear_get_version_info_cache() -> Generator[None, None, None]:
    yield
    get_version_info.cache_clear()


def test_get_version_info(mocker: MockerFixture) -> None:
    # Given
    mocked_pathlib = mocker.patch("app.utils.pathlib")

    def path_side_effect(file_path: str) -> mocker.MagicMock:
        mocked_path_object = mocker.MagicMock(spec=pathlib.Path)

        if file_path == "./ENTERPRISE_VERSION":
            mocked_path_object.exists.return_value = True

        if file_path == "./SAAS_DEPLOYMENT":
            mocked_path_object.exists.return_value = False

        return mocked_path_object

    mocked_pathlib.Path.side_effect = path_side_effect

    manifest_mocked_file = {
        ".": "2.66.2",
    }
    mock_get_file_contents = mocker.patch("app.utils._get_file_contents")
    mock_get_file_contents.side_effect = (json.dumps(manifest_mocked_file), "some_sha")

    # When
    result = get_version_info()

    # Then
    assert result == {
        "ci_commit_sha": "some_sha",
        "image_tag": "2.66.2",
        "has_email_provider": False,
        "is_enterprise": True,
        "is_saas": False,
        "package_versions": {".": "2.66.2"},
    }


def test_get_version_info_with_missing_files(mocker: MockerFixture) -> None:
    # Given
    mocked_pathlib = mocker.patch("app.utils.pathlib")

    def path_side_effect(file_path: str) -> mocker.MagicMock:
        mocked_path_object = mocker.MagicMock(spec=pathlib.Path)

        if file_path == "./ENTERPRISE_VERSION":
            mocked_path_object.exists.return_value = True

        if file_path == "./SAAS_DEPLOYMENT":
            mocked_path_object.exists.return_value = False

        return mocked_path_object

    mocked_pathlib.Path.side_effect = path_side_effect
    mock.mock_open.side_effect = IOError

    # When
    result = get_version_info()

    # Then
    assert result == {
        "ci_commit_sha": "unknown",
        "image_tag": "unknown",
        "has_email_provider": False,
        "is_enterprise": True,
        "is_saas": False,
    }


def test_get_version_info_with_email_config_smtp(mocker: MockerFixture) -> None:

    mocker.patch(
        "app.utils.EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend"
    )
    mocker.patch("app.utils.EMAIL_HOST_USER", "user")
    # When
    result = get_version_info()

    # Then
    assert result == {
        "ci_commit_sha": "unknown",
        "image_tag": "unknown",
        "has_email_provider": True,
        "is_enterprise": False,
        "is_saas": False,
    }


def test_get_version_info_with_email_config_sendgrid(mocker: MockerFixture) -> None:

    mocker.patch("app.utils.EMAIL_BACKEND", "sgbackend.SendGridBackend")
    mocker.patch("app.utils.SENDGRID_API_KEY", "key")
    # When
    result = get_version_info()

    # Then
    assert result == {
        "ci_commit_sha": "unknown",
        "image_tag": "unknown",
        "has_email_provider": True,
        "is_enterprise": False,
        "is_saas": False,
    }


def test_get_version_info_with_email_config_ses(mocker: MockerFixture) -> None:

    mocker.patch("app.utils.EMAIL_BACKEND", "django_ses.SESBackend")
    mocker.patch("app.utils.AWS_SES_REGION_ENDPOINT", "endpoint")
    # When
    result = get_version_info()

    # Then
    assert result == {
        "ci_commit_sha": "unknown",
        "image_tag": "unknown",
        "has_email_provider": True,
        "is_enterprise": False,
        "is_saas": False,
    }


def test_get_version_info_without_email_config(mocker: MockerFixture) -> None:

    # When
    result = get_version_info()

    # Then
    assert result == {
        "ci_commit_sha": "unknown",
        "image_tag": "unknown",
        "has_email_provider": False,
        "is_enterprise": False,
        "is_saas": False,
    }
