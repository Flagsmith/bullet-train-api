from datetime import timedelta

import pytest
from django.contrib.sites.models import Site
from django.utils import timezone

from audit.constants import (
    CHANGE_REQUEST_APPROVED_MESSAGE,
    CHANGE_REQUEST_COMMITTED_MESSAGE,
    CHANGE_REQUEST_CREATED_MESSAGE,
)
from audit.models import AuditLog
from features.workflows.core.exceptions import (
    CannotApproveOwnChangeRequest,
    ChangeRequestNotApprovedError,
)
from features.workflows.core.models import ChangeRequest, ChangeRequestApproval
from users.models import FFAdminUser


def test_change_request_approve_by_required_approver(
    change_request_no_required_approvals, mocker
):
    # Given
    user = FFAdminUser.objects.create(email="approver@example.com")
    approval = ChangeRequestApproval.objects.create(
        user=user, change_request=change_request_no_required_approvals
    )
    now = timezone.now()
    mocker.patch("features.workflows.core.models.timezone.now", return_value=now)

    # When
    change_request_no_required_approvals.approve(user=user)

    # Then
    assert change_request_no_required_approvals.approvals.count() == 1
    approval.refresh_from_db()
    assert approval.approved_at == now
    assert approval.user == user


def test_change_request_approve_by_new_approver_when_no_approvals_exist(
    change_request_no_required_approvals, mocker
):
    # Given
    user = FFAdminUser.objects.create(email="approver@example.com")
    now = timezone.now()
    mocker.patch("features.workflows.core.models.timezone.now", return_value=now)

    # When
    change_request_no_required_approvals.approve(user=user)

    # Then
    approval = change_request_no_required_approvals.approvals.first()
    assert approval.approved_at == now
    assert approval.user == user


def test_change_request_approve_by_new_approver_when_approvals_exist(
    change_request_no_required_approvals, mocker
):
    # Given
    user_1 = FFAdminUser.objects.create(email="user_1@example.com")
    user_2 = FFAdminUser.objects.create(email="user_2@example.com")
    approval = ChangeRequestApproval.objects.create(
        user=user_1, change_request=change_request_no_required_approvals
    )
    now = timezone.now()
    mocker.patch("features.workflows.core.models.timezone.now", return_value=now)

    # When
    change_request_no_required_approvals.approve(user=user_2)

    # Then
    assert change_request_no_required_approvals.approvals.count() == 2

    approval.refresh_from_db()
    assert approval.approved_at is None

    assert change_request_no_required_approvals.approvals.filter(
        user=user_2, approved_at__isnull=False
    ).exists()


def test_change_request_is_approved_returns_true_when_minimum_change_request_approvals_is_none(
    change_request_no_required_approvals, mocker, environment
):
    # Given
    change_request_no_required_approvals.environment.minimum_change_request_approvals = (
        None
    )
    change_request_no_required_approvals.save()
    # Then
    assert change_request_no_required_approvals.is_approved() is True


def test_change_request_commit_raises_exception_when_not_approved(
    change_request_1_required_approvals,
):
    # Given
    user_2 = FFAdminUser.objects.create(email="user_2@example.com")

    # When
    with pytest.raises(ChangeRequestNotApprovedError):
        change_request_1_required_approvals.commit(committed_by=user_2)


def test_change_request_commit_not_scheduled(
    change_request_no_required_approvals, mocker
):
    # Given
    user = FFAdminUser.objects.create(email="approver@example.com")

    now = timezone.now()
    mocker.patch("features.workflows.core.models.timezone.now", return_value=now)

    # When
    change_request_no_required_approvals.commit(committed_by=user)

    # Then
    assert change_request_no_required_approvals.committed_at == now
    assert change_request_no_required_approvals.committed_by == user

    assert change_request_no_required_approvals.feature_states.first().version == 2
    assert change_request_no_required_approvals.feature_states.first().live_from == now


def test_creating_a_change_request_creates_audit_log(environment, admin_user):
    # When
    change_request = ChangeRequest.objects.create(
        environment=environment, title="Change Request", user=admin_user
    )
    # Then
    log = CHANGE_REQUEST_CREATED_MESSAGE % change_request.title
    assert (
        AuditLog.objects.filter(
            related_object_id=change_request.id,
            author=admin_user,
            log=log,
        ).count()
        == 1
    )


def test_approving_a_change_request_creates_audit_logs(
    change_request_no_required_approvals, django_user_model, mocker
):
    # Given
    user = django_user_model.objects.create(email="approver@example.com")

    # When
    ChangeRequestApproval.objects.create(
        change_request=change_request_no_required_approvals,
        user=user,
        approved_at=timezone.now(),
    )

    # Then
    log = CHANGE_REQUEST_APPROVED_MESSAGE % change_request_no_required_approvals.title
    assert (
        AuditLog.objects.filter(
            related_object_id=change_request_no_required_approvals.id,
            author=user,
            log=log,
        ).count()
        == 1
    )


