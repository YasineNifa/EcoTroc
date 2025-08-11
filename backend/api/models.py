from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    jeton_balance = models.PositiveIntegerField(
        default=10
    )  # 10 jetons offertes à l'inscription
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to="profiles/", blank=True, null=True)

    def __str__(self):
        return self.user.username


class Listing(models.Model):
    STATUS_AVAILABLE = "available"
    STATUS_RESERVED = "reserved"
    STATUS_COMPLETED = "completed"
    STATUS = (
        (STATUS_AVAILABLE, "Available"),
        (STATUS_RESERVED, "Reserved"),
        (STATUS_COMPLETED, "Completed"),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    jeton_value = models.PositiveIntegerField()  # in jetons
    owner = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="listings"
    )
    status = models.CharField(max_length=20, choices=STATUS, default=STATUS_AVAILABLE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to="listings/", blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-created_at"]


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


class Conversation(models.Model):
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="conversations"
    )
    participants = models.ManyToManyField(Profile, related_name="conversations")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation for {self.listing.title}"


class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="sent_messages"
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"Message from {self.sender.user.username} at {self.timestamp}"


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
