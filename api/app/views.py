import json
import logging

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt
from rest_framework.request import Request

from . import utils

logger = logging.getLogger(__name__)


def version_info(request: Request) -> JsonResponse:
    return JsonResponse(utils.get_version_info())


@csrf_exempt
def index(request):
    if request.method != "GET":
        logger.warning(
            "Invalid request made to %s with method %s", request.path, request.method
        )
        return HttpResponse(status=405, content_type="application/json")

    template = loader.get_template("webpack/index.html")
    return HttpResponse(template.render(request=request))


def project_overrides(request):
    """
    Build and return the dictionary of front-end relevant environment variables for configuration.
    It gets loaded as a script tag in the head of the browser when the frontend application starts up.
    """
    config_mapping_dict = {
        "amplitude": "AMPLITUDE_API_KEY",
        "api": "API_URL",
        "assetURL": "ASSET_URL",
        "cookieAuthEnabled": "COOKIE_AUTH_ENABLED",
        "cookieSameSite": "COOKIE_SAME_SITE",
        "crispChat": "CRISP_CHAT_API_KEY",
        "disableAnalytics": "DISABLE_ANALYTICS_FEATURES",
        "flagsmith": "FLAGSMITH_ON_FLAGSMITH_API_KEY",
        "flagsmithAnalytics": "FLAGSMITH_ANALYTICS",
        "flagsmithClientAPI": "FLAGSMITH_ON_FLAGSMITH_API_URL",
        "flagsmithRealtime": "ENABLE_FLAGSMITH_REALTIME",
        "fpr": "FIRST_PROMOTER_ID",
        "ga": "GOOGLE_ANALYTICS_API_KEY",
        "githubAppURL": "GITHUB_APP_URL",
        "headway": "HEADWAY_API_KEY",
        "hideInviteLinks": "DISABLE_INVITE_LINKS",
        "linkedinPartnerTracking": "LINKEDIN_PARTNER_TRACKING",
        "maintenance": "MAINTENANCE_MODE",
        "mixpanel": "MIXPANEL_API_KEY",
        "preventEmailPassword": "PREVENT_EMAIL_PASSWORD",
        "preventSignup": "PREVENT_SIGNUP",
        "sentry": "SENTRY_API_KEY",
    }

    override_data = {
        key: getattr(settings, value)
        for key, value in config_mapping_dict.items()
        if getattr(settings, value, None) is not None
    }
    is_secure_request = request.is_secure()
    override_data["useSecureCookies"] = is_secure_request or settings.USE_SECURE_COOKIES
    if settings.COOKIE_SAME_SITE is not None:
        same_site = settings.COOKIE_SAME_SITE
    elif is_secure_request:
        same_site = "None"
    else:
        same_site = "Lax"
    override_data["cookieSameSite"] = same_site

    return HttpResponse(
        content="window.projectOverrides = " + json.dumps(override_data),
        content_type="application/javascript",
    )
