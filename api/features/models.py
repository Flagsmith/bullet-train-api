from __future__ import unicode_literals

import logging
import typing
from copy import deepcopy

from django.core.exceptions import (
    NON_FIELD_ERRORS,
    ObjectDoesNotExist,
    ValidationError,
)
from django.db import models
from django.db.models import Q, UniqueConstraint
from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _
from django_lifecycle import (
    AFTER_CREATE,
    AFTER_SAVE,
    BEFORE_CREATE,
    LifecycleModel,
    hook,
)
from ordered_model.models import OrderedModelBase
from simple_history.models import HistoricalRecords

from environments.identities.helpers import (
    get_hashed_percentage_for_object_ids,
)
from features.custom_lifecycle import CustomLifecycleModelMixin
from features.feature_states.models import AbstractBaseFeatureValueModel
from features.feature_types import MULTIVARIATE
from features.helpers import get_correctly_typed_value
from features.multivariate.models import MultivariateFeatureStateValue
from features.tasks import trigger_feature_state_change_webhooks
from features.utils import (
    get_boolean_from_string,
    get_integer_from_string,
    get_value_type,
)
from features.value_types import (
    BOOLEAN,
    FEATURE_STATE_VALUE_TYPES,
    INTEGER,
    STRING,
)
from projects.models import Project
from projects.tags.models import Tag

logger = logging.getLogger(__name__)

if typing.TYPE_CHECKING:
    from environments.models import Environment
    from environments.identities.models import Identity


@python_2_unicode_compatible
class Feature(CustomLifecycleModelMixin, models.Model):
    name = models.CharField(max_length=2000)
    created_date = models.DateTimeField("DateCreated", auto_now_add=True)
    project = models.ForeignKey(
        Project,
        related_name="features",
        help_text=_(
            "Changing the project selected will remove previous Feature States for the previously"
            "associated projects Environments that are related to this Feature. New default "
            "Feature States will be created for the new selected projects Environments for this "
            "Feature. Also this will remove any Tags associated with a feature as Tags are Project defined"
        ),
        on_delete=models.CASCADE,
    )
    initial_value = models.CharField(max_length=20000, null=True, default=None)
    description = models.TextField(null=True, blank=True)
    default_enabled = models.BooleanField(default=False)
    type = models.CharField(max_length=50, null=True, blank=True)
    history = HistoricalRecords()
    tags = models.ManyToManyField(Tag, blank=True)

    class Meta:
        # Note: uniqueness is changed to reference lowercase name in explicit SQL in the migrations
        unique_together = ("name", "project")

    @hook(AFTER_CREATE)
    def create_feature_states(self):
        # create feature states for all environments
        environments = self.project.environments.all()
        for env in environments:
            # unable to bulk create as we need signals
            FeatureState.objects.create(
                feature=self,
                environment=env,
                identity=None,
                feature_segment=None,
                enabled=self.default_enabled,
            )

    def validate_unique(self, *args, **kwargs):
        """
        Checks unique constraints on the model and raises ``ValidationError``
        if any failed.
        """
        super(Feature, self).validate_unique(*args, **kwargs)

        # handle case insensitive names per project, as above check allows it
        if (
            Feature.objects.filter(project=self.project, name__iexact=self.name)
            .exclude(pk=self.pk)
            .exists()
        ):
            raise ValidationError(
                {
                    NON_FIELD_ERRORS: [
                        "Feature with that name already exists for this project. Note that feature "
                        "names are case insensitive.",
                    ],
                }
            )

    def __str__(self):
        return "Project %s - Feature %s" % (self.project.name, self.name)


def get_next_segment_priority(feature):
    feature_segments = FeatureSegment.objects.filter(feature=feature).order_by(
        "-priority"
    )
    if feature_segments.count() == 0:
        return 1
    else:
        return feature_segments.first().priority + 1


