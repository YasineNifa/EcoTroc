
from rest_framework import serializers

from api.models import Message
from api.serializers.profile import ProfileSerializer
from api.serializers.proposition import PropositionSerializer



class MessageSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(read_only=True)
    proposition = PropositionSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "content", "timestamp", "conversation", "message_type", "proposition", "is_read"]
        read_only_fields = ["id", "sender", "timestamp", "conversation", "message_type", "proposition"]