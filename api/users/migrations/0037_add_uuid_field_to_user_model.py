# Generated by Django 3.2.25 on 2024-08-12 14:21
from django.apps.registry import Apps
from django.db import migrations, models
import uuid

from django.db.backends.base.schema import BaseDatabaseSchemaEditor


def set_default_uuids(apps: Apps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    user_model = apps.get_model("users", "FFAdminUser")

    users = list(user_model.objects.all())
    for user in users:
        user.uuid = uuid.uuid4()

    user_model.objects.bulk_update(users, fields=["uuid"])


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0036_create_hubspot_lead'),
    ]

    operations = [
        migrations.AddField(
            model_name='ffadminuser',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4),
        ),
        migrations.RunPython(set_default_uuids, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name='ffadminuser',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
