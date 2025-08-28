from django.db import models

from api.models.listing import Listing
from api.models.profile import Profile


class Proposition(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"
        COUNTERED = "countered", "Countered"

    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="propositions"
    )
    buyer = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="made_propositions"
    )
    amount = models.PositiveIntegerField()
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Offer of {self.amount} for '{self.listing.title}' by {self.buyer.user.username}"
