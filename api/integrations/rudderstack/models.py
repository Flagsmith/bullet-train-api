from django.db import models

from environments.models import Environment
from integrations.common.models import IntegrationsModel


class RudderstackConfiguration(IntegrationsModel):
    environment = models.OneToOneField(
        Environment, related_name="rudderstack_config", on_delete=models.CASCADE
    )
