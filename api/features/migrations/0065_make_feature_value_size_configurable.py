# Generated by Django 3.2.25 on 2024-08-01 21:09
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('features', '0064_fix_feature_help_text_typo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feature',
            name='initial_value',
            field=models.CharField(blank=True, max_length=settings.FEATURE_VALUE_LIMIT, null=True, default=None),
        ),
        migrations.AlterField(
            model_name='historicalfeature',
            name='initial_value',
            field=models.CharField(blank=True, max_length=settings.FEATURE_VALUE_LIMIT, null=True, default=None),
        ),
        migrations.AlterField(
            model_name='featurestatevalue',
            name='string_value',
            field=models.CharField(blank=True, max_length=settings.FEATURE_VALUE_LIMIT, null=True),
        ),
        migrations.AlterField(
            model_name='historicalfeaturestatevalue',
            name='string_value',
            field=models.CharField(blank=True, max_length=settings.FEATURE_VALUE_LIMIT, null=True),
        ),
    ]
