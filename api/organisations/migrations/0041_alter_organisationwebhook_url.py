# Generated by Django 3.2.19 on 2023-06-14 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organisations', '0040_organisationsubscriptioninformationcache_chargebee_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organisationwebhook',
            name='url',
            field=models.CharField(max_length=200),
        ),
    ]
