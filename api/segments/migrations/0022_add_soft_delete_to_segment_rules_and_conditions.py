# Generated by Django 3.2.24 on 2024-03-07 15:41

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("segments", "0021_create_whitelisted_segments"),
    ]

    operations = [
        migrations.AddField(
            model_name="segmentrule",
            name="deleted_at",
            field=models.DateTimeField(
                blank=True, db_index=True, default=None, editable=False, null=True
            ),
        ),
        migrations.AddField(
            model_name='condition',
            name='deleted_at',
            field=models.DateTimeField(blank=True, db_index=True, default=None, editable=False, null=True),
        ),
        migrations.AddField(
            model_name='historicalcondition',
            name='deleted_at',
            field=models.DateTimeField(blank=True, db_index=True, default=None, editable=False, null=True),
        ),
    ]
