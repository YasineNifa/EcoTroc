from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from api.models.profile import Profile
from api.models.transaction import Transaction


class Review(models.Model):
    transaction = models.ForeignKey(
        Transaction, on_delete=models.CASCADE, related_name="reviews"
    )
    reviewer = models.ForeignKey(
        Profile, related_name="given_reviews", on_delete=models.CASCADE
    )
    reviewed_profile = models.ForeignKey(
        Profile, related_name="received_reviews", on_delete=models.CASCADE
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["transaction", "reviewer"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"Review for {self.transaction.listing.title} by {self.reviewer.user.username}"
