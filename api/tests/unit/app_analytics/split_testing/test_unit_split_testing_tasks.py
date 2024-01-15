from app_analytics.models import FeatureEvaluationRaw
from app_analytics.split_testing.models import (
    ConversionEvent,
    ConversionEventType,
    SplitTest,
)
from app_analytics.split_testing.tasks import _update_split_tests
from pytest_django.fixtures import SettingsWrapper

from environments.identities.models import Identity
from environments.models import Environment
from features.models import Feature
from features.multivariate.models import MultivariateFeatureOption
from features.value_types import STRING
from projects.models import Project


def test_update_split_tests_with_new_split_tests(
    settings: SettingsWrapper,
    project: Project,
    environment: Environment,
) -> None:
    # Given
    settings.USE_POSTGRES_FOR_ANALYTICS = True

    feature1 = Feature.objects.create(
        name="1",
        project=project,
        initial_value="200",
        is_server_key_only=True,
        default_enabled=True,
    )
    feature2 = Feature.objects.create(
        name="2",
        project=project,
        initial_value="banana",
        default_enabled=False,
    )

    MultivariateFeatureOption.objects.create(
        feature=feature1,
        default_percentage_allocation=30,
        type=STRING,
        string_value="mv_feature_option1",
    )
    MultivariateFeatureOption.objects.create(
        feature=feature1,
        default_percentage_allocation=30,
        type=STRING,
        string_value="mv_feature_option2",
    )
    MultivariateFeatureOption.objects.create(
        feature=feature2,
        default_percentage_allocation=20,
        type=STRING,
        string_value="mv_feature_option3",
    )
    MultivariateFeatureOption.objects.create(
        feature=feature2,
        default_percentage_allocation=15,
        type=STRING,
        string_value="mv_feature_option4",
    )

    identity1 = Identity.objects.create(
        identifier="test-identity-1", environment=environment
    )
    identity2 = Identity.objects.create(
        identifier="test-identity-2", environment=environment
    )
    identity3 = Identity.objects.create(
        identifier="test-identity-3", environment=environment
    )
    identity4 = Identity.objects.create(
        identifier="test-identity-4", environment=environment
    )

    cet1 = ConversionEventType.objects.create(
        environment=environment,
        name="paid_plan",
    )

    # Create a second CET with no ConversionEvents.
    ConversionEventType.objects.create(
        environment=environment,
        name="free_plan",
    )

    # Create a conversion event that preceded the feature evaluations.
    # This means the results should not be included in the split test.
    ConversionEvent.objects.create(
        type=cet1,
        environment=environment,
        identity=identity2,
    )

    # Create evaluation for both features for identity1
    FeatureEvaluationRaw.objects.create(
        feature_name=feature1.name,
        environment_id=environment.id,
        evaluation_count=2,
        identity_identifier=identity1.identifier,
        enabled_when_evaluated=True,
    )
    FeatureEvaluationRaw.objects.create(
        feature_name=feature2.name,
        environment_id=environment.id,
        evaluation_count=1,
        identity_identifier=identity1.identifier,
        enabled_when_evaluated=True,
    )

    # Create evaluation for only feature2 for identity2 since
    # feature1 was not set to enabled when evaluated.
    FeatureEvaluationRaw.objects.create(
        feature_name=feature1.name,
        environment_id=environment.id,
        evaluation_count=1,
        identity_identifier=identity2.identifier,
    )
    FeatureEvaluationRaw.objects.create(
        feature_name=feature2.name,
        environment_id=environment.id,
        evaluation_count=1,
        identity_identifier=identity2.identifier,
        enabled_when_evaluated=True,
    )

    # Create evaluation for only feature2 for identity3
    FeatureEvaluationRaw.objects.create(
        feature_name=feature2.name,
        environment_id=environment.id,
        evaluation_count=1,
        identity_identifier=identity3.identifier,
        enabled_when_evaluated=True,
    )

    # Create duplicate evaluations for only feature1 for identity4
    FeatureEvaluationRaw.objects.create(
        feature_name=feature1.name,
        environment_id=environment.id,
        evaluation_count=1,
        identity_identifier=identity4.identifier,
        enabled_when_evaluated=True,
    )
    FeatureEvaluationRaw.objects.create(
        feature_name=feature1.name,
        environment_id=environment.id,
        evaluation_count=1,
        identity_identifier=identity4.identifier,
        enabled_when_evaluated=True,
    )

    # Create conversion events for identity3 and identity 4
    ConversionEvent.objects.create(
        type=cet1,
        environment=environment,
        identity=identity3,
    )

    ConversionEvent.objects.create(
        type=cet1,
        environment=environment,
        identity=identity4,
    )

    # When
    _update_split_tests()

    # Then
    split_tests = SplitTest.objects.all()

    # Total 2 different features, each with 3 tests, times 2
    # separate conversion event types.
    assert len(split_tests) == 12

    # Now look at only the tests with tracked conversion events.
    split_tests = split_tests.filter(conversion_event_type=cet1)

    assert sum([st.evaluation_count for st in split_tests]) == 5
    assert sum([st.conversion_count for st in split_tests]) == 2
    for st in split_tests:
        assert st.pvalue > 0.5


