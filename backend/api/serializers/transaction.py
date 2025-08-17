
from rest_framework import serializers

from api.models import Transaction
from api.serializers.listing import ListingSerializer
from api.serializers.profile import ProfileSerializer


class TransactionSerializer(serializers.ModelSerializer):
    buyer = ProfileSerializer(read_only=True)
    listing = ListingSerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = ["id", "buyer", "listing", "transaction_date", "status"]
        read_only_fields = ["id", "transaction_date", "buyer", "listing"]
