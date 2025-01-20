from django.db.models import Prefetch
from flag_engine.identities.models import IdentityModel

from edge_api.identities.events import send_migration_event
from environments.identities.models import Identity
from environments.models import Environment, EnvironmentAPIKey
from features.models import FeatureState
from features.multivariate.models import MultivariateFeatureStateValue
from projects.models import Project
from projects.tasks import migrate_project_environments_to_v2
from util.mappers import (
    map_engine_feature_state_to_identity_override,
    map_feature_state_to_engine,
)
from util.queryset import iterator_with_prefetch

from . import DynamoEnvironmentV2Wrapper
from .types import (
    DynamoProjectMetadata,
    IdentityOverridesV2Changeset,
    ProjectIdentityMigrationStatus,
)
from .wrappers import (
    DynamoEnvironmentAPIKeyWrapper,
    DynamoEnvironmentWrapper,
    DynamoIdentityWrapper,
)


class IdentityMigrator:
    def __init__(self, project_id):
        self.project_metadata = DynamoProjectMetadata.get_or_new(project_id)

    @property
    def migration_status(self) -> ProjectIdentityMigrationStatus:
        return self.project_metadata.identity_migration_status

    @property
    def is_migration_done(self) -> bool:
        migration_status = self.migration_status
        return migration_status == ProjectIdentityMigrationStatus.MIGRATION_COMPLETED

    @property
    def can_migrate(self) -> bool:
        return self.migration_status in (
            ProjectIdentityMigrationStatus.MIGRATION_NOT_STARTED,
            ProjectIdentityMigrationStatus.MIGRATION_SCHEDULED,
        )

    def trigger_migration(self):
        # Note: since we mark the project as `migration in progress` before we start the migration,
        # there is a small chance for the project of being stuck in `migration in progress`
        # if the migration event is lost or the task fails.
        # Since the probability of this happening is low, we don't worry about it.
        send_migration_event(self.project_metadata.id)
        self.project_metadata.trigger_identity_migration()

    def migrate(self):
        self.project_metadata.start_identity_migration()

        project_id = self.project_metadata.id

        Project.objects.filter(id=project_id).update(enable_dynamo_db=True)
        environment_wrapper = DynamoEnvironmentWrapper()
        environments_v2_wrapper = DynamoEnvironmentV2Wrapper()
        environments = Environment.objects.filter_for_document_builder(
            project_id=project_id
        )
        environment_wrapper.write_environments(environments)
        environments_v2_wrapper.write_environments(environments)

        api_key_wrapper = DynamoEnvironmentAPIKeyWrapper()
        api_keys = EnvironmentAPIKey.objects.filter(environment__project_id=project_id)
        api_key_wrapper.write_api_keys(api_keys)

        identity_wrapper = DynamoIdentityWrapper()
        identities = (
            Identity.objects.filter(environment__project__id=project_id)
            .select_related("environment")
            .prefetch_related(
                "identity_traits",
                Prefetch(
                    "identity_features",
                    queryset=FeatureState.objects.select_related(
                        "feature", "feature_state_value"
                    ),
                ),
                Prefetch(
                    "identity_features__multivariate_feature_state_values",
                    queryset=MultivariateFeatureStateValue.objects.select_related(
                        "multivariate_feature_option"
                    ),
                ),
            )
        )

        # TODO: I'm not sure this approach will actually work or, even if it does,
        #  it's going to be ugly and end up serializing / deserializing unnecessarily.
        #  The logical solution here is to extend the DynamoIdentityWrapper so
        #  that we can handle both things, but that feels like quite a refactor.

        identity_documents_with_overrides = identity_wrapper.write_identities(
            iterator_with_prefetch(identities),
            return_filter=lambda i: i["identity_features"]
        )

        identity_models = [
            IdentityModel.model_validate(identity_document)
            for identity_document in identity_documents_with_overrides
        ]

        environments_v2_wrapper.update_identity_overrides(
            changeset=IdentityOverridesV2Changeset(
                to_delete=[],
                to_put=[
                    map_engine_feature_state_to_identity_override(
                        feature_state=map_feature_state_to_engine(
                            identity_override,
                            mv_fs_values=identity_override.multivariate_feature_state_values.all()
                        ),
                        identifier=
                    ) for identity_override in identity_overrides
                ]
            )
        )

        migrate_project_environments_to_v2(project_id)
        self.project_metadata.finish_identity_migration()
