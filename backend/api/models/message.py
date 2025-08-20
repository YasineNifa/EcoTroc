from django.db import models

from api.models.conversation import Conversation
from api.models.profile import Profile


class Message(models.Model):
    class MessageType(models.TextChoices):
        TEXT = "text", "Text"
        OFFER = "offer", "Offer"

    message_type = models.CharField(
        max_length=10,
        choices=MessageType.choices,
        default=MessageType.TEXT
    )
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