def test_update_split_tests_with_existing_split_tests(
    settings: SettingsWrapper,
    project: Project,
    environment: Environment,
) -> None:
    # Given
    settings.USE_POSTGRES_FOR_ANALYTICS = True

    feature1 = Feature.objects.create(
        name="1",
        project=project,
        initial_value="200",
        is_server_key_only=True,
        default_enabled=True,
    )

    mvfo1 = MultivariateFeatureOption.objects.create(
        feature=feature1,
        default_percentage_allocation=30,
        type=STRING,
        string_value="mv_feature_option1",
    )
    mvfo2 = MultivariateFeatureOption.objects.create(
        feature=feature1,
        default_percentage_allocation=30,
        type=STRING,
        string_value="mv_feature_option2",
    )

    identity1 = Identity.objects.create(
        identifier="test-identity-1", environment=environment
    )
    identity2 = Identity.objects.create(
        identifier="test-identity-2", environment=environment
    )

    FeatureEvaluationRaw.objects.create(
        feature_name=feature1.name,
        environment_id=environment.id,
        evaluation_count=2,
        identity_identifier=identity1.identifier,
        enabled_when_evaluated=True,
    )

    FeatureEvaluationRaw.objects.create(
        feature_name=feature1.name,
        environment_id=environment.id,
        evaluation_count=1,
        identity_identifier=identity2.identifier,
        enabled_when_evaluated=True,
    )

    cet = ConversionEventType.objects.create(
        environment=environment,
        name="free_plan",
    )
    ConversionEvent.objects.create(
        type=cet,
        environment=environment,
        identity=identity1,
    )

    # Create some split test objects to replace.
    split_test1 = SplitTest.objects.create(
        conversion_event_type=cet,
        environment=environment,
        feature=feature1,
        multivariate_feature_option_id=None,
        evaluation_count=0,
        conversion_count=0,
        pvalue=1.0,
    )
    split_test2 = SplitTest.objects.create(
        conversion_event_type=cet,
        environment=environment,
        feature=feature1,
        multivariate_feature_option_id=mvfo1.id,
        evaluation_count=0,
        conversion_count=0,
        pvalue=1.0,
    )
    split_test3 = SplitTest.objects.create(
        conversion_event_type=cet,
        environment=environment,
        feature=feature1,
        multivariate_feature_option_id=mvfo2.id,
        evaluation_count=0,
        conversion_count=0,
        pvalue=1.0,
    )

    former_split_test_updated_at = split_test1.updated_at

    # When
    _update_split_tests()

    # Then
    split_tests = SplitTest.objects.all()
    assert len(split_tests) == 3
    assert split_test1 in split_tests
    assert split_test2 in split_tests
    assert split_test3 in split_tests

    split_test1.refresh_from_db()

    assert split_test1.updated_at > former_split_test_updated_at

    assert sum([st.evaluation_count for st in split_tests]) == 2
    assert sum([st.conversion_count for st in split_tests]) == 1
    for st in split_tests:
        assert st.pvalue > 0.5
