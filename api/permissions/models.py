from core.models import abstract_base_auditable_model_factory
from django.db import models

from audit.related_object_type import RelatedObjectType

PROJECT_PERMISSION_TYPE = "PROJECT"
ENVIRONMENT_PERMISSION_TYPE = "ENVIRONMENT"
ORGANISATION_PERMISSION_TYPE = "ORGANISATION"

PERMISSION_TYPES = (
    (PROJECT_PERMISSION_TYPE, "Project"),
    (ENVIRONMENT_PERMISSION_TYPE, "Environment"),
    (ORGANISATION_PERMISSION_TYPE, "Organisation"),
)


# effectively read-only - not audited
class PermissionModel(models.Model):
    key = models.CharField(max_length=100, primary_key=True)
    description = models.TextField()
    type = models.CharField(max_length=100, choices=PERMISSION_TYPES, null=True)

    def get_audit_log_identity(self) -> str:
        return self.key


class AbstractBasePermissionModel(
    abstract_base_auditable_model_factory(
        RelatedObjectType.GRANT,
        audited_m2m_fields=["permissions"],
        default_messages=True,
    ),
):
    permissions = models.ManyToManyField(PermissionModel, blank=True)

    class Meta:
        abstract = True

    grant_type: str

    def get_audit_log_model_name(self, history_instance) -> str:
        return f"{self.grant_type} {super().get_audit_log_model_name(history_instance)}"

    def add_permission(self, permission_key: str):
        permission = PermissionModel.objects.get(key=permission_key)
        self.permissions.add(permission)

    def set_permissions(self, permission_keys: list):
        permissions = []
        for permission_key in permission_keys:
            permissions.append(PermissionModel.objects.get(key=permission_key))
        self.permissions.set(permissions)
