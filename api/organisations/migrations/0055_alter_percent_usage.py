# Generated by Django 3.2.25 on 2024-06-26 18:11

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organisations', '0054_create_api_billing'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organisationapiusagenotification',
            name='percent_usage',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(75), django.core.validators.MaxValueValidator(500)]),
        ),
    ]
