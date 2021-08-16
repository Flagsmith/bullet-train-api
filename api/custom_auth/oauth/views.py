import logging

from drf_yasg2.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from api.serializers import ErrorSerializer
from custom_auth.oauth.exceptions import GithubError, GoogleError
from custom_auth.oauth.serializers import (
    GithubLoginSerializer,
    GoogleLoginSerializer,
)
from custom_auth.serializers import CustomTokenSerializer

logger = logging.getLogger(__name__)
AUTH_ERROR_MESSAGE = "An error occurred authenticating with {}"
GITHUB_AUTH_ERROR_MESSAGE = AUTH_ERROR_MESSAGE.format("GITHUB")
GOOGLE_AUTH_ERROR_MESSAGE = AUTH_ERROR_MESSAGE.format("GOOGLE")


@swagger_auto_schema(
    method="post",
    request_body=GoogleLoginSerializer,
    responses={200: CustomTokenSerializer(), 502: ErrorSerializer()},
)
@api_view(["POST"])
@permission_classes([AllowAny])
def login_with_google(request):
    try:
        serializer = GoogleLoginSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        token = serializer.save()
        return Response(data=CustomTokenSerializer(instance=token).data)
    except GoogleError as e:
        logger.warning("%s: %s" % (GOOGLE_AUTH_ERROR_MESSAGE, str(e)))
        return Response(
            data={"message": GOOGLE_AUTH_ERROR_MESSAGE},
            status=status.HTTP_502_BAD_GATEWAY,
        )


@swagger_auto_schema(
    method="post",
    request_body=GithubLoginSerializer,
    responses={200: CustomTokenSerializer(), 502: ErrorSerializer()},
)
@api_view(["POST"])
@permission_classes([AllowAny])
def login_with_github(request):
    try:
        serializer = GithubLoginSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        token = serializer.save()
        return Response(data=CustomTokenSerializer(instance=token).data)
    except GithubError as e:
        logger.warning("%s: %s" % (GITHUB_AUTH_ERROR_MESSAGE, str(e)))
        return Response(
            data={"message": GITHUB_AUTH_ERROR_MESSAGE},
            status=status.HTTP_502_BAD_GATEWAY,
        )
