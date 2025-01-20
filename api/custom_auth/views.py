from typing import Any

from django.conf import settings
from django.contrib.auth import user_logged_out
from django.utils.decorators import method_decorator
from djoser.views import TokenCreateView, UserViewSet
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.throttling import ScopedRateThrottle

from custom_auth.jwt_cookie.services import authorise_response
from custom_auth.mfa.backends.application import CustomApplicationBackend
from custom_auth.mfa.trench.command.authenticate_second_factor import (
    authenticate_second_step_command,
)
from custom_auth.mfa.trench.exceptions import (
    MFAMethodDoesNotExistError,
    MFAValidationError,
)
from custom_auth.mfa.trench.models import MFAMethod
from custom_auth.mfa.trench.responses import ErrorResponse
from custom_auth.mfa.trench.serializers import CodeLoginSerializer
from custom_auth.mfa.trench.utils import user_token_generator
from custom_auth.serializers import CustomUserDelete
from users.constants import DEFAULT_DELETE_ORPHAN_ORGANISATIONS_VALUE

from .models import UserPasswordResetRequest


class CustomAuthTokenLoginOrRequestMFACode(TokenCreateView):
    """
    Class to handle throttling for login requests
    """

    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"

    def post(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        try:
            mfa_model = MFAMethod
            mfa_method = mfa_model.objects.get_primary_active(user_id=user.id)
            conf = settings.TRENCH_AUTH["MFA_METHODS"]["app"]
            mfa_handler = CustomApplicationBackend(mfa_method=mfa_method, config=conf)
            mfa_handler.dispatch_message()
            return Response(
                data={
                    "ephemeral_token": user_token_generator.make_token(user),
                    "method": mfa_method.name,
                }
            )
        except MFAMethodDoesNotExistError:
            if settings.COOKIE_AUTH_ENABLED:
                return authorise_response(
                    user,
                    Response(status=HTTP_204_NO_CONTENT),
                    secure=request.is_secure(),
                )
            return self._action(serializer)


class CustomAuthTokenLoginWithMFACode(TokenCreateView):
    """
    Override class to add throttling
    """

    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "mfa_code"

    def post(self, request: Request) -> Response:
        serializer = CodeLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = authenticate_second_step_command(
                code=serializer.validated_data["code"],
                ephemeral_token=serializer.validated_data["ephemeral_token"],
            )
            serializer.user = user
            if settings.COOKIE_AUTH_ENABLED:
                return authorise_response(
                    user,
                    Response(status=HTTP_204_NO_CONTENT),
                    secure=request.is_secure(),
                )
            return self._action(serializer)
        except MFAValidationError as cause:
            return ErrorResponse(error=cause, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_token(request):
    Token.objects.filter(user=request.user).delete()
    user_logged_out.send(
        sender=request.user.__class__, request=request, user=request.user
    )
    return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(
    name="destroy",
    decorator=swagger_auto_schema(query_serializer=CustomUserDelete()),
)
class FFAdminUserViewSet(UserViewSet):
    throttle_scope = "signup"

    def perform_authentication(self, request: Request) -> None:
        if self.action == "create":
            return
        return super().perform_authentication(request)

    def get_throttles(self):
        """
        Used for throttling create(signup) action
        """
        throttles = []
        if self.action == "create":
            throttles = [ScopedRateThrottle()]
        return throttles

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        response = super().create(request, *args, **kwargs)
        if settings.COOKIE_AUTH_ENABLED:
            authorise_response(self.user, response)
        return response

    def perform_destroy(self, instance):
        instance.delete(
            delete_orphan_organisations=self.request.data.get(
                "delete_orphan_organisations",
                DEFAULT_DELETE_ORPHAN_ORGANISATIONS_VALUE,
            )
        )

    @action(["post"], detail=False)
    def reset_password(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.get_user()
        if user and user.can_send_password_reset_email():
            super().reset_password(request, *args, **kwargs)
            UserPasswordResetRequest.objects.create(user=user)

        return Response(status=status.HTTP_204_NO_CONTENT)