def test_change_request_commit_creates_audit_log(
    change_request_no_required_approvals, mocker, django_assert_num_queries
):
    # Given
    user = FFAdminUser.objects.create(email="approver@example.com")

    # When
    change_request_no_required_approvals.commit(committed_by=user)

    # Then
    log = CHANGE_REQUEST_COMMITTED_MESSAGE % change_request_no_required_approvals.title
    assert (
        AuditLog.objects.filter(
            related_object_id=change_request_no_required_approvals.id,
            author=user,
            log=log,
        ).count()
        == 1
    )


def test_change_request_commit_scheduled(
    change_request_no_required_approvals,
    mocker,
):
    # Given
    now = timezone.now()
    tomorrow = now + timedelta(days=1)
    change_request_no_required_approvals.feature_states.update(live_from=tomorrow)

    user = FFAdminUser.objects.create(email="approver@example.com")

    mocker.patch("features.workflows.core.models.timezone.now", return_value=now)

    # When
    change_request_no_required_approvals.commit(committed_by=user)

    # Then
    assert change_request_no_required_approvals.committed_at == now
    assert change_request_no_required_approvals.committed_by == user

    assert change_request_no_required_approvals.feature_states.first().version == 2
    assert (
        change_request_no_required_approvals.feature_states.first().live_from
        == tomorrow
    )


def test_change_request_is_approved_false_when_no_approvals(
    change_request_no_required_approvals, environment_with_1_required_cr_approval
):
    assert change_request_no_required_approvals.is_approved() is False


def test_change_request_is_approved_false_when_unapproved_approvals(
    change_request_no_required_approvals,
    environment_with_1_required_cr_approval,
    django_user_model,
    organisation,
):
    # Given
    user = django_user_model.objects.create(email="user@example.com")
    ChangeRequestApproval.objects.create(
        change_request=change_request_no_required_approvals, user=user
    )

    # Then
    assert change_request_no_required_approvals.is_approved() is False


def test_change_request_is_approved_true_when_enough_approved_approvals(
    change_request_no_required_approvals,
    environment_with_1_required_cr_approval,
    django_user_model,
    organisation,
):
    # Given
    user = django_user_model.objects.create(email="user@example.com")
    change_request_no_required_approvals.approve(user)

    # Then
    assert change_request_no_required_approvals.is_approved() is True


def test_user_cannot_approve_their_own_change_requests(
    change_request_no_required_approvals,
):
    with pytest.raises(CannotApproveOwnChangeRequest):
        change_request_no_required_approvals.approve(
            change_request_no_required_approvals.user
        )


def test_user_is_notified_when_assigned_to_a_change_request(
    change_request_no_required_approvals,
    django_user_model,
    mocker,
    settings,
    mock_render_to_string,
    mock_plaintext_content,
    mock_html_content,
):
    # Given
    mock_send_mail = mocker.patch("features.workflows.core.models.send_mail")
    mocker.patch(
        "features.workflows.core.models.render_to_string", mock_render_to_string
    )

    user = django_user_model.objects.create(email="approver@example.com")

    # When
    ChangeRequestApproval.objects.create(
        change_request=change_request_no_required_approvals, user=user
    )

    # Then
    assert mock_send_mail.call_count == 1
    call_kwargs = mock_send_mail.call_args[1]
    assert call_kwargs["subject"] == change_request_no_required_approvals.email_subject
    assert call_kwargs["message"] == mock_plaintext_content
    assert call_kwargs["html_message"] == mock_html_content
    assert call_kwargs["from_email"] == settings.DEFAULT_FROM_EMAIL
    assert call_kwargs["recipient_list"] == [user.email]


def test_user_is_not_notified_after_approving_a_change_request(
    change_request_no_required_approvals, django_user_model, mocker
):
    # Given
    mock_send_mail = mocker.patch("features.workflows.core.models.send_mail")

    user = django_user_model.objects.create(email="approver@example.com")

    # When
    ChangeRequestApproval.objects.create(
        change_request=change_request_no_required_approvals,
        user=user,
        approved_at=timezone.now(),
    )

    # Then
    # An email is sent to the author but not to the user that approved the request
    assert mock_send_mail.call_count == 1
    assert mock_send_mail.call_args[1]["recipient_list"] == [
        change_request_no_required_approvals.user.email
    ]


