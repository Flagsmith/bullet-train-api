import json
import typing
from datetime import datetime, timedelta

import pytest
from django.urls import reverse
from django.utils import timezone
from freezegun import freeze_time
from rest_framework import status
from rest_framework.test import APIClient

from environments.models import Environment
from environments.permissions.constants import VIEW_ENVIRONMENT
from features.models import Feature, FeatureSegment, FeatureState
from features.versioning.models import EnvironmentFeatureVersion
from projects.permissions import VIEW_PROJECT
from segments.models import Segment
from tests.types import (
    WithEnvironmentPermissionsCallable,
    WithProjectPermissionsCallable,
)
from users.models import FFAdminUser

now = timezone.now()
tomorrow = now + timedelta(days=1)


def test_get_versions_for_a_feature_and_environment(
    admin_client: APIClient,
    admin_user: FFAdminUser,
    environment_v2_versioning: Environment,
    feature: Feature,
) -> None:
    # Given
    url = reverse(
        "api-v1:versioning:environment-feature-versions-list",
        args=[environment_v2_versioning.id, feature.id],
    )

    # the initial version created automatically
    version_1 = EnvironmentFeatureVersion.objects.get(
        feature=feature, environment=environment_v2_versioning
    )

    # create a second published version
    version_2 = EnvironmentFeatureVersion.objects.create(
        feature=feature, environment=environment_v2_versioning
    )
    version_2.publish(published_by=admin_user)

    # and a draft version
    draft_version = EnvironmentFeatureVersion.objects.create(
        feature=feature, environment=environment_v2_versioning
    )

    # When
    response = admin_client.get(url)

    # Then
    assert response.status_code == status.HTTP_200_OK

    response_json = response.json()
    assert response_json["count"] == 3

    uuids = {result["uuid"] for result in response_json["results"]}
    assert len(uuids) == 3
    assert all(
        str(version.uuid) in uuids for version in (version_1, version_2, draft_version)
    )


def test_create_new_feature_version(
    admin_user: FFAdminUser,
    admin_client: APIClient,
    environment_v2_versioning: Environment,
    feature: Feature,
) -> None:
    # Given
    url = reverse(
        "api-v1:versioning:environment-feature-versions-list",
        args=[environment_v2_versioning.id, feature.id],
    )

    # When
    response = admin_client.post(url)

    # Then
    assert response.status_code == status.HTTP_201_CREATED

    response_json = response.json()
    assert response_json["created_by"] == admin_user.id
    assert response_json["uuid"]


def test_delete_feature_version(
    admin_client: APIClient,
    environment_v2_versioning: Environment,
    feature: Feature,
) -> None:
    # Given
    # an unpublished version
    environment_feature_version = EnvironmentFeatureVersion.objects.create(
        environment=environment_v2_versioning, feature=feature
    )

    url = reverse(
        "api-v1:versioning:environment-feature-versions-detail",
        args=[
            environment_v2_versioning.id,
            feature.id,
            environment_feature_version.uuid,
        ],
    )

    # When
    response = admin_client.delete(url)

    # Then
    assert response.status_code == status.HTTP_204_NO_CONTENT

    environment_feature_version.refresh_from_db()
    assert environment_feature_version.deleted is True


def test_cannot_delete_live_feature_version(
    admin_client: APIClient,
    environment_v2_versioning: Environment,
    feature: Feature,
) -> None:
    # Given
    # the initial published version
    environment_feature_version = EnvironmentFeatureVersion.objects.get(
        environment=environment_v2_versioning, feature=feature
    )

    url = reverse(
        "api-v1:versioning:environment-feature-versions-detail",
        args=[
            environment_v2_versioning.id,
            feature.id,
            environment_feature_version.uuid,
        ],
    )

    # When
    response = admin_client.delete(url)

    # Then
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    assert response.json()["detail"] == "Cannot delete a live version."


