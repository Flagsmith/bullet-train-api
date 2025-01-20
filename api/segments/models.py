import logging
import typing
import uuid
from copy import deepcopy

from core.models import (
    SoftDeleteExportableModel,
    abstract_base_auditable_model_factory,
)
from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
from django.core.exceptions import ValidationError
from django.db import models
from django_lifecycle import (
    AFTER_CREATE,
    BEFORE_CREATE,
    LifecycleModelMixin,
    hook,
)
from flag_engine.segments import constants

from audit.constants import (
    SEGMENT_CREATED_MESSAGE,
    SEGMENT_DELETED_MESSAGE,
    SEGMENT_UPDATED_MESSAGE,
)
from audit.related_object_type import RelatedObjectType
from features.models import Feature
from metadata.models import Metadata
from projects.models import Project

from .helpers import segment_audit_log_helper
from .managers import LiveSegmentManager, SegmentManager

logger = logging.getLogger(__name__)


class Segment(
    LifecycleModelMixin,
    SoftDeleteExportableModel,
    abstract_base_auditable_model_factory(["uuid"]),
):
    history_record_class_path = "segments.models.HistoricalSegment"
    related_object_type = RelatedObjectType.SEGMENT

    name = models.CharField(max_length=2000)
    description = models.TextField(null=True, blank=True)
    project = models.ForeignKey(
        Project,
        # Cascade deletes are decouple from the Django ORM. See this PR for details.
        # https://github.com/Flagsmith/flagsmith/pull/3360/
        on_delete=models.DO_NOTHING,
        related_name="segments",
    )
    feature = models.ForeignKey(
        Feature, on_delete=models.CASCADE, related_name="segments", null=True
    )

    # This defaults to 1 for newly created segments.
    version = models.IntegerField(null=True)

    version_of = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        related_name="versioned_segments",
        null=True,
        blank=True,
    )

    change_request = models.ForeignKey(
        "workflows_core.ChangeRequest",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="segments",
    )

    metadata = GenericRelation(Metadata)

    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    objects = SegmentManager()

    # Only serves segments that are the canonical version.
    live_objects = LiveSegmentManager()

    class Meta:
        ordering = ("id",)  # explicit ordering to prevent pagination warnings

    def __str__(self):
        return "Segment - %s" % self.name

    def get_skip_create_audit_log(self) -> bool:
        skip = segment_audit_log_helper.should_skip_audit_log(self.id)
        if skip is not None:
            return skip

        try:
            if self.version_of_id and self.version_of_id != self.id:
                return True
        except Segment.DoesNotExist:
            return True

        return False

    @staticmethod
    def id_exists_in_rules_data(rules_data: typing.List[dict]) -> bool:
        """
        Given a list of segment rules, return whether any of the rules or conditions contain an id.

        :param rules_data: list of segment rules (in the form {"id": 1, "rules": [], "conditions": [], "typing": ""})
        :return: boolean value detailing whether any id attributes were found
        """

        _rules_data = deepcopy(rules_data)
        for rule_data in _rules_data:
            if rule_data.get("id"):
                return True

            conditions_to_check = rule_data.get("conditions", [])
            rules_to_check = rule_data.get("rules", [])

            while rules_to_check:
                rule = rules_to_check.pop()
                if rule.get("id"):
                    return True
                rules_to_check.extend(rule.get("rules", []))
                conditions_to_check.extend(rule.get("conditions", []))

            while conditions_to_check:
                condition = conditions_to_check.pop()
                if condition.get("id"):
                    return True

        return False

    @hook(BEFORE_CREATE, when="version_of", is_now=None)
    def set_default_version_to_one_if_new_segment(self):
        if self.version is None:
            self.version = 1

    @hook(AFTER_CREATE, when="version_of", is_now=None)
    def set_version_of_to_self_if_none(self):
        """
        This allows the segment model to reference all versions of
        itself including itself.
        """
        segment_audit_log_helper.set_skip_audit_log(self.id)
        self.version_of = self
        self.save()
        segment_audit_log_helper.unset_skip_audit_log(self.id)

    def shallow_clone(
        self,
        name: str,
        description: str,
        change_request: typing.Optional["ChangeRequest"],  # noqa: F821
    ) -> "Segment":
        cloned_segment = Segment(
            version_of=self,
            uuid=uuid.uuid4(),
            name=name,
            description=description,
            change_request=change_request,
            project=self.project,
            feature=self.feature,
            version=None,
        )
        cloned_segment.history.update()
        cloned_segment.save()
        return cloned_segment

    def deep_clone(self) -> "Segment":
        cloned_segment = deepcopy(self)
        cloned_segment.id = None
        cloned_segment.uuid = uuid.uuid4()
        cloned_segment.version_of = self
        cloned_segment.save()

        segment_audit_log_helper.set_skip_audit_log(self.id)
        self.version += 1
        self.save()
        segment_audit_log_helper.unset_skip_audit_log(self.id)

        cloned_rules = []
        for rule in self.rules.all():
            cloned_rule = rule.deep_clone(cloned_segment)
            cloned_rules.append(cloned_rule)

        cloned_segment.refresh_from_db()

        assert (
            len(self.rules.all())
            == len(cloned_rules)
            == len(cloned_segment.rules.all())
        ), "Mismatch during rules creation"

        return cloned_segment

    def assign_matching_rules_to_segment(self, segment: "Segment") -> bool:
        """
        Assign matching rules of the current object to the rules of the given segment.

        This method iterates through the rules of the provided `Segment` and
        attempts to match them to the current object's rules and sub-rules,
        updating versioning where matches are found.

        This is done in order to set the `version_of` field for matched rules
        and conditions so that the frontend can more reliably diff rules and
        conditions between a change request for a segment and the target segment
        itself.

        Args:
            segment (Segment): The segment whose rules are being matched
                               against the current object's rules.

        Returns:
            bool:
                - `True` if any rules or sub-rules match between the current
                  object and the segment.
                - `False` if no matches are found.

        Process:
            1. Retrieve all rules associated with the current object and the segment.
            2. For each rule in the segment:
               - Check its sub-rules against the current object's rules and sub-rules.
               - A match is determined if the sub-rule's type and properties align
                 with those of the current object's sub-rules.
               - If a match is found:
                 - Update the `version_of` field for the matched sub-rule and rule.
                 - Track the matched rules and sub-rules to avoid duplicate processing.
            3. Perform a bulk update on matched rules and sub-rules to persist
               versioning changes.

        Side Effects:
            - Updates the `version_of` field for matched rules and sub-rules.
        """

        self_rules = self.rules.all()
        matched_rules = set()
        matched_sub_rules = set()

        for rule in segment.rules.all():
            for sub_rule in rule.rules.all():
                sub_rule_matched = False
                for self_rule in self_rules:
                    if sub_rule_matched:
                        break

                    if self_rule in matched_rules and self_rule.version_of != rule:
                        continue

                    if rule.type != self_rule.type:
                        continue
                    for self_sub_rule in self_rule.rules.all():
                        if self_sub_rule in matched_sub_rules:
                            continue
                        if self_sub_rule.assign_conditions_if_matching_rule(sub_rule):
                            self_sub_rule.version_of = sub_rule
                            sub_rule_matched = True
                            matched_sub_rules.add(self_sub_rule)
                            self_rule.version_of = rule
                            matched_rules.add(self_rule)
                            break
        SegmentRule.objects.bulk_update(
            matched_rules | matched_sub_rules, fields=["version_of"]
        )
        return bool(matched_rules | matched_sub_rules)

    def get_create_log_message(self, history_instance) -> typing.Optional[str]:
        return SEGMENT_CREATED_MESSAGE % self.name

    def get_update_log_message(self, history_instance) -> typing.Optional[str]:
        return SEGMENT_UPDATED_MESSAGE % self.name

    def get_delete_log_message(self, history_instance) -> typing.Optional[str]:
        return SEGMENT_DELETED_MESSAGE % self.name

    def _get_project(self):
        return self.project


