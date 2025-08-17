from rest_framework import viewsets, permissions, serializers

from api.models import Message, Conversation
from api.serializers import MessageSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Message.objects.filter(conversation=self.kwargs["conversation_pk"])

    def perform_create(self, serializer):
        conversation_id = self.kwargs["conversation_pk"]
        try:
            conversation_instance = Conversation.objects.get(pk=conversation_id)
        except Conversation.DoesNotExist:
            raise serializers.ValidationError("Conversation not found.")

        serializer.save(
            sender=self.request.user.profile, conversation=conversation_instance
        )