@pytest.mark.parametrize("live_from", (None, tomorrow))
def test_publish_feature_version(
    admin_client: APIClient,
    admin_user: FFAdminUser,
    environment_v2_versioning: Environment,
    feature: Feature,
    live_from: typing.Optional[datetime],
) -> None:
    # Given
    # an unpublished version
    environment_feature_version = EnvironmentFeatureVersion.objects.create(
        environment=environment_v2_versioning, feature=feature
    )

    url = reverse(
        "api-v1:versioning:environment-feature-versions-publish",
        args=[
            environment_v2_versioning.id,
            feature.id,
            environment_feature_version.uuid,
        ],
    )

    # When
    with freeze_time(now):
        response = admin_client.post(url)

    # Then
    assert response.status_code == status.HTTP_200_OK

    environment_feature_version.refresh_from_db()
    assert environment_feature_version.is_live is True
    assert environment_feature_version.published is True
    assert environment_feature_version.published_by == admin_user
    assert (
        environment_feature_version.live_from == now if live_from is None else live_from
    )


@pytest.mark.parametrize("live_from", (None, tomorrow))
def test_publish_feature_version_using_master_api_key(
    admin_master_api_key_client: APIClient,
    environment_v2_versioning: Environment,
    feature: Feature,
    live_from: datetime | None,
) -> None:
    # Given
    # an unpublished version
    environment_feature_version = EnvironmentFeatureVersion.objects.create(
        environment=environment_v2_versioning, feature=feature
    )

    url = reverse(
        "api-v1:versioning:environment-feature-versions-publish",
        args=[
            environment_v2_versioning.id,
            feature.id,
            environment_feature_version.uuid,
        ],
    )

    # When
    with freeze_time(now):
        response = admin_master_api_key_client.post(url)

    # Then
    assert response.status_code == status.HTTP_200_OK

    environment_feature_version.refresh_from_db()
    assert environment_feature_version.is_live is True
    assert environment_feature_version.published is True
    assert environment_feature_version.published_by is None
    assert (
        environment_feature_version.live_from == now if live_from is None else live_from
    )


def test_list_environment_feature_version_feature_states(
    admin_client: APIClient,
    environment_v2_versioning: Environment,
    feature: Feature,
) -> None:
    # Given
    environment_feature_version = EnvironmentFeatureVersion.objects.get(
        environment=environment_v2_versioning, feature=feature
    )

    url = reverse(
        "api-v1:versioning:environment-feature-version-featurestates-list",
        args=[
            environment_v2_versioning.id,
            feature.id,
            environment_feature_version.uuid,
        ],
    )

    # When
    response = admin_client.get(url)

    # Then
    assert response.status_code == status.HTTP_200_OK

    response_json = response.json()
    assert len(response_json) == 1


def test_add_environment_feature_version_feature_state(
    admin_client: APIClient,
    environment_v2_versioning: Environment,
    segment: Segment,
    feature: Feature,
) -> None:
    # Given
    # an unpublished environment feature version
    environment_feature_version = EnvironmentFeatureVersion.objects.create(
        environment=environment_v2_versioning, feature=feature
    )

    url = reverse(
        "api-v1:versioning:environment-feature-version-featurestates-list",
        args=[
            environment_v2_versioning.id,
            feature.id,
            environment_feature_version.uuid,
        ],
    )

    data = {
        "feature_segment": {"segment": segment.id},
        "enabled": True,
        "feature_state_value": {
            "string_value": "segment value!",
        },
    }

    # When
    response = admin_client.post(
        url, data=json.dumps(data), content_type="application/json"
    )

    # Then
    assert response.status_code == status.HTTP_201_CREATED

    assert environment_feature_version.feature_states.count() == 2
    assert environment_feature_version.feature_segments.count() == 1


def test_cannot_add_feature_state_to_published_environment_feature_version(
    admin_client: APIClient,
    environment_v2_versioning: Environment,
    segment: Segment,
    feature: Feature,
) -> None:
    # Given
    # the initial (published) environment feature version
    environment_feature_version = EnvironmentFeatureVersion.objects.get(
        environment=environment_v2_versioning, feature=feature
    )

    url = reverse(
        "api-v1:versioning:environment-feature-version-featurestates-list",
        args=[
            environment_v2_versioning.id,
            feature.id,
            environment_feature_version.uuid,
        ],
    )

    data = {
        "feature_segment": {"segment": segment.id},
        "enabled": True,
        "feature_state_value": {
            "string_value": "segment value!",
        },
    }

    # When
    response = admin_client.post(
        url, data=json.dumps(data), content_type="application/json"
    )

    # Then
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert environment_feature_version.feature_states.count() == 1

    assert response.json()["detail"] == "Cannot modify published version."


