from rest_framework import serializers

from api.models.notification import Notification
from api.models.message import Message
from api.models.proposition import Proposition
from api.models.transaction import Transaction


class NotificationMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "conversation"]


class NotificationPropositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposition
        fields = ["id", "listing", "status"]

class NotificationTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["id", "listing", "status"]

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
            "content_object",
        ]
        read_only_fields = fields

    def get_content_object(self, obj):
        """
        Custom method to serialize the generic foreign key object.
        """
        if isinstance(obj.content_object, Message):
            return NotificationMessageSerializer(obj.content_object).data
        if isinstance(obj.content_object, Proposition):
            return NotificationPropositionSerializer(obj.content_object).data
        if isinstance(obj.content_object, Transaction):
            return NotificationTransactionSerializer(obj.content_object).data
        return None
