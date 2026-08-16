from django.conf import settings
from django.utils import timezone
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView

from api.models import Profile


def auth_cookie_defaults():
    if settings.DEBUG:
        return {"httponly": True, "samesite": "Lax"}
    return {"httponly": True, "samesite": "none", "secure": True}


def update_user_last_login(user):
    try:
        profile = user.profile
        profile.last_login_at = timezone.now()
        profile.save(update_fields=["last_login_at"])
        print(f"--- LOGIQUE DE CONNEXION EXÉCUTÉE pour {user.username} ---")
    except Profile.DoesNotExist:
        print(f"--- ATTENTION : Pas de profil trouvé pour {user.username} ---")


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            raise e

        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.pop("access")
            refresh_token = response.data.pop("refresh")
            response.set_cookie(
                "access_token", access_token, **auth_cookie_defaults()
            )
            response.set_cookie(
                "refresh_token", refresh_token, **auth_cookie_defaults()
            )
            user = serializer.user
            update_user_last_login(user)

        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        request.data["refresh"] = request.COOKIES.get("refresh_token")
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.pop("access")
            response.set_cookie(
                "access_token", access_token, **auth_cookie_defaults()
            )
        return response


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Logout successful"})
        response.delete_cookie(
            "access_token", **{k: v for k, v in auth_cookie_defaults().items() if k != "httponly"}
        )
        response.delete_cookie(
            "refresh_token", **{k: v for k, v in auth_cookie_defaults().items() if k != "httponly"}
        )
        return response