def test_change_request_author_is_notified_after_an_approval_is_created(
    mocker,
    change_request_no_required_approvals,
    django_user_model,
    settings,
    mock_render_to_string,
    mock_html_content,
    mock_plaintext_content,
):
    # Given
    mock_send_mail = mocker.patch("features.workflows.core.models.send_mail")
    mocker.patch(
        "features.workflows.core.models.render_to_string", mock_render_to_string
    )

    user = django_user_model.objects.create(email="approver@example.com")

    # When
    ChangeRequestApproval.objects.create(
        change_request=change_request_no_required_approvals,
        user=user,
        approved_at=timezone.now(),
    )

    # Then
    assert mock_send_mail.call_count == 1
    call_kwargs = mock_send_mail.call_args[1]
    assert call_kwargs["subject"] == change_request_no_required_approvals.email_subject
    assert call_kwargs["message"] == mock_plaintext_content
    assert call_kwargs["html_message"] == mock_html_content
    assert call_kwargs["from_email"] == settings.DEFAULT_FROM_EMAIL
    assert call_kwargs["recipient_list"] == [
        change_request_no_required_approvals.user.email
    ]


def test_change_request_author_is_notified_after_an_existing_approval_is_approved(
    mocker,
    django_user_model,
    change_request_no_required_approvals,
    settings,
    mock_render_to_string,
    mock_html_content,
    mock_plaintext_content,
):
    # Given
    mock_send_mail = mocker.patch("features.workflows.core.models.send_mail")
    mocker.patch(
        "features.workflows.core.models.render_to_string", mock_render_to_string
    )

    user = django_user_model.objects.create(email="approver@example.com")

    change_request_approval = ChangeRequestApproval.objects.create(
        change_request=change_request_no_required_approvals, user=user
    )

    # When
    change_request_approval.approved_at = timezone.now()
    change_request_approval.save()

    # Then
    # 2 emails are sent
    assert mock_send_mail.call_count == 2
    call_args_list = mock_send_mail.call_args_list

    # The first one should be to the user that was assigned to approve it
    assert call_args_list[0][1]["recipient_list"] == [user.email]

    # The second one should be to the change request author
    call_kwargs = call_args_list[1][1]
    assert call_kwargs["subject"] == change_request_no_required_approvals.email_subject
    assert call_kwargs["message"] == mock_plaintext_content
    assert call_kwargs["html_message"] == mock_html_content
    assert call_kwargs["from_email"] == settings.DEFAULT_FROM_EMAIL
    assert call_kwargs["recipient_list"] == [
        change_request_no_required_approvals.user.email
    ]


def test_change_request_url(change_request_no_required_approvals, settings):
    # Given
    site = Site.objects.filter(id=settings.SITE_ID).first()
    environment_key = change_request_no_required_approvals.environment.api_key
    project_id = change_request_no_required_approvals.environment.project.id

    # Then
    assert (
        change_request_no_required_approvals.url
        == "https://%s/project/%s/environment/%s/change-requests/%s"
        % (
            site.domain,
            project_id,
            environment_key,
            change_request_no_required_approvals.id,
        )
    )


def test_change_request_email_subject(change_request_no_required_approvals):
    assert (
        change_request_no_required_approvals.email_subject
        == "Flagsmith Change Request: %s (#%s)"
        % (
            change_request_no_required_approvals.title,
            change_request_no_required_approvals.id,
        )
    )


def test_schedule_audit_log_creation_task_for_feature_state_going_live_does_nothing_if_not_scheduled_for_future(
    settings, change_request_no_required_approvals, mocker
):
    # Given
    settings.EDGE_ENABLED = True
    mock_create_feature_state_went_live_audit_log = mocker.patch(
        "features.workflows.core.models.create_feature_state_went_live_audit_log"
    )

    now = timezone.now()

    assert change_request_no_required_approvals.feature_states.exists()
    assert not change_request_no_required_approvals.feature_states.filter(
        live_from__gt=now
    ).exists()

    # When
    change_request_no_required_approvals.schedule_audit_log_creation_task_for_feature_state_going_live()

    # Then
    mock_create_feature_state_went_live_audit_log.delay.assert_not_called()


def test_schedule_audit_log_creation_task_for_feature_state_going_live_schedules_tasks_correctly(
    settings, change_request_no_required_approvals, mocker
):
    # Given
    mock_create_feature_state_went_live_audit_log = mocker.patch(
        "features.workflows.core.models.create_feature_state_went_live_audit_log"
    )

    now = timezone.now()
    tomorrow = now + timedelta(days=1)
    change_request_no_required_approvals.feature_states.all().update(live_from=tomorrow)

    # When
    change_request_no_required_approvals.schedule_audit_log_creation_task_for_feature_state_going_live()

    # Then
    mock_create_feature_state_went_live_audit_log.delay.assert_called_once_with(
        delay_until=tomorrow,
        args=(change_request_no_required_approvals.feature_states.all().first().id,),
    )
