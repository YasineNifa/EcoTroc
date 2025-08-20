
from rest_framework import serializers

from api.models import Message
from api.serializers.profile import ProfileSerializer



class MessageSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "content", "timestamp", "conversation", "message_type"]
        read_only_fields = ["id", "sender", "timestamp", "conversation", "message_type"]