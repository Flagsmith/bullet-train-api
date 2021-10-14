from app.settings.common import (
    ALLOWED_HOSTS,
    INSTALLED_APPS,
    MIDDLEWARE,
    SWAGGER_SETTINGS,
)

ENABLE_AXES = False


ALLOWED_HOSTS.extend([".ngrok.io", "127.0.0.1", "localhost"])

INSTALLED_APPS.extend(["debug_toolbar"])

MIDDLEWARE.extend(["debug_toolbar.middleware.DebugToolbarMiddleware"])

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


SWAGGER_SETTINGS["USE_SESSION_AUTH"] = False

# Allow admin login with username and password
ENABLE_ADMIN_ACCESS_USER_PASS = True
