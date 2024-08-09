# Generated by Django 3.2.25 on 2024-08-09 14:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("workflows_core", "0009_prevent_cascade_delete_from_user_delete"),
        ("segments", "0025_set_default_version_on_segment"),
    ]

    operations = [
        migrations.AddField(
            model_name="historicalsegment",
            name="change_request",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="+",
                to="workflows_core.changerequest",
            ),
        ),
        migrations.AddField(
            model_name="segment",
            name="change_request",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="segments",
                to="workflows_core.changerequest",
            ),
        ),
    ]
