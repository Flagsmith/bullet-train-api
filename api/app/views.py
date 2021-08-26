import json

from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage
from django.http import HttpResponse, JsonResponse
from django.template import loader

from . import utils


def version_info(request):
    return JsonResponse(utils.get_version_info())


def index(request):
    template = loader.get_template("webpack/index.html")

    # if settings.DEBUG:
    #    template = loader.get_template("index.html")

    context = {
        "linkedin_api_key": settings.LINKEDIN_API_KEY,
    }

    return HttpResponse(template.render(context, request))


def project_overrides(request):
    config_mapping_dict = {
        "API_URL": "api",
        "ASSET_URL": "assetURL",
        "MAINTENANCE_MODE": "maintenance",
        "PREVENT_SIGNUP": "preventSignup",
        "DISABLE_INFLUXDB_FEATURES": "disableInflux",
        "FLAGSMITH_ANALYTICS": "flagsmithAnalytics",
        "FLAGSMITH_ON_FLAGSMITH_API_URL": "flagsmith",
        "FLAGSMITH_ON_FLAGSMITH_API_KEY": "flagsmithClientAPI",
        "GOOGLE_ANALYTICS_API_KEY": "ga",
        "LINKEDIN_API_KEY": "linkedin_api_key",
        "CRISP_CHAT_API_KEY": "crispChat",
        "MIXPANEL_API_KEY": "mixpanel",
        "SENTRY_API_KEY": "sentry",
        "AMPLITUDE_API_KEY": "amplitude",
    }

    project_overrides = {}

    for key, value in config_mapping_dict.items():
        settings_value = getattr(settings, key, None)
        if settings_value:
            project_overrides[value] = settings_value

    return HttpResponse(
        "window.projectOverrides = "
        + json.dumps(project_overrides, indent=4, separators=(",", ":"))
    )
