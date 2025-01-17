import os

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from organisations.models import Subscription
from organisations.subscriptions.constants import ENTERPRISE
from users.models import FFAdminUser


def test_e2e_teardown(settings, db) -> None:
    # TODO: tidy up this hack to fix throttle rates
    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["signup"] = "1000/min"
    token = "test-token"
    register_url = "/api/v1/auth/users/"
    settings.ENABLE_FE_E2E = True
    settings.E2E_TEST_AUTH_TOKEN = token
    settings.MIDDLEWARE.append("e2etests.middleware.E2ETestMiddleware")

    client = APIClient(HTTP_X_E2E_TEST_AUTH_TOKEN=token)

    # Register a user with the e2e test user email address
    test_password = FFAdminUser.objects.make_random_password()
    register_data = {
        "email": settings.E2E_SIGNUP_USER,
        "first_name": "test",
        "last_name": "test",
        "password": test_password,
        "re_password": test_password,
    }
    register_response = client.post(register_url, data=register_data)
    assert register_response.status_code == status.HTTP_201_CREATED

    # then test that we can teardown that user
    url = reverse(viewname="api-v1:e2etests:teardown")
    teardown_response = client.post(url)
    assert teardown_response.status_code == status.HTTP_204_NO_CONTENT
    e2e_user: FFAdminUser = FFAdminUser.objects.get(email=settings.E2E_USER)
    assert e2e_user is not None
    assert not FFAdminUser.objects.filter(email=settings.E2E_SIGNUP_USER).exists()
    for subscription in Subscription.objects.filter(
        organisation__in=e2e_user.organisations.all()
    ):
        assert subscription.max_seats == 8
        assert subscription.plan == ENTERPRISE
        assert subscription.subscription_id == "test_subscription_id"


def test_e2e_teardown_with_incorrect_token(settings, db):
    # Given
    os.environ["E2E_TEST_AUTH_TOKEN"] = "expected-token"
    url = reverse("api-v1:e2etests:teardown")

    client = APIClient(HTTP_X_E2E_TEST_AUTH_TOKEN="incorrect-token")

    # When
    teardown_response = client.post(url)

    # Then
    assert teardown_response.status_code == status.HTTP_401_UNAUTHORIZED
