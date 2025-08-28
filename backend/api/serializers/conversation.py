from rest_framework import serializers

from api.models import Conversation
from api.serializers.listing import ListingSerializer
from api.serializers.message import MessageSerializer
from api.serializers.profile import ProfileSerializer


class ConversationSerializer(serializers.ModelSerializer):
    participants = ProfileSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    listing = ListingSerializer(read_only=True)
    has_unread_messages = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "listing",
            "participants",
            "messages",
            "created_at",
            "has_unread_messages",
            "last_message",
        ]
        read_only_fields = ["id", "created_at", "listing", "participants", "messages"]

    def get_has_unread_messages(self, obj):
        request = self.context.get("request")
        if request:
            user = request.user.profile
            print(obj.messages.filter(is_read=False).exclude(sender=user))
            return obj.messages.filter(is_read=False).exclude(sender=user).exists()

        return False

    def get_last_message(self, obj):
        last_message = obj.messages.order_by("-timestamp").first()
        return MessageSerializer(last_message).data if last_message else None
