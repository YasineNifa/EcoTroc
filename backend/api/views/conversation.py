from rest_framework import viewsets, permissions

from api.models import Conversation
from api.serializers import ConversationSerializer


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_class = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user.profile)

    # def get_queryset(self):
    #     print("I am here : ", self.request.user)
    #     return self.request.user.profile.conversations.all()