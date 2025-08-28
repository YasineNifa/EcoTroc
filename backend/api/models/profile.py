from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    jeton_balance = models.PositiveIntegerField(
        default=10
    )  # 10 jetons offertes à l'inscription
    locked_jetons = models.PositiveIntegerField(default=0)
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to="profiles/", blank=True, null=True)

    def __str__(self):
        return self.user.username
