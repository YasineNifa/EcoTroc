from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver

from api.models import Profile, Message, Notification




@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    """
    This signal is triggered after a User object is saved.
    If the user was just created, it creates a corresponding Profile object.
    """
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=Message)
def create_message_notification(sender, instance, created, **kwargs):
    if created:
        # Don't notify the user if they sent the message themselves
        if instance.sender != instance.conversation.listing.owner:
             recipient = instance.conversation.listing.owner
        else:
             recipient = instance.conversation.buyer

        if instance.sender != recipient:
            notification = Notification.objects.create(
                recipient=recipient,
                message=f"You have a new message from {instance.sender.user.username} regarding '{instance.conversation.listing.title}'.",
                notification_type=Notification.NotificationType.NEW_MESSAGE,
                content_object=instance
            )

        # Now, push it to the WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_{recipient.user.id}', # Target the specific user's group
            {
                'type': 'send_notification', # This calls the send_notification method in the consumer
                'message': notification.message # Send the notification message
            }
        )