class SegmentRule(SoftDeleteExportableModel):
    ALL_RULE = "ALL"
    ANY_RULE = "ANY"
    NONE_RULE = "NONE"

    RULE_TYPES = ((ALL_RULE, "all"), (ANY_RULE, "any"), (NONE_RULE, "none"))

    segment = models.ForeignKey(
        Segment, on_delete=models.CASCADE, related_name="rules", null=True, blank=True
    )
    rule = models.ForeignKey(
        "self", on_delete=models.CASCADE, related_name="rules", null=True, blank=True
    )
    version_of = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        related_name="versioned_rules",
        null=True,
        blank=True,
    )

    type = models.CharField(max_length=50, choices=RULE_TYPES)

    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    def clean(self):
        super().clean()
        parents = [self.segment, self.rule]
        num_parents = sum(parent is not None for parent in parents)
        if num_parents != 1:
            raise ValidationError(
                "Segment rule must have exactly one parent, %d found", num_parents
            )

    def __str__(self):
        return "%s rule for %s" % (
            self.type,
            str(self.segment) if self.segment else str(self.rule),
        )

    def get_skip_create_audit_log(self) -> bool:
        segment = self.get_segment()
        return segment.version_of_id != segment.id

    def get_segment(self):
        """
        rules can be a child of a parent rule instead of a segment, this method iterates back up the tree to find the
        segment

        TODO: denormalise the segment information so that we don't have to make multiple queries here in complex cases
        """
        rule = self
        while not rule.segment_id:
            rule = rule.rule
        return rule.segment

    def assign_conditions_if_matching_rule(self, rule: "SegmentRule") -> bool:
        """
        Determines whether the current object matches the given rule
        and assigns conditions with the `version_of` field.

        These assignments are done in order to allow the frontend to
        provide a diff capability during change requests for segments.
        By knowing which version a condition is for the frontend can
        show a more accurate diff between the segment and the change request.

        This method compares the type and conditions of the current object with
        the specified `SegmentRule` to determine if they are compatible.

        Returns:
            bool:
                - `True` if the current object's type matches the rule's type
                  and the conditions are compatible.
                - `False` if the types do not match or no conditions are compatible.

        Process:
            1. If the types do not match, return `False`.
            2. If both the rule and current object have no conditions, return `True`.
            3. Compare each condition in the rule against the current object's conditions:
               - A condition matches if both `operator` and `property` are equal.
               - Mark matched conditions and update the versioning.
            4. Return `True` if at least one condition matches; otherwise, return `False`.

        Side Effects:
            Updates the `version_of` field for matched conditions using a bulk update.
        """

        if rule.type != self.type:
            return False

        conditions = rule.conditions.all()
        self_conditions = self.conditions.all()

        if not conditions and not self_conditions:
            # Empty rule with the same type matches.
            return True

        matched_conditions = set()

        for condition in conditions:
            for self_condition in self_conditions:
                if self_condition in matched_conditions:
                    continue
                if (
                    condition.operator == self_condition.operator
                    and condition.property == self_condition.property
                ):
                    matched_conditions.add(self_condition)
                    self_condition.version_of = condition
                    break
        if not matched_conditions:
            return False

        Condition.objects.bulk_update(matched_conditions, fields=["version_of"])
        return True

    def deep_clone(self, cloned_segment: Segment) -> "SegmentRule":
        if self.rule:
            # Since we're expecting a rule that is only belonging to a
            # segment, since a rule either belongs to a segment xor belongs
            # to a rule, we don't expect there also to be a rule associated.
            assert False, "Unexpected rule, expecting segment set not rule"
        cloned_rule = deepcopy(self)
        cloned_rule.version_of = self
        cloned_rule.segment = cloned_segment
        cloned_rule.uuid = uuid.uuid4()
        cloned_rule.id = None
        cloned_rule.save()
        logger.info(
            f"Deep copying rule {self.id} for cloned rule {cloned_rule.id} for cloned segment {cloned_segment.id}"
        )

        # Conditions are only part of the sub-rules.
        assert self.conditions.exists() is False

        for sub_rule in self.rules.all():
            if sub_rule.rules.exists():
                assert False, "Expected two layers of rules, not more"

            cloned_sub_rule = deepcopy(sub_rule)
            cloned_sub_rule.version_of = sub_rule
            cloned_sub_rule.rule = cloned_rule
            cloned_sub_rule.uuid = uuid.uuid4()
            cloned_sub_rule.id = None
            cloned_sub_rule.save()
            logger.info(
                f"Deep copying sub rule {sub_rule.id} for cloned sub rule {cloned_sub_rule.id} "
                f"for cloned segment {cloned_segment.id}"
            )

            cloned_conditions = []
            for condition in sub_rule.conditions.all():
                cloned_condition = deepcopy(condition)
                cloned_condition.version_of = condition
                cloned_condition.rule = cloned_sub_rule
                cloned_condition.uuid = uuid.uuid4()
                cloned_condition.id = None
                cloned_conditions.append(cloned_condition)
                logger.info(
                    f"Cloning condition {condition.id} for cloned condition {cloned_condition.uuid} "
                    f"for cloned segment {cloned_segment.id}"
                )

            Condition.objects.bulk_create(cloned_conditions)

        return cloned_rule


