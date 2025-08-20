from django.db import models

from api.models.conversation import Conversation
from api.models.profile import Profile
from api.models.proposition import Proposition


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
    proposition = models.OneToOneField(
        Proposition, 
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='message'
    )

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"Message from {self.sender.user.username} at {self.timestamp}"
