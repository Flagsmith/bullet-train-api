from django.db import models

from environments.models import Environment
from integrations.common.models import IntegrationsModel


class PendoConfiguration(IntegrationsModel):
    environment = models.OneToOneField(
        Environment, related_name="pendo_config", on_delete=models.CASCADE
    )
