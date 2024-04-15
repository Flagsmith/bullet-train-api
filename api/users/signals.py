import warnings

from core.helpers import get_ip_address_from_request
from django.conf import settings
from django.contrib.auth.signals import (
    user_logged_in,
    user_logged_out,
    user_login_failed,
)
from django.db.models.signals import post_migrate, post_save
from django.dispatch import receiver
from django.urls import reverse

from audit.tasks import (
    create_audit_log_user_logged_in,
    create_audit_log_user_logged_out,
    create_audit_log_user_login_failed,
)
from integrations.lead_tracking.pipedrive.lead_tracker import (
    PipedriveLeadTracker,
)
from users.models import FFAdminUser
from users.tasks import (
    create_pipedrive_lead,
    send_email_changed_notification_email,
)


@receiver(post_migrate, sender=FFAdminUser)
def warn_insecure(sender, **kwargs):
    if sender.objects.count() == 0:
        path = reverse("api-v1:users:config-init")
        warnings.warn(
            f"YOUR INSTALLATION IS INSECURE: PLEASE ACCESS http://<your-server-domain:8000>{path}"
            " TO CREATE A SUPER USER",
            RuntimeWarning,
        )


@receiver(post_save, sender=FFAdminUser)
def create_pipedrive_lead_signal(sender, instance, created, **kwargs):
    user: FFAdminUser = instance

    if not created:
        return False

    if not PipedriveLeadTracker.should_track(user):
        return

    create_pipedrive_lead.delay(args=(user.id,))


@receiver(post_save, sender=FFAdminUser)
def send_warning_email(sender, instance, created, **kwargs):
    if instance._initial_state and (instance._initial_state["email"] != instance.email):
        send_email_changed_notification_email.delay(
            args=(
                instance.first_name,
                settings.DEFAULT_FROM_EMAIL,
                instance._initial_state["email"],
            )
        )


@receiver(user_logged_in, sender=FFAdminUser)
def signal_audit_log_user_logged_in(sender, request, user, **kwargs):
    ip_address = None if request is None else get_ip_address_from_request(request)
    create_audit_log_user_logged_in.delay(args=(user.pk, ip_address))


@receiver(user_logged_out, sender=FFAdminUser)
def signal_audit_log_user_logged_out(sender, request, user, **kwargs):
    ip_address = None if request is None else get_ip_address_from_request(request)
    create_audit_log_user_logged_out.delay(args=(user.pk, ip_address))


@receiver(user_login_failed)
def signal_audit_log_user_login_failed(sender, credentials, request, **kwargs):
    ip_address = None if request is None else get_ip_address_from_request(request)
    # get codes passed by auth serializers that catch APIException and send user_login_failed
    codes = kwargs.get("codes", None)
    # unfortunately DRF's get_codes() is inconsistent betweeen APIException and ValidationError,
    # and sometimes returns str, so coerce that to list[str]
    codes = [codes] if type(codes) is str else codes
    create_audit_log_user_login_failed.delay(args=(credentials, ip_address, codes))