def test_update_environment_feature_version_feature_state(
    admin_client: APIClient,
    environment_v2_versioning: Environment,
    feature: Feature,
) -> None:
    # Given
    # an unpublished environment feature version
    environment_feature_version = EnvironmentFeatureVersion.objects.create(
        environment=environment_v2_versioning, feature=feature
    )

    # and the environment feature state for the feature, environment, version combination
    feature_state = environment_feature_version.feature_states.filter(
        feature=feature,
        environment=environment_v2_versioning,
        feature_segment__isnull=True,
        identity__isnull=True,
    ).get()
    assert feature_state.enabled is False

    url = reverse(
        "api-v1:versioning:environment-feature-version-featurestates-detail",
        args=[
            environment_v2_versioning.id,
            feature.id,
            environment_feature_version.uuid,
            feature_state.id,
        ],
    )

    # When
    response = admin_client.patch(
        url, data=json.dumps({"enabled": True}), content_type="application/json"
    )

    # Then
    assert response.status_code == status.HTTP_200_OK

    feature_state.refresh_from_db()
    assert feature_state.enabled is True


def test_cannot_update_feature_state_in_published_environment_feature_version(
    admin_client: APIClient,
    admin_user: FFAdminUser,
    environment_v2_versioning: Environment,
    feature: Feature,
) -> None:
    # Given
    # the initial (published) environment feature version
    environment_feature_version = EnvironmentFeatureVersion.objects.get(
        environment=environment_v2_versioning, feature=feature
    )

    # and the environment feature state for the feature, environment, version combination
    feature_state = environment_feature_version.feature_states.filter(
        feature=feature,
        environment=environment_v2_versioning,
        feature_segment__isnull=True,
        identity__isnull=True,
    ).get()
    assert feature_state.enabled is False

    url = reverse(
        "api-v1:versioning:environment-feature-version-featurestates-detail",
        args=[
            environment_v2_versioning.id,
            feature.id,
            environment_feature_version.uuid,
            feature_state.id,
        ],
    )

    # When
    response = admin_client.patch(
        url, data=json.dumps({"enabled": True}), content_type="application/json"
    )

    # Then
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    assert response.json()["detail"] == "Cannot modify published version."

    feature_state.refresh_from_db()
    assert feature_state.enabled is False


def test_delete_environment_feature_version_feature_state(
    admin_client: APIClient,
    admin_user: FFAdminUser,
    environment_v2_versioning: Environment,
    segment: Segment,
    feature: Feature,
) -> None:
    # Given
    # an unpublished environment feature version
    environment_feature_version = EnvironmentFeatureVersion.objects.create(
        environment=environment_v2_versioning, feature=feature
    )

    # and a Segment override feature state in the feature version
    segment_override = FeatureState.objects.create(
        environment_feature_version=environment_feature_version,
        feature=feature,
        environment=environment_v2_versioning,
        feature_segment=FeatureSegment.objects.create(
            feature=feature, environment=environment_v2_versioning, segment=segment
        ),
    )

    url = reverse(
        "api-v1:versioning:environment-feature-version-featurestates-detail",
        args=[
            environment_v2_versioning.id,
            feature.id,
            environment_feature_version.uuid,
            segment_override.id,
        ],
    )

    # When
    response = admin_client.delete(url)

    # Then
    assert response.status_code == status.HTTP_204_NO_CONTENT

    segment_override.refresh_from_db()
    assert segment_override.deleted is True


def test_cannot_delete_feature_state_in_published_environment_feature_version(
    admin_client: APIClient,
    admin_user: FFAdminUser,
    environment_v2_versioning: Environment,
    segment: Segment,
    feature: Feature,
) -> None:
    # Given
    # an unpublished environment feature version
    environment_feature_version = EnvironmentFeatureVersion.objects.create(
        environment=environment_v2_versioning, feature=feature
    )

    # and a Segment override feature state in the feature version
    segment_override = FeatureState.objects.create(
        environment_feature_version=environment_feature_version,
        feature=feature,
        environment=environment_v2_versioning,
        feature_segment=FeatureSegment.objects.create(
            feature=feature, environment=environment_v2_versioning, segment=segment
        ),
    )

    # and we publish the version
    environment_feature_version.publish(admin_user)

    url = reverse(
        "api-v1:versioning:environment-feature-version-featurestates-detail",
        args=[
            environment_v2_versioning.id,
            feature.id,
            environment_feature_version.uuid,
            segment_override.id,
        ],
    )

    # When
    response = admin_client.delete(url)

    # Then
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    assert response.json()["detail"] == "Cannot modify published version."

    segment_override.refresh_from_db()
    assert segment_override.deleted is False


