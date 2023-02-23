# Generated by Django 3.2.16 on 2023-01-16 15:28

from django.db import migrations

from core.migration_helpers import PostgresOnlyRunSQL

# Migration to remove index created by unique_together statement and, for Postgres databases,
# update the current functional index (on lower case feature name and project) to add a condition
# to only apply the index for non deleted features.

_drop_index_sql = 'DROP INDEX CONCURRENTLY "lowercase_feature_name";'
_create_index_sql_without_filter = 'CREATE UNIQUE INDEX CONCURRENTLY "lowercase_feature_name" ON "features_feature" (lower(name), project_id);'
_create_index_sql_with_filter = 'CREATE UNIQUE INDEX CONCURRENTLY "lowercase_feature_name" ON "features_feature" (lower(name), project_id) WHERE deleted_at IS NULL;'


class Migration(migrations.Migration):

    atomic = False

    dependencies = [
        ("features", "0049_safe_delete_feature_models"),
    ]

    operations = [
        migrations.AlterUniqueTogether(name="feature", unique_together=set()),
        PostgresOnlyRunSQL(_drop_index_sql, reverse_sql=_create_index_sql_without_filter),
        PostgresOnlyRunSQL(_create_index_sql_with_filter, reverse_sql=_drop_index_sql),
    ]
