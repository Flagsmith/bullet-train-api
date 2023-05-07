import json
from unittest import TestCase, mock

import pytest
from django.core import mail
from django.db.utils import IntegrityError
from rest_framework import status
from rest_framework.test import APIClient

from environments.models import Environment
from organisations.models import Organisation, OrganisationRole
from organisations.permissions.models import (
    UserOrganisationPermission,
    UserPermissionGroupOrganisationPermission,
)
from organisations.permissions.permissions import (
    CREATE_PROJECT,
    ORGANISATION_PERMISSIONS,
)
from projects.models import (
    Project,
    ProjectPermissionModel,
    UserProjectPermission,
)
from users.models import FFAdminUser, UserPermissionGroup
from users.tasks import send_email_changed_notification_email


@pytest.mark.django_db
class FFAdminUserTestCase(TestCase):
    def setUp(self) -> None:
        self.user = FFAdminUser.objects.create(email="test@example.com")
        self.organisation = Organisation.objects.create(name="Test Organisation")

        self.project_1 = Project.objects.create(
            name="Test project 1", organisation=self.organisation
        )
        self.project_2 = Project.objects.create(
            name="Test project 2", organisation=self.organisation
        )

        self.environment_1 = Environment.objects.create(
            name="Test Environment 1", project=self.project_1
        )
        self.environment_2 = Environment.objects.create(
            name="Test Environment 2", project=self.project_2
        )

    def test_user_belongs_to_success(self):
        self.user.add_organisation(self.organisation, OrganisationRole.USER)
        assert self.user.belongs_to(self.organisation.id)

    def test_user_belongs_to_fail(self):
        assert not self.user.belongs_to(self.organisation.id)

    def test_get_permitted_projects_for_org_admin_returns_all_projects(self):
        # Given
        self.user.add_organisation(self.organisation, OrganisationRole.ADMIN)

        # When
        projects = self.user.get_permitted_projects(
            ["VIEW_PROJECT", "CREATE_ENVIRONMENT"]
        )

        # Then
        assert projects.count() == 2

    def test_get_permitted_projects_for_user_returns_only_projects_matching_permission(
        self,
    ):
        # Given
        self.user.add_organisation(self.organisation, OrganisationRole.USER)
        user_project_permission = UserProjectPermission.objects.create(
            user=self.user, project=self.project_1
        )
        read_permission = ProjectPermissionModel.objects.get(key="VIEW_PROJECT")
        user_project_permission.permissions.set([read_permission])

        # When
        projects = self.user.get_permitted_projects(permissions=["VIEW_PROJECT"])

        # Then
        assert projects.count() == 1

    def test_get_admin_organisations(self):
        # Given
        self.user.add_organisation(self.organisation, OrganisationRole.ADMIN)

        # When
        admin_orgs = self.user.get_admin_organisations()

        # Then
        assert self.organisation in admin_orgs

    def test_get_permitted_environments_for_org_admin_returns_all_environments_for_project(
        self,
    ):
        # Given
        self.user.add_organisation(self.organisation, OrganisationRole.ADMIN)

        # When
        environments = self.user.get_permitted_environments(
            "VIEW_ENVIRONMENT", project=self.project_1
        )

        # Then
        assert environments.count() == self.project_1.environments.count()

    def test_get_permitted_environments_for_user_returns_only_environments_matching_permission(
        self,
    ):
        # Given
        self.user.add_organisation(self.organisation, OrganisationRole.USER)

        # When
        environments = self.user.get_permitted_environments(
            "VIEW_ENVIRONMENT", project=self.project_1
        )

        # Then
        assert len(list(environments)) == 0

    def test_unique_user_organisation(self):
        # Given organisation and user

        # When
        self.user.add_organisation(self.organisation, OrganisationRole.ADMIN)

        # Then
        with pytest.raises(IntegrityError):
            self.user.add_organisation(self.organisation, OrganisationRole.USER)

    def test_has_organisation_permission_is_true_for_organisation_admin(self):
        # Given
        self.user.add_organisation(self.organisation, OrganisationRole.ADMIN)

        # Then
        assert all(
            self.user.has_organisation_permission(
                organisation=self.organisation, permission_key=permission_key
            )
            for permission_key, _ in ORGANISATION_PERMISSIONS
        )

    def test_has_organisation_permission_is_true_when_user_has_permission(self):
        # Given
        self.user.add_organisation(self.organisation)

        for permission_key, _ in ORGANISATION_PERMISSIONS:
            user_organisation_permission = UserOrganisationPermission.objects.create(
                user=self.user, organisation=self.organisation
            )
            user_organisation_permission.permissions.through.objects.create(
                permissionmodel_id=permission_key,
                userorganisationpermission=user_organisation_permission,
            )

        # Then
        assert all(
            self.user.has_organisation_permission(
                organisation=self.organisation, permission_key=permission_key
            )
            for permission_key, _ in ORGANISATION_PERMISSIONS
        )

    def test_has_organisation_permission_is_false_when_user_does_not_have_permission(
        self,
    ):
        # Given
        self.user.add_organisation(self.organisation)

        # Then
        assert not any(
            self.user.has_organisation_permission(
                organisation=self.organisation, permission_key=permission_key
            )
            for permission_key, _ in ORGANISATION_PERMISSIONS
        )


