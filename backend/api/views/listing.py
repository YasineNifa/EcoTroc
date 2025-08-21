from django.db import transaction as db_transaction
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response

from api.filters.listing import ListingFilter
from api.models import Listing, Transaction, Conversation, Message, Proposition
from api.serializers import ListingSerializer, TransactionSerializer, ConversationSerializer, PropositionSerializer


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
    filter_backends = [DjangoFilterBackend]
    filterset_class = ListingFilter

    

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
    
    @action(detail=True, methods=["post"])
    def toggle_like(self, request, pk=None):
        listing = self.get_object()
        user_profile = request.user.profile
        if user_profile == listing.owner:
            Response({"detail": "You cannot like your own listing."}, status=status.HTTP_400_BAD_REQUEST)

        if user_profile in listing.likes.all():
            listing.likes.remove(user_profile)
            liked = False
            status_message = "Listing unliked successfully."
        else:
            listing.likes.add(user_profile)
            liked = True
            status_message = "Listing liked successfully."
        
        return Response(
            {
                "status": status_message,
                "liked": liked,
                "likes_count": listing.number_of_likes()
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=["get"])
    def liked(self, request):
        liked_listings = self.get_queryset().filter(likes=request.user.profile)
        serializer = self.get_serializer(liked_listings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=["post"])
    def make_offer(self, request, pk=None):
        listing = self.get_object()
        user_profile = request.user.profile
        offer_amount = request.data.get("offer_amount")
        print(request.data)

        if user_profile == listing.owner:
            return Response({"detail": "You cannot make an offer on your own listing."}, status=status.HTTP_400_BAD_REQUEST)
        
        if offer_amount <= 0:
            return Response({"detail": "Offer amount must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)
        
        if user_profile.jeton_balance < offer_amount:
            return Response({"detail": "Insufficient jeton balance."}, status=status.HTTP_400_BAD_REQUEST)
        
        if listing.status != Listing.Status.AVAILABLE:
            return Response({"detail": "This listing is not available for offers."}, status=status.HTTP_400_BAD_REQUEST)

        conversation = (
            Conversation.objects.filter(listing=listing, participants=listing.owner)
            .filter(participants=user_profile)
            .first()
        )
        if not conversation:
            conversation = Conversation.objects.create(listing=listing)
            conversation.participants.add(user_profile, listing.owner)

        message_content = f"{user_profile.user.username} has made an offer of {offer_amount} tokens for your item '{listing.title}'."

        proposition = Proposition.objects.create(
            listing=listing,
            buyer=user_profile,
            amount=offer_amount,
            status=Proposition.Status.PENDING
        )
        Message.objects.create(
            conversation=conversation,
            sender=user_profile,
            content=message_content,
            message_type=Message.MessageType.OFFER,
            proposition=proposition
        )

        return Response(
            {"detail": "Offer sent successfully.", "conversation_id": conversation.id},
            status=status.HTTP_200_OK,
        )
    
    @action(detail=True, methods=['get'])
    def last_accepted_proposition(self, request, pk=None):
        """
        Returns the last accepted proposition for this listing,
        if the current user was a participant.
        """
        listing = self.get_object()
        user_profile = request.user.profile

        proposition = Proposition.objects.filter(
            Q(buyer=user_profile) | Q(listing__owner=user_profile),
            listing=listing,
            status=Proposition.Status.ACCEPTED
        ).order_by('-created_at').first()

        if proposition:
            serializer = PropositionSerializer(proposition)
            return Response(serializer.data)
        else:
            return Response({"detail": "No accepted proposition found."}, status=status.HTTP_404_NOT_FOUND)
