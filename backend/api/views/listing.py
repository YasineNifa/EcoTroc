from django.db import transaction as db_transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import Listing, Transaction, Conversation
from api.serializers import ListingSerializer, TransactionSerializer, ConversationSerializer


class ListingUserView(generics.ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["owner"]

    def get_queryset(self):
        return Listing.objects.filter(owner=self.request.user.profile)
    


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.filter(status=Listing.Status.AVAILABLE)
    serializer_class = ListingSerializer
    permissions_class = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def reserve(self, request, pk=None):
        buyer = request.user.profile
        listing = self.get_object()
        if listing.owner == buyer:
            return Response(
                {"detail": "You cannot reserve your own listing."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if listing.status != Listing.Status.AVAILABLE:
            return Response(
                {"detail": "This listing is not available for reservation."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if buyer.jeton_balance < listing.jeton_value:
            return Response(
                {"detail": "Insufficient jetons balance."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with db_transaction.atomic():
            buyer.jeton_balance -= listing.jeton_value
            buyer.locked_jetons += listing.jeton_value
            buyer.save()
            listing.status = Listing.STATUS_RESERVED
            listing.save()
            transaction = Transaction.objects.create(buyer=buyer, listing=listing)

        # buyer.jeton_balance -= listing.jeton_value
        # buyer.save()

        # seller = listing.owner
        # seller.jeton_balance += listing.jeton_value
        # seller.save()

        # listing.status = Listing.STATUS_RESERVED
        # listing.save()
        # transaction = Transaction.objects.create(buyer=buyer, listing=listing)

        return Response(
            {
                "detail": "Reservation successful. Waiting for confirmation",
                "transaction": TransactionSerializer(transaction).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def contact_seller(self, request, pk=None):
        listing = self.get_object()
        seller = listing.owner
        buyer = request.user.profile

        if buyer == seller:
            return Response(
                {"detail": "You cannot contact yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        conversation = (
            Conversation.objects.filter(listing=listing, participants=seller)
            .filter(participants=buyer)
            .first()
        )
        if conversation:
            return Response(
                {
                    "detail": "Conversation already exists.",
                    "conversation": ConversationSerializer(conversation).data,
                },
                status=status.HTTP_200_OK,
            )

        conversation = Conversation.objects.create(listing=listing)
        conversation.participants.add(buyer, seller)
        # conversation.save() # The add() method updates the database relationship directly.

        return Response(
            {
                "detail": "Conversation started.",
                "conversation": ConversationSerializer(conversation).data,
            },
            status=status.HTTP_201_CREATED,
        )