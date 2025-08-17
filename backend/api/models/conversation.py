from django.db import models

from api.models import Listing, Profile

class Conversation(models.Model):
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="conversations"
    )
    participants = models.ManyToManyField(Profile, related_name="conversations")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation for {self.listing.title}"