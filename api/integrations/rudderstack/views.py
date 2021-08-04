from integrations.common.views import IntegrationCommonViewSet
from integrations.rudderstack.models import RudderstackConfiguration
from integrations.rudderstack.serializers import (
    RudderstackConfigurationSerializer,
)


class RudderstackConfigurationViewSet(IntegrationCommonViewSet):
    serializer_class = RudderstackConfigurationSerializer
    pagination_class = None  # set here to ensure documentation is correct
    model_class = RudderstackConfiguration
