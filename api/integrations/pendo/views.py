from integrations.common.views import IntegrationCommonViewSet
from integrations.pendo.models import PendoConfiguration
from integrations.pendo.serializers import PendoConfigurationSerializer


class PendoConfigurationViewSet(IntegrationCommonViewSet):
    serializer_class = PendoConfigurationSerializer
    pagination_class = None  # set here to ensure documentation is correct
    model_class = PendoConfiguration
