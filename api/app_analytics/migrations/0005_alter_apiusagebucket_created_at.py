# Generated by Django 3.2.16 on 2023-01-18 08:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_analytics', '0004_auto_20230117_1152'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apiusagebucket',
            name='created_at',
            field=models.DateTimeField(),
        ),
    ]
