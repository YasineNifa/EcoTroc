from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

from api.filters import PropositionFilter
from api.models import Proposition, Message, Conversation
from api.serializers import PropositionSerializer


class PropositionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing and managing offers (Propositions).
    Users can list offers they've made or received.
    Sellers can accept or reject offers.
    """
    queryset = Proposition.objects.all()
    serializer_class = PropositionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = PropositionFilter

    def get_queryset(self):
        """
        This view should only return propositions relevant to the current user,
        either as the buyer or the seller.
        """
        user_profile = self.request.user.profile
        return self.queryset.filter(
            Q(buyer=user_profile) | Q(listing__owner=user_profile)
        ).distinct()

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        proposition = self.get_object()
        user_profile = request.user.profile

        # Check if the user is the owner of the listing
        if proposition.listing.owner != user_profile:
            return Response({"detail": "You are not authorized to accept this offer."}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if the offer is still pending
        if proposition.status != Proposition.Status.PENDING:
            return Response({"detail": "This offer is no longer pending."}, status=status.HTTP_400_BAD_REQUEST)

        # TODO: Add logic for transaction (e.g., deducting tokens, changing listing status)
        
        proposition.status = Proposition.Status.ACCEPTED
        proposition.save()
        
        # Notify the buyer
        # Message.objects.create(...)        # Create a message to the buyer about the accepted offer
        conversation = (
            Conversation.objects.filter(listing=proposition.listing, participants=proposition.listing.owner)
            .filter(participants=user_profile)
            .first()
        )
        if not conversation:
            conversation = Conversation.objects.create(listing=proposition.listing)
            conversation.participants.add(user_profile, proposition.listing.owner)
        Message.objects.create(
            conversation=conversation,
            sender=user_profile,
            content=f"Your offer of {proposition.amount} tokens for '{proposition.listing.title}' has been ACCEPTED!",
        )


        return Response({"status": "Offer accepted"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        proposition = self.get_object()
        user_profile = request.user.profile

        # Check if the user is the owner of the listing
        if proposition.listing.owner != user_profile:
            return Response({"detail": "You are not authorized to reject this offer."}, status=status.HTTP_403_FORBIDDEN)

        proposition.status = Proposition.Status.REJECTED
        proposition.save()

        conversation = (
            Conversation.objects.filter(listing=proposition.listing, participants=proposition.listing.owner)
            .filter(participants=user_profile)
            .first()
        )
        if not conversation:
            conversation = Conversation.objects.create(listing=proposition.listing)
            conversation.participants.add(user_profile, proposition.listing.owner)
        Message.objects.create(
            conversation=conversation,
            sender=user_profile,
            content=f"Your offer of {proposition.amount} tokens for '{proposition.listing.title}' has been REJECTED!",
        )

        return Response({"status": "Offer rejected"}, status=status.HTTP_200_OK)