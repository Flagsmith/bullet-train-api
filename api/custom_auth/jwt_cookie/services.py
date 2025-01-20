from django.conf import settings
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import SlidingToken

from custom_auth.jwt_cookie.constants import JWT_SLIDING_COOKIE_KEY
from users.models import FFAdminUser


def authorise_response(user: FFAdminUser, response: Response, secure=False) -> Response:
    sliding_token = SlidingToken.for_user(user)
    response.set_cookie(
        JWT_SLIDING_COOKIE_KEY,
        str(sliding_token),
        httponly=True,
        secure=secure,
        samesite=settings.COOKIE_SAME_SITE,
    )
    return response
