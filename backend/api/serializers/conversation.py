from rest_framework import serializers

from api.models import Conversation
from api.serializers.listing import ListingSerializer
from api.serializers.message import MessageSerializer
from api.serializers.profile import ProfileSerializer


class ConversationSerializer(serializers.ModelSerializer):
    participants = ProfileSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    listing = ListingSerializer(read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "listing", "participants", "messages", "created_at"]
        # fields = ['id', 'listing', 'participants', 'messages']
        read_only_fields = ["id", "created_at", "listing", "participants", "messages"]
