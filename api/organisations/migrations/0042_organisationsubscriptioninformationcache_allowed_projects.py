# Generated by Django 3.2.20 on 2023-07-14 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organisations', '0041_merge_20230621_0946'),
    ]

    operations = [
        migrations.AddField(
            model_name='organisationsubscriptioninformationcache',
            name='allowed_projects',
            field=models.IntegerField(default=1),
        ),
    ]
