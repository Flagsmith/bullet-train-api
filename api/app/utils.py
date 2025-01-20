import json
import pathlib
from functools import lru_cache
from typing import TypedDict

import shortuuid
from app.settings.common import (
    EMAIL_BACKEND,
    EMAIL_HOST_USER,
    SENDGRID_API_KEY,
    AWS_SES_REGION_ENDPOINT,
)

UNKNOWN = "unknown"
VERSIONS_INFO_FILE_LOCATION = ".versions.json"


class VersionInfo(TypedDict):
    ci_commit_sha: str
    image_tag: str
    has_email_provider: bool
    is_enterprise: bool
    is_saas: bool


def create_hash() -> str:
    """Helper function to create a short hash"""
    return shortuuid.uuid()


def is_enterprise() -> bool:
    return pathlib.Path("./ENTERPRISE_VERSION").exists()


def is_saas() -> bool:
    return pathlib.Path("./SAAS_DEPLOYMENT").exists()


def has_email_provider() -> bool:
    match EMAIL_BACKEND:
        case "django.core.mail.backends.smtp.EmailBackend":
            return EMAIL_HOST_USER is not None
        case "sgbackend.SendGridBackend":
            return SENDGRID_API_KEY is not None
        case "django_ses.SESBackend":
            return AWS_SES_REGION_ENDPOINT is not None
        case _:
            return False

@lru_cache
def get_version_info() -> VersionInfo:
    """Reads the version info baked into src folder of the docker container"""
    version_json = {}
    image_tag = UNKNOWN

    manifest_versions_content: str = _get_file_contents(VERSIONS_INFO_FILE_LOCATION)

    if manifest_versions_content != UNKNOWN:
        manifest_versions = json.loads(manifest_versions_content)
        version_json["package_versions"] = manifest_versions
        image_tag = manifest_versions["."]

    version_json = version_json | {
        "ci_commit_sha": _get_file_contents("./CI_COMMIT_SHA"),
        "image_tag": image_tag,
        "has_email_provider": has_email_provider(),
        "is_enterprise": is_enterprise(),
        "is_saas": is_saas(),
    }

    return version_json


def _get_file_contents(file_path: str) -> str:
    """Attempts to read a file from the filesystem and return the contents"""
    try:
        with open(file_path) as f:
            return f.read().replace("\n", "")
    except FileNotFoundError:
        return UNKNOWN
