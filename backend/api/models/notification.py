from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from api.models.profile import Profile


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        NEW_MESSAGE = "NEW_MESSAGE", "New Message"
        NEW_PROPOSITION = "NEW_PROPOSITION", "New Proposition"
        PROPOSITION_ACCEPTED = "PROPOSITION_ACCEPTED", "Proposition Accepted"
        PROPOSITION_REJECTED = "PROPOSITION_REJECTED", "Proposition Rejected"
        NEW_REVIEW = "NEW_REVIEW", "New Review"

    recipient = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="notifications"
    )
    message = models.CharField(max_length=255)
    notification_type = models.CharField(
        max_length=30, choices=NotificationType.choices
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # Generic relation to link to any object (Message, Proposition, etc.)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Notification for {self.recipient.user.username}: {self.message}"
