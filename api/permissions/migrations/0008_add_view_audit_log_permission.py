# Generated by Django 3.2.16 on 2022-12-08 11:02

from common.projects.permissions import VIEW_AUDIT_LOG
from django.apps.registry import Apps
from django.db import migrations
from django.db.backends.base.schema import BaseDatabaseSchemaEditor

from permissions.models import ORGANISATION_PERMISSION_TYPE


def create_permissions(apps: Apps, schema_editor: BaseDatabaseSchemaEditor):
    permission_model_class = apps.get_model("permissions", "PermissionModel")

    permission_model_class.objects.get_or_create(
        key=VIEW_AUDIT_LOG,
        defaults={
            "description": "Allows the user to view the audit logs for this organisation.",
            "type": ORGANISATION_PERMISSION_TYPE,
        },
    )


def remove_permissions(apps: Apps, schema_editor: BaseDatabaseSchemaEditor):
    apps.get_model("permissions", "PermissionModel").objects.filter(
        key=VIEW_AUDIT_LOG
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("permissions", "0007_add_invite_users_and_manage_user_groups_org_permissions"),
    ]

    operations = [
        migrations.RunPython(create_permissions, reverse_code=remove_permissions)
    ]
