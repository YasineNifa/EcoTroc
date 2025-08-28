from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, serializers

from api.filters import ReviewFilter
from api.models import Review
from api.serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().select_related("reviewer", "reviewed_profile")
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = ReviewFilter
    filter_backends = [DjangoFilterBackend]


    def perform_create(self, serializer):
        reviewer_profile = self.request.user.profile
        transaction = serializer.validated_data["transaction"]
        if reviewer_profile == transaction.buyer:
            reviewed_profile = transaction.listing.owner
        elif reviewer_profile == transaction.listing.owner:
            reviewed_profile = transaction.buyer
        else:
            # This case should ideally be caught by validation, but as a fallback
            raise serializers.ValidationError(
                "You are not a participant in this transaction."
            )

        serializer.save(reviewer=reviewer_profile, reviewed_profile=reviewed_profile)