@python_2_unicode_compatible
class FeatureSegment(OrderedModelBase):
    feature = models.ForeignKey(
        Feature, on_delete=models.CASCADE, related_name="feature_segments"
    )
    segment = models.ForeignKey(
        "segments.Segment", related_name="feature_segments", on_delete=models.CASCADE
    )
    environment = models.ForeignKey(
        "environments.Environment",
        on_delete=models.CASCADE,
        related_name="feature_segments",
    )

    _enabled = models.BooleanField(
        default=False,
        db_column="enabled",
        help_text="Deprecated in favour of using FeatureStateValue.",
    )
    _value = models.CharField(
        max_length=2000,
        blank=True,
        null=True,
        db_column="value",
        help_text="Deprecated in favour of using FeatureStateValue.",
    )
    _value_type = models.CharField(
        choices=FEATURE_STATE_VALUE_TYPES,
        max_length=50,
        blank=True,
        null=True,
        db_column="value_type",
        help_text="Deprecated in favour of using FeatureStateValue.",
    )

    # specific attributes for managing the order of feature segments
    priority = models.PositiveIntegerField(editable=False, db_index=True)
    order_field_name = "priority"
    order_with_respect_to = ("feature", "environment")

    # used for audit purposes
    history = HistoricalRecords()

    class Meta:
        unique_together = ("feature", "environment", "segment")
        ordering = ("priority",)

    def __str__(self):
        return (
            "FeatureSegment for "
            + self.feature.name
            + " with priority "
            + str(self.priority)
        )

    def __lt__(self, other):
        """
        Kind of counter intuitive but since priority 1 is highest, we want to check if priority is GREATER than the
        priority of the other feature segment.
        """
        return other and self.priority > other.priority

    def clone(self, environment: "Environment") -> "FeatureSegment":
        clone = deepcopy(self)
        clone.id = None
        clone.environment = environment
        clone.save()
        return clone

    # noinspection PyTypeChecker
    def get_value(self):
        return get_correctly_typed_value(self.value_type, self.value)


