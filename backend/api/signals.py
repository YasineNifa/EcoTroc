from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.utils import timezone

from api.models import Profile, Message, Notification, Proposition
from api.serializers import NotificationSerializer


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
        conversation = instance.conversation
        sender_profile = instance.sender
        recipient = conversation.participants.exclude(id=sender_profile.id).first()

        if recipient:
            notification = Notification.objects.create(
                recipient=recipient,
                message=f"You have a new message from {instance.sender.user.username} regarding '{instance.conversation.listing.title}'.",
                notification_type=Notification.NotificationType.NEW_MESSAGE,
                content_object=instance,
            )

        serialized_notification = NotificationSerializer(notification).data
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"notifications_{recipient.user.id}",  # Target the specific user's group
            {
                "type": "send_notification",  # This calls the send_notification method in the consumer
                "notification": serialized_notification,
            },
        )


@receiver(post_save, sender=Proposition)
def create_proposition_notificaton(sender, instance, created, **kwargs):
    if created:
        notification = Notification.objects.create(
            recipient=instance.listing.owner,
        )
        serialized_notification = NotificationSerializer(notification).data
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"notifications_{instance.listing.owner.user.id}",
            {"type": "send_notification", "notification": serialized_notification},
        )

@receiver(user_logged_in)
def update_last_login_on_user_login(sender, user, request, **kwargs):
    try:
        profile = user.profile
        profile.last_login_at = timezone.now()
        profile.save(update_fields=['last_login_at'])
    except Profile.DoesNotExist:
        pass