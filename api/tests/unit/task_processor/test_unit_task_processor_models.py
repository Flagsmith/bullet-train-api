from datetime import timedelta
from decimal import Decimal

import pytest
from django.utils import timezone

from task_processor.decorators import register_task_handler
from task_processor.models import RecurringTask, Task

now = timezone.now()
one_hour_ago = now - timedelta(hours=1)
one_hour_from_now = now + timedelta(hours=1)


@register_task_handler()
def my_callable(arg_one: str, arg_two: str = None):
    """Example callable to use for tasks (needs to be global for registering to work)"""
    return arg_one, arg_two


def test_task_run():
    # Given
    args = ["foo"]
    kwargs = {"arg_two": "bar"}

    task = Task.create(
        my_callable.task_identifier,
        scheduled_for=timezone.now(),
        args=args,
        kwargs=kwargs,
    )

    # When
    result = task.run()

    # Then
    assert result == my_callable(*args, **kwargs)


@pytest.mark.parametrize(
    "input, expected_output",
    (
        ({"value": Decimal("10")}, '{"value": 10}'),
        ({"value": Decimal("10.12345")}, '{"value": 10.12345}'),
    ),
)
def test_serialize_data_handles_decimal_objects(input, expected_output):
    assert Task.serialize_data(input) == expected_output


@pytest.mark.parametrize(
    "first_run_time, expected",
    ((one_hour_ago.time(), True), (one_hour_from_now.time(), False)),
)
def test_recurring_task_run_should_execute_first_run_at(first_run_time, expected):
    assert (
        RecurringTask(
            first_run_time=first_run_time, run_every=timedelta(days=1)
        ).should_execute
        == expected
    )


def test_is_queue_full_returns_true_if_queue_is_full(db):
    # Given
    task_identifier = "my_callable"

    # some incomplete task
    for _ in range(10):
        Task.objects.create(task_identifier=task_identifier)

    task = Task.create(task_identifier=task_identifier, scheduled_for=timezone.now())
    # When
    assert task.is_queue_full(9) is True


def test_is_queue_full_returns_false_if_queue_is_not_full(db):
    # Given
    task_identifier = "my_callable"

    # Some incomplete task
    for _ in range(10):
        Task.objects.create(task_identifier=task_identifier)

        # tasks with different identifiers
        Task.objects.create(task_identifier="task_with_different_identifier")

        # failed tasks
        Task.objects.create(
            task_identifier="task_with_different_identifier", num_failures=3
        )

    # When
    task = Task.create(task_identifier=task_identifier, scheduled_for=timezone.now())

    # Then
    assert task.is_queue_full(10) is False