def test_cannot_delete_environment_default_feature_state_for_unpublished_environment_feature_version(
    admin_client: APIClient,
    admin_user: FFAdminUser,
    environment_v2_versioning: Environment,
    feature: Feature,
) -> None:
    # Given
    # an unpublished environment feature version
    environment_feature_version = EnvironmentFeatureVersion.objects.create(
        environment=environment_v2_versioning, feature=feature
    )

    # and the environment default feature state in the feature version
    segment_override = FeatureState.objects.get(
        environment_feature_version=environment_feature_version,
        feature=feature,
        environment=environment_v2_versioning,
        feature_segment__isnull=True,
        identity__isnull=True,
    )

    url = reverse(
        "api-v1:versioning:environment-feature-version-featurestates-detail",
        args=[
            environment_v2_versioning.id,
            feature.id,
            environment_feature_version.uuid,
            segment_override.id,
        ],
    )

    # When
    response = admin_client.delete(url)

    # Then
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    assert (
        response.json()["detail"] == "Cannot delete environment default feature state."
    )

    segment_override.refresh_from_db()
    assert segment_override.deleted is False


def test_filter_versions_by_is_live(
    environment_v2_versioning: Environment,
    feature: Feature,
    staff_user: FFAdminUser,
    staff_client: APIClient,
    with_environment_permissions: WithEnvironmentPermissionsCallable,
    with_project_permissions: WithProjectPermissionsCallable,
) -> None:
    # Given
    # we give the user the correct permissions
    with_environment_permissions([VIEW_ENVIRONMENT], environment_v2_versioning.id)
    with_project_permissions([VIEW_PROJECT])

    # an unpublished environment feature version
    unpublished_environment_feature_version = EnvironmentFeatureVersion.objects.create(
        environment=environment_v2_versioning, feature=feature
    )

    # and a published version
    published_environment_feature_version = EnvironmentFeatureVersion.objects.create(
        environment=environment_v2_versioning, feature=feature
    )
    published_environment_feature_version.publish(staff_user)

    _base_url = reverse(
        "api-v1:versioning:environment-feature-versions-list",
        args=[environment_v2_versioning.id, feature.id],
    )
    live_versions_url = "%s?is_live=true" % _base_url
    not_live_versions_url = "%s?is_live=false" % _base_url

    # When
    live_versions_response = staff_client.get(live_versions_url)
    not_live_versions_response = staff_client.get(not_live_versions_url)

    # Then
    # only the live versions are returned (the initial version) and the one we
    # published above when we request the live versions
    assert live_versions_response.status_code == status.HTTP_200_OK

    live_versions_response_json = live_versions_response.json()
    assert live_versions_response_json["count"] == 2
    assert unpublished_environment_feature_version.uuid not in [
        result["uuid"] for result in live_versions_response_json["results"]
    ]

    # and only the unpublished version is returned when we request the 'not live' versions
    assert not_live_versions_response.status_code == status.HTTP_200_OK

    not_live_versions_response_json = not_live_versions_response.json()
    assert not_live_versions_response_json["count"] == 1
    assert not_live_versions_response_json["results"][0]["uuid"] == str(
        unpublished_environment_feature_version.uuid
    )


