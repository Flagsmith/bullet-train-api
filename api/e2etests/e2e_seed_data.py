from common.environments.permissions import (
    UPDATE_FEATURE_STATE,
    VIEW_ENVIRONMENT,
    VIEW_IDENTITIES,
)
from common.projects.permissions import (
    CREATE_ENVIRONMENT,
    CREATE_FEATURE,
    VIEW_AUDIT_LOG,
    VIEW_PROJECT,
)
from django.conf import settings
from flag_engine.identities.models import IdentityModel as EngineIdentity

from edge_api.identities.models import EdgeIdentity
from environments.identities.models import Identity
from environments.models import Environment
from environments.permissions.models import UserEnvironmentPermission
from organisations.models import Organisation, OrganisationRole, Subscription
from organisations.permissions.models import UserOrganisationPermission
from organisations.permissions.permissions import (
    CREATE_PROJECT,
    MANAGE_USER_GROUPS,
)
from organisations.subscriptions.constants import ENTERPRISE
from projects.models import Project, UserProjectPermission
from users.models import FFAdminUser, UserPermissionGroup

# Password used by all the test users
PASSWORD = "Str0ngp4ssw0rd!"

PROJECT_PERMISSION_PROJECT = "My Test Project 5 Project Permission"
ENV_PERMISSION_PROJECT = "My Test Project 6 Env Permission"


def delete_user_and_its_organisations(user_email: str) -> None:
    user: FFAdminUser | None = FFAdminUser.objects.filter(email=user_email).first()

    if user:
        user.organisations.all().delete()
        user.delete()


def teardown() -> None:
    # delete users and their orgs created for e2e test by front end
    delete_user_and_its_organisations(user_email=settings.E2E_SIGNUP_USER)
    delete_user_and_its_organisations(user_email=settings.E2E_USER)
    delete_user_and_its_organisations(user_email=settings.E2E_CHANGE_EMAIL_USER)
    delete_user_and_its_organisations(
        user_email=settings.E2E_NON_ADMIN_USER_WITH_ORG_PERMISSIONS
    )
    delete_user_and_its_organisations(
        user_email=settings.E2E_NON_ADMIN_USER_WITH_PROJECT_PERMISSIONS
    )
    delete_user_and_its_organisations(
        user_email=settings.E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS
    )
    delete_user_and_its_organisations(
        user_email=settings.E2E_NON_ADMIN_USER_WITH_A_ROLE
    )


