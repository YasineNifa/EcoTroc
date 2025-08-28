from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    """
    An authentication class that authenticates users via a JWT
    stored in an HTTP-only cookie.
    """
    def authenticate(self, request):
        # Get the access token from the cookie
        access_token = request.COOKIES.get(settings.SIMPLE_JWT.get('ACCESS_TOKEN_COOKIE', 'access_token'))

        if not access_token:
            return None

        # Validate the token
        validated_token = self.get_validated_token(access_token)
        
        # Get the user associated with the token
        return self.get_user(validated_token), validated_token