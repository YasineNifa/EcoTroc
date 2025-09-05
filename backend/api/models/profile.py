from django_countries.fields import CountryField

from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    jeton_balance = models.PositiveIntegerField(
        default=10
    )  # 10 tokens for the inscription
    locked_jetons = models.PositiveIntegerField(default=0)
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    country = CountryField("Country", blank=True, null=True)
    city = models.CharField("City", max_length=100, blank=True)
    show_city_in_profile = models.BooleanField("Display city in profile", default=True)
    # preferred_language = models.CharField("Langue", max_length=10, default='fr')
    phone_number = models.CharField("Phone number", max_length=20, blank=True)
    email_verified = models.BooleanField("Verified email", default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField("Last connexion", null=True, blank=True)


    def __str__(self):
        return self.user.username
