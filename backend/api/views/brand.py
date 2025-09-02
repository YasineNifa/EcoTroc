from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions

from api.filters import BrandFilter
from api.models import Brand
from api.serializers import BrandSerializer


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = BrandFilter
    pagination_class = None
