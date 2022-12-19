# Generated by Django 3.2.16 on 2022-12-19 10:18

from django.db import migrations

from environments.permissions.constants import VIEW_IDENTITIES

from permissions.models import ENVIRONMENT_PERMISSION_TYPE


def add_view_identities_permission(apps, schema_editor):
    PermissionModel = apps.get_model("permissions", "PermissionModel")

    PermissionModel.objects.get_or_create(
        key=VIEW_IDENTITIES,
        description="View identities in the given environment.",
        type=ENVIRONMENT_PERMISSION_TYPE,
    )


def remove_view_identities_permission(apps, schema_editor):
    PermissionModel = apps.get_model("permissions", "PermissionModel")

    PermissionModel.objects.filter(key=VIEW_IDENTITIES).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("environment_permissions", "0004_add_change_request_permissions"),
    ]
    operations = [
        migrations.RunPython(
            add_view_identities_permission,
            reverse_code=remove_view_identities_permission,
        )
    ]
