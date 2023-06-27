# Generated by Django 3.2.18 on 2023-06-26 05:05

from django.db import migrations

from util.migrations import merge_duplicate_permissions


def merge_duplicate_project_permissions(apps, schema_editor):
    UserEnvironmentPermission = apps.get_model(
        "environment_permissions", "UserEnvironmentPermission"
    )
    UserPermissionGroupEnvironmentPermission = apps.get_model(
        "environment_permissions", "UserPermissionGroupEnvironmentPermission"
    )
    merge_duplicate_permissions(UserEnvironmentPermission, ["user", "environment"])
    merge_duplicate_permissions(
        UserPermissionGroupEnvironmentPermission, ["group", "environment"]
    )


class Migration(migrations.Migration):
    dependencies = [
        ("environment_permissions", "0005_add_view_identity_permissions"),
    ]

    operations = [
        migrations.RunPython(
            merge_duplicate_project_permissions,
            reverse_code=migrations.RunPython.noop,
        )
    ]