def seed_data() -> None:
    # create user and organisation for e2e test by front end
    organisation: Organisation = Organisation.objects.create(name="Bullet Train Ltd")
    org_admin: FFAdminUser = FFAdminUser.objects.create_user(
        email=settings.E2E_USER,
        password=PASSWORD,
        username=settings.E2E_USER,
    )
    org_admin.add_organisation(organisation, OrganisationRole.ADMIN)
    non_admin_user_with_org_permissions: FFAdminUser = FFAdminUser.objects.create_user(
        email=settings.E2E_NON_ADMIN_USER_WITH_ORG_PERMISSIONS,
        password=PASSWORD,
    )
    non_admin_user_with_project_permissions: FFAdminUser = (
        FFAdminUser.objects.create_user(
            email=settings.E2E_NON_ADMIN_USER_WITH_PROJECT_PERMISSIONS,
            password=PASSWORD,
        )
    )
    non_admin_user_with_env_permissions: FFAdminUser = FFAdminUser.objects.create_user(
        email=settings.E2E_NON_ADMIN_USER_WITH_ENV_PERMISSIONS,
        password=PASSWORD,
    )
    non_admin_user_with_a_role: FFAdminUser = FFAdminUser.objects.create_user(
        email=settings.E2E_NON_ADMIN_USER_WITH_A_ROLE,
        password=PASSWORD,
    )
    non_admin_user_with_org_permissions.add_organisation(
        organisation,
    )
    non_admin_user_with_project_permissions.add_organisation(
        organisation,
    )
    non_admin_user_with_env_permissions.add_organisation(
        organisation,
    )
    non_admin_user_with_a_role.add_organisation(
        organisation,
    )

    # Add permissions to the non-admin user with org permissions
    user_org_permission = UserOrganisationPermission.objects.create(
        user=non_admin_user_with_org_permissions, organisation=organisation
    )
    user_org_permission.add_permission(CREATE_PROJECT)
    user_org_permission.add_permission(MANAGE_USER_GROUPS)
    UserPermissionGroup.objects.create(name="TestGroup", organisation=organisation)

    # We add different projects and environments to give each e2e test its own isolated context.
    project_test_data = [
        {
            "name": "My Test Project",
            "environments": [
                "Development",
                "Production",
            ],
        },
        {"name": "My Test Project 2", "environments": ["Development"]},
        {"name": "My Test Project 3", "environments": ["Development"]},
        {"name": "My Test Project 4", "environments": ["Development"]},
        {
            "name": PROJECT_PERMISSION_PROJECT,
            "environments": ["Development"],
        },
        {"name": ENV_PERMISSION_PROJECT, "environments": ["Development"]},
        {"name": "My Test Project 7 Role", "environments": ["Development"]},
    ]
    # Upgrade organisation seats
    Subscription.objects.filter(organisation__in=org_admin.organisations.all()).update(
        max_seats=8, plan=ENTERPRISE, subscription_id="test_subscription_id"
    )

    # Create projects and environments
    projects = []
    environments = []
    for project_info in project_test_data:
        project = Project.objects.create(
            name=project_info["name"], organisation=organisation
        )
        if project_info["name"] == PROJECT_PERMISSION_PROJECT:
            # Add permissions to the non-admin user with project permissions
            user_proj_permission: UserProjectPermission = (
                UserProjectPermission.objects.create(
                    user=non_admin_user_with_project_permissions, project=project
                )
            )
            [
                user_proj_permission.add_permission(permission_key)
                for permission_key in [
                    VIEW_PROJECT,
                    CREATE_ENVIRONMENT,
                    CREATE_FEATURE,
                    VIEW_AUDIT_LOG,
                ]
            ]
        projects.append(project)

        for env_name in project_info["environments"]:
            environment = Environment.objects.create(name=env_name, project=project)

            if project_info["name"] == ENV_PERMISSION_PROJECT:
                # Add permissions to the non-admin user with env permissions
                user_env_permission = UserEnvironmentPermission.objects.create(
                    user=non_admin_user_with_env_permissions, environment=environment
                )
                user_env_proj_permission: UserProjectPermission = (
                    UserProjectPermission.objects.create(
                        user=non_admin_user_with_env_permissions, project=project
                    )
                )
                user_env_proj_permission.add_permission(VIEW_PROJECT)
                user_env_proj_permission.add_permission(CREATE_FEATURE)
                [
                    user_env_permission.add_permission(permission_key)
                    for permission_key in [
                        VIEW_ENVIRONMENT,
                        UPDATE_FEATURE_STATE,
                        VIEW_IDENTITIES,
                    ]
                ]
            environments.append(environment)

    # We're only creating identities for 6 of the 7 environments because
    # they are necessary for the environments created above and to keep
    # the e2e tests isolated."
    identities_test_data = [
        {"identifier": settings.E2E_IDENTITY, "environment": environments[2]},
        {"identifier": settings.E2E_IDENTITY, "environment": environments[3]},
        {"identifier": settings.E2E_IDENTITY, "environment": environments[4]},
        {"identifier": settings.E2E_IDENTITY, "environment": environments[5]},
        {"identifier": settings.E2E_IDENTITY, "environment": environments[6]},
        {"identifier": settings.E2E_IDENTITY, "environment": environments[7]},
    ]

    for identity_info in identities_test_data:
        if settings.IDENTITIES_TABLE_NAME_DYNAMO:
            engine_identity = EngineIdentity(  # pragma: no cover
                identifier=identity_info["identifier"],
                environment_api_key=identity_info["environment"].api_key,
            )
            EdgeIdentity(engine_identity).save()  # pragma: no cover
        else:
            Identity.objects.create(**identity_info)