class Condition(
    SoftDeleteExportableModel, abstract_base_auditable_model_factory(["uuid"])
):
    history_record_class_path = "segments.models.HistoricalCondition"
    related_object_type = RelatedObjectType.SEGMENT

    CONDITION_TYPES = (
        (constants.EQUAL, "Exactly Matches"),
        (constants.GREATER_THAN, "Greater than"),
        (constants.LESS_THAN, "Less than"),
        (constants.CONTAINS, "Contains"),
        (constants.GREATER_THAN_INCLUSIVE, "Greater than or equal to"),
        (constants.LESS_THAN_INCLUSIVE, "Less than or equal to"),
        (constants.NOT_CONTAINS, "Does not contain"),
        (constants.NOT_EQUAL, "Does not match"),
        (constants.REGEX, "Matches regex"),
        (constants.PERCENTAGE_SPLIT, "Percentage split"),
        (constants.MODULO, "Modulo Operation"),
        (constants.IS_SET, "Is set"),
        (constants.IS_NOT_SET, "Is not set"),
        (constants.IN, "In"),
    )

    operator = models.CharField(choices=CONDITION_TYPES, max_length=500)
    property = models.CharField(blank=True, null=True, max_length=1000)
    value = models.CharField(
        max_length=settings.SEGMENT_CONDITION_VALUE_LIMIT, blank=True, null=True
    )
    description = models.TextField(blank=True, null=True)

    created_with_segment = models.BooleanField(
        default=False,
        help_text="Field to denote whether a condition was created along with segment or added after creation.",
    )

    rule = models.ForeignKey(
        SegmentRule, on_delete=models.CASCADE, related_name="conditions"
    )
    version_of = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        related_name="versioned_conditions",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)

    def __str__(self):
        return "Condition for %s: %s %s %s" % (
            str(self.rule),
            self.property,
            self.operator,
            self.value,
        )

    def get_skip_create_audit_log(self) -> bool:
        segment = self.rule.get_segment()
        return segment.version_of_id != segment.id

    def get_update_log_message(self, history_instance) -> typing.Optional[str]:
        return f"Condition updated on segment '{self._get_segment().name}'."

    def get_create_log_message(self, history_instance) -> typing.Optional[str]:
        if not self.created_with_segment:
            return f"Condition added to segment '{self._get_segment().name}'."

    def get_delete_log_message(self, history_instance) -> typing.Optional[str]:
        if not self._get_segment().deleted_at:
            return f"Condition removed from segment '{self._get_segment().name}'."

    def get_audit_log_related_object_id(self, history_instance) -> int:
        return self._get_segment().id

    def _get_segment(self) -> Segment:
        """
        Temporarily cache the segment on the condition object to reduce number of queries.
        """
        if not hasattr(self, "segment"):
            setattr(self, "segment", self.rule.get_segment())
        return self.segment

    def _get_project(self) -> typing.Optional[Project]:
        return self.rule.get_segment().project


class WhitelistedSegment(models.Model):
    """
    In order to grandfather in existing segments, these models represent segments
    that do not conform to the SEGMENT_RULES_CONDITIONS_LIMIT and may have
    more than the typically allowed number of segment rules and conditions.
    """

    segment = models.OneToOneField(
        Segment,
        on_delete=models.CASCADE,
        related_name="whitelisted_segment",
    )
    created_at = models.DateTimeField(null=True, auto_now_add=True)
    updated_at = models.DateTimeField(null=True, auto_now=True)