@pytest.mark.django_db
@pytest.mark.parametrize(
    "user_permission_keys, group_permission_keys, expected_keys",
    (
        ([], [], set()),
        ([CREATE_PROJECT], [], {CREATE_PROJECT}),
        ([], [CREATE_PROJECT], {CREATE_PROJECT}),
        ([CREATE_PROJECT], [CREATE_PROJECT], {CREATE_PROJECT}),
    ),
)
def test_get_permission_keys_for_organisation(
    user_permission_keys, group_permission_keys, expected_keys
):
    # Given
    user = FFAdminUser.objects.create(email="test@example.com")
    organisation = Organisation.objects.create(name="Test org")
    user.add_organisation(organisation)
    group = UserPermissionGroup.objects.create(
        name="Test group", organisation=organisation
    )
    group.users.add(user)

    if user_permission_keys:
        user_permission = UserOrganisationPermission.objects.create(
            user=user, organisation=organisation
        )
        user_permission.set_permissions(user_permission_keys)

    if group_permission_keys:
        group_permission = UserPermissionGroupOrganisationPermission.objects.create(
            group=group, organisation=organisation
        )
        group_permission.set_permissions(group_permission_keys)

    # When
    permission_keys = user.get_permission_keys_for_organisation(organisation)

    # Then
    assert permission_keys == expected_keys


@pytest.mark.django_db
def test_creating_a_user_calls_mailer_lite_subscribe(mocker):
    # Given
    mailer_lite_mock = mocker.patch("users.models.mailer_lite")
    # When
    user = FFAdminUser.objects.create(
        email="test@mail.com",
    )
    # Then
    mailer_lite_mock.subscribe.assert_called_with(user)


@pytest.mark.django_db
def test_user_add_organisation_does_not_call_mailer_lite_subscribe_for_unpaid_organisation(
    mocker,
):
    user = FFAdminUser.objects.create(email="test@example.com")
    organisation = Organisation.objects.create(name="Test Organisation")
    mailer_lite_mock = mocker.patch("users.models.mailer_lite")
    mocker.patch(
        "organisations.models.Organisation.is_paid",
        new_callable=mock.PropertyMock,
        return_value=False,
    )
    # When
    user.add_organisation(organisation, OrganisationRole.USER)

    # Then
    mailer_lite_mock.subscribe.assert_not_called()


