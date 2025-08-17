from rest_framework import serializers

from api.models import Review
from api.serializers.profile import ProfileSerializer
from api.serializers.transaction import TransactionSerializer

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = ProfileSerializer(read_only=True)
    reviewed_profile = ProfileSerializer(read_only=True)
    transaction = TransactionSerializer(read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "reviewer",
            "reviewed_profile",
            "transaction",
            "rating",
            "comment",
            "created_at",
        ]

    # When a user tries to submit a review by making a POST request to /api/reviews/, the ReviewSerializer automatically runs its validate method before attempting to create the review.
    def validate(self, data):
        """
        Custom validation to ensure a user can leave a review for this transaction.
        """
        transaction = data.get("transaction")
        request = self.context["request"]
        reviewer_profile = request.user.profile

        # 1. Check if the transaction is completed
        if transaction.status != "completed":
            raise serializers.ValidationError(
                "You can only review completed transactions."
            )

        # 2. Check if the reviewer was part of the transaction
        seller_profile = transaction.listing.owner
        buyer_profile = transaction.buyer.profile
        if reviewer_profile != seller_profile and reviewer_profile != buyer_profile:
            raise serializers.ValidationError(
                "You were not a participant in this transaction."
            )

        # 3. Check if the user has already reviewed this transaction
        if Review.objects.filter(
            transaction=transaction, reviewer=reviewer_profile
        ).exists():
            raise serializers.ValidationError(
                "You have already reviewed this transaction."
            )

        return data