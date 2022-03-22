from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from features.workflows.models import ChangeRequestApproval
from users.models import FFAdminUser


def test_approve_change_request_when_no_required_approvals(
    change_request_no_required_approvals, admin_client, admin_user, environment
):
    # Given
    url = reverse(
        "api-v1:features:workflows:change-requests-approve",
        args=(change_request_no_required_approvals.id,),
    )

    # When
    response = admin_client.post(url)

    # Then
    assert response.status_code == status.HTTP_200_OK

    # a new approval object exists for the change request now
    assert change_request_no_required_approvals.approvals.count() == 1
    approval = change_request_no_required_approvals.approvals.first()
    assert approval.user == admin_user
    assert approval.approved_at


def test_approve_change_request_when_required_approvals_for_same_user(
    change_request_no_required_approvals, admin_client, admin_user
):
    # Given
    approval = ChangeRequestApproval.objects.create(
        user=admin_user,
        change_request=change_request_no_required_approvals,
    )

    url = reverse(
        "api-v1:features:workflows:change-requests-approve",
        args=(change_request_no_required_approvals.id,),
    )

    # When
    response = admin_client.post(url)

    # Then
    assert response.status_code == status.HTTP_200_OK

    # the existing approval record is updated correctly
    assert change_request_no_required_approvals.approvals.count() == 1
    approval.refresh_from_db()
    assert approval.approved_at


def test_approve_change_request_when_required_approvals_for_another_user(
    change_request_no_required_approvals, admin_client, admin_user, organisation_one
):
    # Given
    another_user = FFAdminUser.objects.create(email="another_user@organisationone.com")
    another_user.add_organisation(organisation_one)

    existing_approval = ChangeRequestApproval.objects.create(
        user=another_user,
        change_request=change_request_no_required_approvals,
    )

    url = reverse(
        "api-v1:features:workflows:change-requests-approve",
        args=(change_request_no_required_approvals.id,),
    )

    # When
    response = admin_client.post(url)

    # Then
    assert response.status_code == status.HTTP_200_OK

    # the existing approval record is not affected and a new one is created
    assert change_request_no_required_approvals.approvals.count() == 2

    existing_approval.refresh_from_db()
    assert existing_approval.approved_at is None

    created_approval = change_request_no_required_approvals.approvals.last()
    assert created_approval.user == admin_user
    assert created_approval.approved_at


def test_commit_change_request_missing_required_approvals(
    change_request_no_required_approvals, admin_client, organisation_one_user
):
    # Given
    ChangeRequestApproval.objects.create(
        user=organisation_one_user, change_request=change_request_no_required_approvals
    )

    url = reverse(
        "api-v1:features:workflows:change-requests-commit",
        args=(change_request_no_required_approvals.id,),
    )

    # When
    response = admin_client.post(url)

    # Then
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    change_request_no_required_approvals.refresh_from_db()
    assert change_request_no_required_approvals.committed_at is None
    assert change_request_no_required_approvals.to_feature_state.version is None


def test_commit_approved_change_request(
    change_request_no_required_approvals, admin_client, organisation_one_user, mocker
):
    # Given
    now = timezone.now()
    ChangeRequestApproval.objects.create(
        user=organisation_one_user,
        change_request=change_request_no_required_approvals,
        required=True,
        approved_at=now,
    )

    mocker.patch("features.workflows.models.timezone.now", return_value=now)

    url = reverse(
        "api-v1:features:workflows:change-requests-commit",
        args=(change_request_no_required_approvals.id,),
    )

    # When
    response = admin_client.post(url)

    # Then
    assert response.status_code == status.HTTP_200_OK

    change_request_no_required_approvals.refresh_from_db()
    assert change_request_no_required_approvals.committed_at == now
    assert change_request_no_required_approvals.to_feature_state.version == 2
    assert change_request_no_required_approvals.to_feature_state.live_from == now
