from django.db import models

from projects.models import Project


class SlackConfiguration(models.Model):
    api_token = models.CharField(max_length=100, blank=False, null=False)
    project = models.OneToOneField(
        Project, on_delete=models.CASCADE, related_name="slack_config"
    )
    created_date = models.DateTimeField("DateCreated", auto_now_add=True)


class SlackEnvironment(models.Model):
    slack_configuration = models.ForeignKey(
        SlackConfiguration, related_name="env_config", on_delete=models.CASCADE
    )
    channel_id = models.CharField(
        max_length=50,
        help_text="An id of the slack channel to post messages to",
        blank=False,
        null=False,
    )
    environment = models.ForeignKey(
        "environments.Environment",
        related_name="slack_environment",
        blank=False,
        null=False,
        on_delete=models.CASCADE,
    )
    enabled = models.BooleanField(default=True)

    class Meta:
        unique_together = ("slack_configuration", "environment")