@python_2_unicode_compatible
class FeatureState(LifecycleModel, models.Model):
    feature = models.ForeignKey(
        Feature, related_name="feature_states", on_delete=models.CASCADE
    )

    environment = models.ForeignKey(
        "environments.Environment",
        related_name="feature_states",
        null=True,
        on_delete=models.CASCADE,
    )
    identity = models.ForeignKey(
        "identities.Identity",
        related_name="identity_features",
        null=True,
        default=None,
        blank=True,
        on_delete=models.CASCADE,
    )
    feature_segment = models.ForeignKey(
        FeatureSegment,
        related_name="feature_states",
        null=True,
        blank=True,
        default=None,
        on_delete=models.CASCADE,
    )
    updated_at = models.DateTimeField(auto_now=True)
    enabled = models.BooleanField(default=False)
    history = HistoricalRecords()

    class Meta:
        # Note: this is manually overridden in the migrations for Oracle DBs to include
        # all 4 unique fields in each of these constraints. See migration 0025.
        constraints = [
            UniqueConstraint(
                fields=["environment", "feature", "feature_segment"],
                condition=Q(identity__isnull=True),
                name="unique_for_feature_segment",
            ),
            UniqueConstraint(
                fields=["environment", "feature", "identity"],
                condition=Q(feature_segment__isnull=True),
                name="unique_for_identity",
            ),
            UniqueConstraint(
                fields=["environment", "feature"],
                condition=Q(identity__isnull=True, feature_segment__isnull=True),
                name="unique_for_environment",
            ),
        ]
        ordering = ["id"]

    def __gt__(self, other):
        """
        Checks if the current feature state is higher priority that the provided feature state.

        :param other: (FeatureState) the feature state to compare the priority of
        :return: True if self is higher priority than other
        """
        if self.environment != other.environment:
            raise ValueError(
                "Cannot compare feature states as they belong to different environments."
            )

        if self.feature != other.feature:
            raise ValueError(
                "Cannot compare feature states as they belong to different features."
            )

        if self.identity:
            # identity is the highest priority so we can always return true
            if other.identity and self.identity != other.identity:
                raise ValueError(
                    "Cannot compare feature states as they are for different identities."
                )
            return True

        if self.feature_segment:
            # Return true if other_feature_state has a lower priority feature segment and not an identity overridden
            # flag, else False.
            return not (other.identity or self.feature_segment < other.feature_segment)

        # if we've reached here, then self is just the environment default. In this case, other is higher priority if
        # it has a feature_segment or an identity
        return not (other.feature_segment or other.identity)

    def clone(self, env: "Environment") -> "FeatureState":
        # Clonning the Identity is not allowed because they are closely tied
        # to the enviroment
        assert self.identity is None
        clone = deepcopy(self)
        clone.id = None
        clone.feature_segment = (
            FeatureSegment.objects.get(
                environment=env,
                feature=clone.feature,
                segment=self.feature_segment.segment,
            )
            if self.feature_segment
            else None
        )
        clone.environment = env
        clone.save()
        # clone the related objects
        self.feature_state_value.clone(clone)
        return clone

    def get_feature_state_value(self, identity: "Identity" = None) -> typing.Any:
        feature_state_value = (
            self.get_multivariate_feature_state_value(identity)
            if self.feature.type == MULTIVARIATE and identity
            else getattr(self, "feature_state_value", None)
        )

        # return the value of the feature state value only if the feature state
        # has a related feature state value. Note that we use getattr rather than
        # hasattr as we want to return None if no feature state value exists.
        return feature_state_value and feature_state_value.value

    def get_multivariate_feature_state_value(
        self, identity: "Identity"
    ) -> AbstractBaseFeatureValueModel:
        # the multivariate_feature_state_values should be prefetched at this point
        # so we just convert them to a list and use python operations from here to
        # avoid further queries to the DB
        mv_options = list(self.multivariate_feature_state_values.all())

        percentage_value = (
            get_hashed_percentage_for_object_ids([self.id, identity.id]) * 100
        )

        # Iterate over the mv options in order of id (so we get the same value each
        # time) to determine the correct value to return to the identity based on
        # the percentage allocations of the multivariate options. This gives us a
        # way to ensure that the same value is returned every time we use the same
        # percentage value.
        start_percentage = 0
        for mv_option in sorted(mv_options, key=lambda o: o.id):
            limit = getattr(mv_option, "percentage_allocation", 0) + start_percentage
            if start_percentage <= percentage_value < limit:
                return mv_option.multivariate_feature_option

            start_percentage = limit

        # if none of the percentage allocations match the percentage value we got for
        # the identity, then we just return the default feature state value (or None
        # if there isn't one - although this should never happen)
        return getattr(self, "feature_state_value", None)

    @property
    def previous_feature_state_value(self):
        try:
            history_instance = self.feature_state_value.history.first()
            return (
                history_instance
                and getattr(history_instance, "prev_record", None)
                and history_instance.prev_record.instance.value
            )
        except ObjectDoesNotExist:
            return None

    @hook(BEFORE_CREATE)
    def check_for_existing_env_feature_state(self):
        # prevent duplicate feature states being created for an environment
        if FeatureState.objects.filter(
            environment=self.environment, feature=self.feature
        ).exists() and not (self.identity or self.feature_segment):
            raise ValidationError(
                "Feature state already exists for this environment and feature"
            )

    @hook(AFTER_CREATE)
    def create_feature_state_value(self):
        # note: this is only performed after create since feature state values are
        # updated separately, and hence if this is performed after each save,
        # it overwrites the FSV with the initial value again
        FeatureStateValue.objects.create(
            feature_state=self,
            **self.get_feature_state_value_defaults(),
        )

    @hook(AFTER_CREATE)
    def create_multivariate_feature_state_values(self):
        if not (self.feature_segment or self.identity):
            # we only want to create the multivariate feature state values for
            # feature states related to an environment only, i.e. when a new
            # environment is created or a new MV feature is created
            mv_feature_state_values = [
                MultivariateFeatureStateValue(
                    feature_state=self,
                    multivariate_feature_option=mv_option,
                    percentage_allocation=mv_option.default_percentage_allocation,
                )
                for mv_option in self.feature.multivariate_options.all()
            ]
            MultivariateFeatureStateValue.objects.bulk_create(mv_feature_state_values)

    @hook(AFTER_SAVE)
    def trigger_feature_state_change_webhooks(self):
        trigger_feature_state_change_webhooks(self)

    def get_feature_state_value_defaults(self) -> dict:
        if self.feature.initial_value is None:
            return {}

        value = self.feature.initial_value
        type = get_value_type(value)
        parse_func = {
            BOOLEAN: get_boolean_from_string,
            INTEGER: get_integer_from_string,
        }.get(type, lambda v: v)
        key_name = self.get_feature_state_key_name(type)

        return {"type": type, key_name: parse_func(value)}

    @staticmethod
    def get_feature_state_key_name(fsv_type):
        return {
            INTEGER: "integer_value",
            BOOLEAN: "boolean_value",
            STRING: "string_value",
        }.get(
            fsv_type, "string_value"
        )  # The default was chosen for backwards compatibility

    def generate_feature_state_value_data(self, value):
        """
        Takes the value of a feature state to generate a feature state value and returns dictionary
        to use for passing into feature state value serializer

        :param value: feature state value of variable type
        :return: dictionary to pass directly into feature state value serializer
        """
        fsv_type = type(value).__name__
        accepted_types = (STRING, INTEGER, BOOLEAN)

        return {
            # Default to string if not an anticipate type value to keep backwards compatibility.
            "type": fsv_type if fsv_type in accepted_types else STRING,
            "feature_state": self.id,
            self.get_feature_state_key_name(fsv_type): value,
        }

    def __str__(self):
        s = f"Feature {self.feature.name} - Enabled: {self.enabled}"
        if self.environment is not None:
            s = f"{self.environment} - {s}"
        elif self.identity is not None:
            s = f"Identity {self.identity.identifier} - {s}"
        return s


class FeatureStateValue(AbstractBaseFeatureValueModel):
    feature_state = models.OneToOneField(
        FeatureState, related_name="feature_state_value", on_delete=models.CASCADE
    )

    # TODO: increase max length of string value on base model class
    string_value = models.CharField(null=True, max_length=20000, blank=True)

    history = HistoricalRecords()

    def clone(self, feature_state: FeatureState) -> "FeatureStateValue":
        clone = deepcopy(self)
        clone.id = None
        clone.feature_state = feature_state
        clone.save()
        return clone
