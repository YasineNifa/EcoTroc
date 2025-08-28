from rest_framework import serializers

from api.models import Proposition
from api.serializers.listing import ListingSerializer
from api.serializers.profile import ProfileSerializer


class PropositionSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)
    buyer = ProfileSerializer(read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Proposition
        fields = [
            "id",
            "listing",
            "buyer",
            "amount",
            "status_display",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "listing",
            "buyer",
            "status",
            "created_at",
            "updated_at",
        ]