def test_disable_v2_versioning_returns_bad_request_if_not_using_v2_versioning(
    environment: Environment,
    staff_client: APIClient,
    with_environment_permissions: WithEnvironmentPermissionsCallable,
) -> None:
    # Given
    url = reverse(
        "api-v1:environments:environment-disable-v2-versioning",
        args=[environment.api_key],
    )

    with_environment_permissions(
        permission_keys=[], environment_id=environment.id, admin=True
    )

    # When
    response = staff_client.post(url)

    # Then
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_create_new_version_with_changes_in_single_request(
    feature: Feature,
    segment: Segment,
    segment_featurestate: FeatureState,
    admin_client_new: APIClient,
    environment_v2_versioning: Environment,
) -> None:
    # Given
    additional_segment_1 = Segment.objects.create(
        name="additional-segment-1", project=feature.project
    )
    additional_segment_2 = Segment.objects.create(
        name="additional-segment-2", project=feature.project
    )

    url = reverse(
        "api-v1:versioning:environment-feature-versions-list",
        args=[environment_v2_versioning.id, feature.id],
    )

    data = {
        "publish_immediately": True,
        "feature_states_to_update": [
            {
                "feature_segment": None,
                "enabled": True,
                "feature_state_value": {"type": "unicode", "string_value": "updated!"},
            }
        ],
        "feature_states_to_create": [
            {
                "feature_segment": {
                    "segment": additional_segment_1.id,
                    "priority": 2,
                },
                "enabled": True,
                "feature_state_value": {
                    "type": "unicode",
                    "string_value": "segment-override-1",
                },
            },
            {
                "feature_segment": {
                    "segment": additional_segment_2.id,
                    "priority": 1,
                },
                "enabled": True,
                "feature_state_value": {
                    "type": "unicode",
                    "string_value": "segment-override-2",
                },
            },
        ],
        "segment_ids_to_delete_overrides": [segment.id],
    }

    # When
    response = admin_client_new.post(
        url, data=json.dumps(data), content_type="application/json"
    )

    # Then
    assert response.status_code == status.HTTP_201_CREATED

    new_version_uuid = response.json()["uuid"]
    new_version = EnvironmentFeatureVersion.objects.get(uuid=new_version_uuid)

    assert new_version.feature_states.count() == 3

    new_version_environment_fs = new_version.feature_states.filter(
        feature_segment__isnull=True
    ).get()
    assert new_version_environment_fs.get_feature_state_value() == "updated!"
    assert new_version_environment_fs.enabled is True

    new_version_segment_fs_1 = new_version.feature_states.filter(
        feature_segment__segment=additional_segment_1
    ).get()
    assert new_version_segment_fs_1.get_feature_state_value() == "segment-override-1"
    assert new_version_segment_fs_1.enabled is True
    assert new_version_segment_fs_1.feature_segment.priority == 2

    new_version_segment_fs_2 = new_version.feature_states.filter(
        feature_segment__segment=additional_segment_2
    ).get()
    assert new_version_segment_fs_2.get_feature_state_value() == "segment-override-2"
    assert new_version_segment_fs_2.enabled is True
    assert new_version_segment_fs_2.feature_segment.priority == 1

    assert not new_version.feature_states.filter(
        feature_segment__segment=segment
    ).exists()

    assert new_version.published is True
    assert new_version.is_live is True


def test_update_and_create_segment_override_in_single_request(
    feature: Feature,
    segment: Segment,
    segment_featurestate: FeatureState,
    admin_client: APIClient,
    environment_v2_versioning: Environment,
) -> None:
    # Given
    additional_segment = Segment.objects.create(
        name="additional-segment", project=feature.project
    )

    url = reverse(
        "api-v1:versioning:environment-feature-versions-list",
        args=[environment_v2_versioning.id, feature.id],
    )

    data = {
        "publish_immediately": True,
        "feature_states_to_update": [
            {
                "feature_segment": {"segment": segment.id, "priority": 2},
                "enabled": True,
                "feature_state_value": {
                    "type": "unicode",
                    "string_value": "updated-segment-override",
                },
            }
        ],
        "feature_states_to_create": [
            {
                "feature_segment": {
                    "segment": additional_segment.id,
                    "priority": 1,
                },
                "enabled": True,
                "feature_state_value": {
                    "type": "unicode",
                    "string_value": "additional-segment-override",
                },
            },
        ],
    }

    # When
    response = admin_client.post(
        url, data=json.dumps(data), content_type="application/json"
    )

    # Then
    assert response.status_code == status.HTTP_201_CREATED

    new_version_uuid = response.json()["uuid"]
    new_version = EnvironmentFeatureVersion.objects.get(uuid=new_version_uuid)

    assert new_version.feature_states.count() == 3

    updated_segment_override = new_version.feature_states.filter(
        feature_segment__segment=segment
    ).get()
    assert (
        updated_segment_override.get_feature_state_value() == "updated-segment-override"
    )
    assert updated_segment_override.enabled is True
    assert updated_segment_override.feature_segment.priority == 2

    new_segment_override = new_version.feature_states.filter(
        feature_segment__segment=additional_segment
    ).get()
    assert (
        new_segment_override.get_feature_state_value() == "additional-segment-override"
    )
    assert new_segment_override.enabled is True
    assert new_segment_override.feature_segment.priority == 1

    assert new_version.published is True
    assert new_version.is_live is True
