from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.views import ListingViewSet, ProfileView, TransactionViewSet, ReviewViewSet


router = DefaultRouter()
router.register(r"listings", ListingViewSet, basename="listings")
router.register(r"transactions", TransactionViewSet, basename="transactions")
router.register(r"reviews", ReviewViewSet, basename="reviews")


urlpatterns = [
    path("profile/me/", ProfileView.as_view(), name="profile-me"),
]
urlpatterns += router.urls
