# Generated by Django 3.2.24 on 2024-03-15 15:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('organisations', '0052_create_hubspot_organisation'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrganisationLicence',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('content', models.TextField(blank=True)),
                ('organisation', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='organisations.organisation')),
            ],
        ),
    ]