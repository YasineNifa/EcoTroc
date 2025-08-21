from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response


from api.models.notification import Notification
from api.serializers.notification import NotificationSerializer # You'll need to create this serializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.profile.notifications.all()

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response(status=status.HTTP_204_NO_CONTENT)