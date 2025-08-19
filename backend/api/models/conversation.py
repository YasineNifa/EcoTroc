from django.db import models

from api.models.listing import Listing
from api.models.profile import Profile

class Conversation(models.Model):
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="conversations"
    )
    participants = models.ManyToManyField(Profile, related_name="conversations")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation for {self.listing.title} - {self.created_at}"