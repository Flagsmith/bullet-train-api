# Generated by Django 3.2.16 on 2022-12-08 11:02

from django.apps.registry import Apps
from django.db import migrations
from django.db.backends.base.schema import BaseDatabaseSchemaEditor

from organisations.permissions.permissions import VIEW_AUDIT_LOG
from permissions.models import ORGANISATION_PERMISSION_TYPE, PROJECT_PERMISSION_TYPE


def move_permission_to_project(
    apps: Apps, schema_editor: BaseDatabaseSchemaEditor
):
    permission_model_class = apps.get_model("permissions", "PermissionModel")

    permission_model_class.objects.filter(
        key=VIEW_AUDIT_LOG,
    ).update(
        key=VIEW_AUDIT_LOG,
        type=PROJECT_PERMISSION_TYPE,
        description="Allows the user to view the audit logs for this project.",
    )


def move_permission_to_organisation(
    apps: Apps, schema_editor: BaseDatabaseSchemaEditor
):
    permission_model_class = apps.get_model("permissions", "PermissionModel")

    permission_model_class.objects.filter(
        key=VIEW_AUDIT_LOG,
    ).update(
        key=VIEW_AUDIT_LOG,
        type=ORGANISATION_PERMISSION_TYPE,
        description="Allows the user to view the audit logs for this organisation.",
    )


class Migration(migrations.Migration):
    dependencies = [
        ("permissions", "0008_add_view_audit_log_permission"),
    ]

    operations = [
        migrations.RunPython(
            move_permission_to_project, reverse_code=move_permission_to_organisation
        )
    ]