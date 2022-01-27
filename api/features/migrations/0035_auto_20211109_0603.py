# Generated by Django 2.2.24 on 2021-11-09 06:03

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("features", "0034_merge_20210930_0502"),
    ]

    operations = [
        migrations.AlterField(
            model_name="feature",
            name="initial_value",
            field=models.CharField(
                blank=True, default=None, max_length=20000, null=True
            ),
        ),
        migrations.AlterField(
            model_name="feature",
            name="owners",
            field=models.ManyToManyField(
                blank=True, related_name="owned_features", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AlterField(
            model_name="historicalfeature",
            name="initial_value",
            field=models.CharField(
                blank=True, default=None, max_length=20000, null=True
            ),
        ),
    ]
