from rest_framework import viewsets, permissions, serializers

from api.models import Review
from api.serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    # queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(reviewed_profile=self.request.user.profile)

    def perform_create(self, serializer):
        # The reviewer is the currently authenticated user's profile
        reviewer_profile = self.request.user.profile
        # The transaction is passed in the request data
        transaction = serializer.validated_data["transaction"]

        # Determine the reviewed_profile based on who the reviewer is in the transaction
        if reviewer_profile == transaction.buyer:
            # If the reviewer is the buyer, they are reviewing the seller
            reviewed_profile = transaction.listing.owner
        elif reviewer_profile == transaction.listing.owner:
            # If the reviewer is the seller, they are reviewing the buyer
            reviewed_profile = transaction.buyer
        else:
            # This case should ideally be caught by validation, but as a fallback
            raise serializers.ValidationError(
                "You are not a participant in this transaction."
            )

        serializer.save(reviewer=reviewer_profile, reviewed_profile=reviewed_profile)
