# Generated by Django 4.2.16 on 2024-10-30 15:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("organisations", "0058_update_audit_and_history_limits_in_sub_cache"),
        ("licensing", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="organisationlicence",
            name="organisation",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="licence",
                to="organisations.organisation",
            ),
        ),
    ]
