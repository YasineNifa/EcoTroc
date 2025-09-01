from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from api.models import ListingImage


class ListingImageViewSet(viewsets.ModelViewSet):
    queryset = ListingImage.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.listing.owner != request.user.profile:
            return Response(
                {"detail": "You do not have permission to delete this image."},
                status=status.HTTP_403_FORBIDDEN,
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