@pytest.mark.django_db
def test_user_add_organisation_calls_mailer_lite_subscribe_for_paid_organisation(
    mocker,
):
    mailer_lite_mock = mocker.patch("users.models.mailer_lite")
    user = FFAdminUser.objects.create(email="test@example.com")
    organisation = Organisation.objects.create(name="Test Organisation")
    mocker.patch(
        "organisations.models.Organisation.is_paid",
        new_callable=mock.PropertyMock,
        return_value=True,
    )
    # When
    user.add_organisation(organisation, OrganisationRole.USER)

    # Then
    mailer_lite_mock.subscribe.assert_called_with(user)


def test_user_add_organisation_adds_user_to_the_default_user_permission_group(
    test_user, organisation, default_user_permission_group, user_permission_group
):
    # When
    test_user.add_organisation(organisation, OrganisationRole.USER)

    # Then
    assert default_user_permission_group in test_user.permission_groups.all()
    assert user_permission_group not in test_user.permission_groups.all()


def test_user_remove_organisation_removes_user_from_the_user_permission_group(
    user_permission_group, admin_user, organisation, default_user_permission_group
):
    # Given - two groups that belongs to the same organisation, but user
    # is only part of one(`user_permission_group`) them

    # When
    admin_user.remove_organisation(organisation)

    # Then
    # extra group did not cause any errors and the user is removed from the group
    assert user_permission_group not in admin_user.permission_groups.all()


def test_user_create_calls_pipedrive_tracking(mocker, db, settings):
    # Given
    mocked_create_pipedrive_lead = mocker.patch("users.signals.create_pipedrive_lead")
    settings.ENABLE_PIPEDRIVE_LEAD_TRACKING = True

    # When
    FFAdminUser.objects.create(email="test@example.com")

    # Then
    mocked_create_pipedrive_lead.delay.assert_called()


def test_user_create_does_not_call_pipedrive_tracking_if_ignored_domain(
    mocker, db, settings
):
    # Given
    mocked_create_pipedrive_lead = mocker.patch("users.signals.create_pipedrive_lead")
    settings.ENABLE_PIPEDRIVE_LEAD_TRACKING = True
    settings.PIPEDRIVE_IGNORE_DOMAINS = ["example.com"]

    # When
    FFAdminUser.objects.create(email="test@example.com")

    # Then
    mocked_create_pipedrive_lead.delay.assert_not_called()


def test_user_email_domain_property():
    assert FFAdminUser(email="test@example.com").email_domain == "example.com"


@pytest.mark.django_db
def test_change_email_address_api(mocker):
    # Given
    mocked_send_mail = mocker.patch("users.tasks.send_mail")
    # create an user
    user = FFAdminUser.objects.create(
        username="test_user",
        email="test_user@test.com",
        first_name="test",
        last_name="user",
    )
    user.set_password("password")

    client = APIClient()
    client.force_authenticate(user)

    data = {"new_email": "test_user1@test.com", "current_password": "password"}

    url = "/api/v1/auth/users/set_email/"

    # When
    response = client.post(url, data=json.dumps(data), content_type="application/json")

    # Then
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert user.email == "test_user1@test.com"

    args, kwargs = mocked_send_mail.call_args

    assert len(args) == 0
    assert len(kwargs) == 5
    assert kwargs["subject"] == "Your Flagsmith email address has been changed"
    assert kwargs["from_email"] == "noreply@flagsmith.com"
    assert kwargs["recipient_list"] == ["test_user@test.com"]
    assert kwargs["fail_silently"] is True


def test_send_email_changed_notification():
    # When
    send_email_changed_notification_email(
        first_name="first_name",
        from_email="fromtest@test.com",
        original_email="test2@test.com",
    )

    # Then
    assert len(mail.outbox) == 1
    assert mail.outbox[0].subject == "Your Flagsmith email address has been changed"
    assert mail.outbox[0].from_email == "fromtest@test.com"
    assert mail.outbox[0].recipients() == ["test2@test.com"]
