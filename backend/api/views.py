from django.db import transaction as db_transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status, generics, serializers
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import Listing, Profile, Transaction, Message, Conversation, Review
from api.serializers import (
    ListingSerializer,
    ProfileSerializer,
    TransactionSerializer,
    MessageSerializer,
    ConversationSerializer,
    ReviewSerializer,
)


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


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permissions_class = [permissions.IsAuthenticated]

    def get_object(self):
        # Retourne le profil de l'utilisateur actuellement authentifié
        return self.request.user.profile


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(
            buyer=self.request.user.profile
        ) | Transaction.objects.filter(listing__owner=self.request.user.profile)

    # def get_queryset(self):
    #     """
    #     This method filters the transactions to return only those
    #     where the logged-in user is either the buyer or the seller.
    #     """
    #     user_profile = self.request.user.profile

    #     # Use Q objects to create an "OR" query
    #     return Transaction.objects.filter(
    #         Q(buyer=user_profile) | Q(listing__owner=user_profile)
    #     ).select_related('listing__owner__user', 'buyer__user').distinct().order_by('-created_at')

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        transaction = self.get_object()
        user = request.user

        # Vérifier que l'utilisateur fait bien partie de la transaction
        if (
            user.profile != transaction.buyer
            and user.profile != transaction.listing.owner
        ):
            return Response(
                {"detail": "You are not a part of this transaction."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Marquer la confirmation de l'utilisateur
        if user.profile == transaction.buyer:
            transaction.buyer_confirmed = True
        else:
            transaction.seller_confirmed = True

        transaction.save()

        # Si les DEUX ont confirmé, on finalise
        if transaction.buyer_confirmed and transaction.seller_confirmed:
            seller_profile = transaction.listing.owner
            buyer_profile = transaction.buyer
            listing = transaction.listing

            # Utiliser une transaction atomique pour la sécurité du transfert
            with db_transaction.atomic():
                # Already Done in the reservation
                # buyer_profile.jeton_balance -= listing.jeton_value
                # seller_profile.jeton_balance += listing.jeton_value
                buyer_profile.locked_jetons -= listing.jeton_value
                seller_profile.jeton_balance += listing.jeton_value

                listing.status = Listing.STATUS_COMPLETED
                transaction.status = Transaction.STATUS_COMPLETED

                buyer_profile.save()
                seller_profile.save()
                listing.save()
                transaction.save()

            return Response(
                {"detail": "The transaction has been completed."},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"detail": "Confirmation successful. Waiting for other confirmation."},
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def cancel(self, request, pk=None):
        transaction = self.get_object()
        user_profile = request.user.profile

        seller_profile = transaction.listing.owner
        buyer_profile = transaction.buyer

        if user_profile != seller_profile and user_profile != buyer_profile:
            return Response(
                {"detail": "You are not a part of this transaction."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if transaction.status != Transaction.STATUS_PENDING:
            return Response(
                {"detail": "Only pending transactions can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with db_transaction.atomic():
            buyer_profile.locked_jetons -= transaction.listing.jeton_value
            buyer_profile.jeton_balance += transaction.listing.jeton_value
            transaction.status = Transaction.STATUS_FAILED
            transaction.listing.status = Listing.Status.AVAILABLE
            transaction.save()
            transaction.listing.save()
            buyer_profile.save()

        return Response({"detail": "Transaction cancelled."}, status=status.HTTP_200_OK)

    # @action(detail=True, methods=["post"])
    # def confirm_reception(self, request, pk=None):
    #     transaction = self.get_object()
    #     if transaction.buyer != request.user.profile:
    #         return Response(
    #             {"detail": "You are not the buyer for this transaction."},
    #             status=status.HTTP_403_FORBIDDEN,
    #         )

    #     if transaction.status == Transaction.STATUS_COMPLETED:
    #         return Response(
    #             {"detail": "Transaction already completed."},
    #             status=status.HTTP_400_BAD_REQUEST,
    #         )

    #     transaction.buyer_confirmed = True
    #     transaction.save()

    #     if transaction.seller_confirmed:
    #         transaction.status = Transaction.STATUS_COMPLETED
    #         transaction.listing.status = Listing.STATUS_COMPLETED
    #         transaction.listing.save()
    #         transaction.save()

    #     return Response(
    #         {"detail": "Buyer confirmed reception."}, status=status.HTTP_200_OK
    #     )

    # @action(detail=True, methods=["post"])
    # def confirm_delivery(self, request, pk=None):
    #     transaction = self.get_object()
    #     if transaction.listing.owner != request.user.profile:
    #         return Response(
    #             {"detail": "You are not the seller for this transaction."},
    #             status=status.HTTP_403_FORBIDDEN,
    #         )

    #     if transaction.status == Transaction.STATUS_COMPLETED:
    #         return Response(
    #             {"detail": "Transaction already completed."},
    #             status=status.HTTP_400_BAD_REQUEST,
    #         )

    #     transaction.seller_confirmed = True
    #     transaction.save()

    #     if transaction.buyer_confirmed:
    #         transaction.status = Transaction.STATUS_COMPLETED
    #         transaction.listing.status = Listing.STATUS_COMPLETED
    #         transaction.listing.save()
    #         transaction.save()

    #     return Response(
    #         {"detail": "Seller confirmed delivery."}, status=status.HTTP_200_OK
    #     )


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_class = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user.profile)

    # def get_queryset(self):
    #     print("I am here : ", self.request.user)
    #     return self.request.user.profile.conversations.all()


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Message.objects.filter(conversation=self.kwargs["conversation_pk"])

    def perform_create(self, serializer):
        conversation_id = self.kwargs["conversation_pk"]
        try:
            conversation_instance = Conversation.objects.get(pk=conversation_id)
        except Conversation.DoesNotExist:
            raise serializers.ValidationError("Conversation not found.")

        serializer.save(
            sender=self.request.user.profile, conversation=conversation_instance
        )


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
