from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import Conversation, Message, Notification
from api.serializers import ConversationSerializer


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_class = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user.profile)

    # @action(detail=True, methods=['post'])
    # def mark_as_read(self, request, pk=None):
    #     conversation = self.get_object()
    #     user_profile = request.user.profile
    #     # Update all messages in a single database query
    #     conversation.messages.exclude(sender=user_profile).update(is_read=True)

    #     return Response({"status": "messages marked as read."},status=status.HTTP_200_OK)

    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def mark_as_read(self, request, pk=None):
        """
        Marks all unread messages in a conversation as read for the current user
        and updates message notifications if no unread conversations remain.
        """
        conversation = self.get_object()
        user_profile = request.user.profile

        # 1. Mark messages in this conversation as read
        messages_to_update = conversation.messages.filter(is_read=False).exclude(
            sender=user_profile
        )
        updated_count = messages_to_update.update(is_read=True)

        # --- NEW LOGIC STARTS HERE ---

        # 2. Check if there are any other unread messages for this user across all conversations
        any_other_unread = (
            Message.objects.filter(
                conversation__participants=user_profile, is_read=False
            )
            .exclude(sender=user_profile)
            .exists()
        )

        # 3. If no other unread messages exist, mark all NEW_MESSAGE notifications as read
        if not any_other_unread:
            Notification.objects.filter(
                recipient=user_profile,
                notification_type=Notification.NotificationType.NEW_MESSAGE,
                is_read=False,
            ).update(is_read=True)

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"notifications_{user_profile.user.id}",
                {
                    "type": "notifications_updated",
                },
            )

        return Response(
            {"status": f"{updated_count} messages marked as read."},
            status=status.HTTP_200_OK,
        )
