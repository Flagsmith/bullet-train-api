import pickle
import typing
import uuid
from datetime import datetime

from django.db import models
from django.utils import timezone


class Task(models.Model):
    uuid = models.UUIDField(unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    scheduled_for = models.DateTimeField(blank=True, null=True, default=timezone.now)
    completed_at = models.DateTimeField(blank=True, null=True)

    pickled_callable = models.BinaryField()
    pickled_args = models.BinaryField(blank=True, null=True)
    pickled_kwargs = models.BinaryField(blank=True, null=True)

    # denormalise failures so that we can use select_for_update
    num_failures = models.IntegerField(blank=True, null=True, default=0)

    @classmethod
    def create(cls, callable_: typing.Callable, *args, **kwargs) -> "Task":
        return Task(
            pickled_callable=pickle.dumps(callable_),
            pickled_args=pickle.dumps(args),
            pickled_kwargs=pickle.dumps(kwargs),
        )

    @classmethod
    def schedule_task(
        cls, schedule_for: datetime, callable_: typing.Callable, *args, **kwargs
    ) -> "Task":
        task = cls.create(callable_, *args, **kwargs)
        task.scheduled_for = schedule_for
        return task

    def run(self):
        return self._callable(*self._args, **self._kwargs)

    @property
    def _callable(self) -> typing.Callable:
        return pickle.loads(self.pickled_callable)

    @property
    def _args(self) -> typing.List[typing.Any]:
        return pickle.loads(self.pickled_args)

    @property
    def _kwargs(self) -> typing.Dict[str, typing.Any]:
        return pickle.loads(self.pickled_kwargs)

    def fail(self):
        self.num_failures += 1


class TaskResult(models.Choices):
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"


class TaskRun(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="task_runs")
    started_at = models.DateTimeField()
    finished_at = models.DateTimeField(blank=True, null=True)
    result = models.CharField(
        max_length=50, choices=TaskResult.choices, blank=True, null=True
    )
    error_details = models.TextField(blank=True, null=True)
