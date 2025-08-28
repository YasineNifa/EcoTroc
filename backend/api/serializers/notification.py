from rest_framework import serializers
from api.models.notification import Notification
from api.models.message import Message
from api.models.proposition import Proposition

# --- Serializers for the related objects ---
# These will be used by the GenericRelatedField below.
# They define what data is shown for the object linked to the notification.


class NotificationMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "conversation"]


class NotificationPropositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposition
        fields = ["id", "listing", "status"]


# --- The Main Notification Serializer ---


class NotificationSerializer(serializers.ModelSerializer):
    # This field will dynamically serialize the related object (Message, Proposition, etc.)
    # based on its type, using the serializers defined above.
    content_object = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id",
            "recipient",
            "message",
            "notification_type",
            "is_read",
            "created_at",
            "content_object",  # The nested object data
        ]
        read_only_fields = fields  # Notifications are read-only from the API

    def get_content_object(self, obj):
        """
        Custom method to serialize the generic foreign key object.
        """
        if isinstance(obj.content_object, Message):
            return NotificationMessageSerializer(obj.content_object).data
        if isinstance(obj.content_object, Proposition):
            return NotificationPropositionSerializer(obj.content_object).data
        # Add more conditions here for other types like Review
        return None
