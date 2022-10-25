from functools import wraps
from typing import List

from django.conf import settings

from . import tasks


def _sse_enabled(get_project_from_first_arg=lambda obj: obj.project):
    """
    Decorator that only call the service function if sse is enabled else return None.
    i.e: settings are configured and the project has sse enabled.

    :param get_project_from_first_arg: function that takes the first argument
        of the decorated function and returns the project object.
    """

    def decorator(service_func):
        @wraps(service_func)
        def wrapper(*args, **kwargs):
            project = get_project_from_first_arg(args[0])
            if all(
                [
                    settings.SSE_SERVER_BASE_URL,
                    settings.SSE_AUTHENTICATION_TOKEN,
                    project.enable_realtime_updates,
                ]
            ):
                return service_func(*args, **kwargs)
            return None

        return wrapper

    return decorator


@_sse_enabled(get_project_from_first_arg=lambda obj: obj)
def send_environment_update_message_using_project(project):
    environment_keys = list(
        project.environments.all().values_list("api_key", flat=True)
    )
    tasks.send_environment_update_messages.delay(args=(environment_keys,))


@_sse_enabled()
def send_environment_update_message_using_environment(environment):
    tasks.send_environment_update_message.delay(args=(environment.api_key,))


@_sse_enabled()
def send_identity_update_message(environment, identifier: str):
    tasks.send_identity_update_message.delay(args=(environment.api_key, identifier))


@_sse_enabled()
def send_identity_update_messages(environment, identifiers: List[str]):
    tasks.send_identity_update_messages.delay(args=(environment.api_key, identifiers))
