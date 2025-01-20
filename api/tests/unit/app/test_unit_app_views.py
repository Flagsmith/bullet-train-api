from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


def test_get_version_info(api_client: APIClient) -> None:
    # Given
    url = reverse("version-info")

    # When
    response = api_client.get(url)

    # Then
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "ci_commit_sha": "unknown",
        "image_tag": "unknown",
        "has_email_provider": False,
        "is_enterprise": False,
        "is_saas": False,
    }
