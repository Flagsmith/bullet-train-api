# Generated by Django 3.2.20 on 2023-08-02 19:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organisations', '0044_organisationsubscriptioninformationcache_allowed_projects'),
    ]

    operations = [
        migrations.AddField(
            model_name='organisationsubscriptioninformationcache',
            name='chargebee_updated_at',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='organisationsubscriptioninformationcache',
            name='influx_updated_at',
            field=models.DateTimeField(null=True),
        ),
    ]
