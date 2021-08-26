from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import QuerySet, Sum
from django_lifecycle import (
    AFTER_CREATE,
    BEFORE_SAVE,
    LifecycleModelMixin,
    hook,
)

from features.feature_states.models import AbstractBaseFeatureValueModel


class MultivariateFeatureOption(LifecycleModelMixin, AbstractBaseFeatureValueModel):
    feature = models.ForeignKey(
        "features.Feature",
        on_delete=models.CASCADE,
        related_name="multivariate_options",
    )

    # This field is stored at the feature level but not used here - it is transferred
    # to the MultivariateFeatureStateValue on creation of a new option or when creating
    # a new environment.
    default_percentage_allocation = models.FloatField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )

    @hook(AFTER_CREATE)
    def create_multivariate_feature_state_values(self):
        for feature_state in self.feature.feature_states.filter(
            identity=None, feature_segment=None
        ):
            MultivariateFeatureStateValue.objects.create(
                feature_state=feature_state,
                multivariate_feature_option=self,
                percentage_allocation=self.default_percentage_allocation,
            )


class MultivariateFeatureStateValue(LifecycleModelMixin, models.Model):
    feature_state = models.ForeignKey(
        "features.FeatureState",
        on_delete=models.CASCADE,
        related_name="multivariate_feature_state_values",
    )
    multivariate_feature_option = models.ForeignKey(
        MultivariateFeatureOption, on_delete=models.CASCADE
    )

    percentage_allocation = models.FloatField(
        blank=False,
        null=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )

    @hook(BEFORE_SAVE)
    def validate_percentage_allocations(self):
        # TODO: add tests
        total_percentage_allocation = self.get_siblings().aggregate(
            total_percentage_allocation=Sum("percentage_allocation")
        )["total_percentage_allocation"]
        if total_percentage_allocation and total_percentage_allocation > 100:
            raise ValidationError(
                self._get_invalid_percentage_allocation_error_message()
            )

    def validate_unique(self, exclude=None):
        super(MultivariateFeatureStateValue, self).validate_unique(exclude=None)
        if (
            self.__class__.objects.filter(
                feature_state=self.feature_state,
                multivariate_feature_option=self.multivariate_feature_option,
            )
            .exclude(id=self.id)
            .exists()
        ):
            raise ValidationError(
                "MultivariateFeatureStateValue already exists for that FeatureState "
                "and MultivariateFeatureOption combination."
            )

    def get_siblings(self) -> QuerySet:
        # TODO: add tests
        siblings = self.feature_state.multivariate_feature_state_values.all()
        if self.id:
            siblings = siblings.exclude(id=self.id)
        return siblings

    def _get_invalid_percentage_allocation_error_message(self) -> str:
        # TODO: add tests
        kwargs = {
            "feature_name": self.feature_state.feature.name,
            "environment_name": self.feature_state.environment.name,
        }
        message = (
            "Total percentage allocation for feature {feature_name} "
            "in environment {environment_name}"
        )
        if self.feature_state.identity:
            message += " for identity {identity_identifier}"
            kwargs["identity_identifier"] = self.feature_state.identity.identifier
        elif self.feature_state.feature_segment:
            message += " for segment {segment_name}"
            kwargs["segment_name"] = self.feature_state.feature_segment.segment.name
        message += " is greater than 100%."
        return message.format(**kwargs)
