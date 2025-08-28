from django.db import transaction as db_transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import Listing, Transaction, Proposition
from api.serializers import TransactionSerializer


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

            # 1. Find the last accepted proposition for this buyer and listing
            accepted_proposition = (
                Proposition.objects.filter(
                    listing=listing,
                    buyer=buyer_profile,
                    status=Proposition.Status.ACCEPTED,
                )
                .order_by("-created_at")
                .first()
            )

            # 2. Determine the final transaction amount
            if accepted_proposition:
                transaction_amount = accepted_proposition.amount
            else:
                transaction_amount = listing.token_value

            # Utiliser une transaction atomique pour la sécurité du transfert
            with db_transaction.atomic():
                buyer_profile.locked_jetons -= transaction_amount
                seller_profile.jeton_balance += transaction_amount

                listing.status = Listing.Status.COMPLETED
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
