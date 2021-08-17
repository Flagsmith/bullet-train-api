from django.conf.urls import include, url
from rest_framework_nested import routers

from features.views import FeatureStateViewSet
from integrations.amplitude.views import AmplitudeConfigurationViewSet
from integrations.heap.views import HeapConfigurationViewSet
from integrations.mixpanel.views import MixpanelConfigurationViewSet
from integrations.rudderstack.views import RudderstackConfigurationViewSet
from integrations.segment.views import SegmentConfigurationViewSet

from .identities.traits.views import TraitViewSet
from .identities.views import IdentityViewSet
from .permissions.views import (
    UserEnvironmentPermissionsViewSet,
    UserPermissionGroupEnvironmentPermissionsViewSet,
)
from .views import EnvironmentViewSet, WebhookViewSet

router = routers.DefaultRouter()
router.register(r"", EnvironmentViewSet, basename="environment")

environments_router = routers.NestedSimpleRouter(router, r"", lookup="environment")
environments_router.register(
    r"identities", IdentityViewSet, basename="environment-identities"
)
environments_router.register(
    r"webhooks", WebhookViewSet, basename="environment-webhooks"
)
environments_router.register(
    r"featurestates", FeatureStateViewSet, basename="environment-featurestates"
)
environments_router.register(
    r"user-permissions",
    UserEnvironmentPermissionsViewSet,
    basename="environment-user-permissions",
)
environments_router.register(
    r"user-group-permissions",
    UserPermissionGroupEnvironmentPermissionsViewSet,
    basename="environment-user-group-permissions",
)
environments_router.register(
    r"integrations/amplitude",
    AmplitudeConfigurationViewSet,
    basename="integrations-amplitude",
)
environments_router.register(
    r"integrations/segment",
    SegmentConfigurationViewSet,
    basename="integrations-segment",
)
environments_router.register(
    r"integrations/heap",
    HeapConfigurationViewSet,
    basename="integrations-heap",
)
environments_router.register(
    r"integrations/mixpanel",
    MixpanelConfigurationViewSet,
    basename="integrations-mixpanel",
)
environments_router.register(
    r"integrations/rudderstack",
    RudderstackConfigurationViewSet,
    basename="integrations-rudderstack",
)
identity_router = routers.NestedSimpleRouter(
    environments_router, r"identities", lookup="identity"
)
identity_router.register(
    r"featurestates", FeatureStateViewSet, basename="identity-featurestates"
)
identity_router.register(r"traits", TraitViewSet, basename="identities-traits")

app_name = "environments"

urlpatterns = [
    url(r"^", include(router.urls)),
    url(r"^", include(environments_router.urls)),
    url(r"^", include(identity_router.urls)),
]
