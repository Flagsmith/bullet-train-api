# Generated by Django 3.2.16 on 2023-02-08 08:55

from django.db import migrations, models
import django.db.models.deletion
import metadata.fields
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('metadata', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='metadatamodelfield',
            name='is_required',
        ),
        migrations.AlterField(
            model_name='metadata',
            name='object_id',
            field=metadata.fields.GenericObjectID(),
        ),
        migrations.CreateModel(
            name='MetadataModelFieldIsRequiredFor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('object_id', metadata.fields.GenericObjectID()),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('model_field', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='is_required_for', to='metadata.metadatamodelfield')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
