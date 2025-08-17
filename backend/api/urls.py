from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from api.views import (
    CategoryViewSet,
    ListingViewSet,
    ProfileView,
    TransactionViewSet,
    ReviewViewSet,
    ConversationViewSet,
    MessageViewSet,
    ProfileViewSet,
    ListingUserView,
)


router = DefaultRouter()
router.register(r"listings", ListingViewSet, basename="listings")
router.register(r"transactions", TransactionViewSet, basename="transactions")
router.register(r"reviews", ReviewViewSet, basename="reviews")
router.register(r"profiles", ProfileViewSet, basename="profiles")
router.register(r"conversations", ConversationViewSet, basename="conversations")
router.register(r"categories", CategoryViewSet, basename="categories")


conversations_router = routers.NestedSimpleRouter(
    router, r"conversations", lookup="conversation"
)
conversations_router.register(
    r"messages", MessageViewSet, basename="conversation-messages"
)


urlpatterns = [
    path("profile/me/", ProfileView.as_view(), name="profile-me"),
    path("", include(router.urls)),
    # The nested router handles URLs like /api/conversations/{conversation_pk}/messages/
    path("", include(conversations_router.urls)),
    path("mylistings/", ListingUserView.as_view(), name="my-listings"),
]
# urlpatterns += router.urls
