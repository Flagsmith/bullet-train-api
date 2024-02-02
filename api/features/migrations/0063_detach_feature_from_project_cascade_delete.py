# Generated by Django 3.2.23 on 2024-02-01 12:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0021_add_identity_overrides_migration_status'),
        ('features', '0062_alter_feature_segment_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feature',
            name='project',
            field=models.ForeignKey(help_text='Changing the project selected will remove previous Feature States for the previously associated projects Environments that are related to this Feature. New default Feature States will be created for the new selected projects Environments for this Feature. Also this will remove any Tags associated with a feature as Tags are Project defined', on_delete=django.db.models.deletion.DO_NOTHING, related_name='features', to='projects.project'),
        ),
    ]
