import logging
import typing
from inspect import getmodule

from task_processor.models import Task
from task_processor.tasks import register_task

logger = logging.getLogger(__name__)


def register_task_handler(task_name: str = None):
    def decorator(f: typing.Callable):
        nonlocal task_name

        task_name = task_name or f.__name__
        task_module = getmodule(f).__name__.rsplit(".")[-1]
        task_identifier = f"{task_module}.{task_name}"

        register_task(task_identifier, f)

        def delay(*args, **kwargs):
            logger.debug("Creating task for function '%s'...", task_identifier)
            Task.create(task_identifier, *args, **kwargs)

        f.delay = delay
        f.task_identifier = task_identifier

        return f

    return decorator
