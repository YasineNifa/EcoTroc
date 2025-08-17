from django.db import models

from api.models.listing import Listing
from api.models.profile import Profile


class Transaction(models.Model):
    STATUS_PENDING = "pending"
    STATUS_COMPLETED = "completed"
    STATUS_FAILED = "failed"
    STATUS = (
        (STATUS_PENDING, "Pending"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_FAILED, "Failed"),
    )

    buyer = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="transactions_as_buyer"
    )
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    transaction_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS, default=STATUS_PENDING)
    seller_confirmed = models.BooleanField(default=False)
    buyer_confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f"Transaction for {self.listing.title}"
