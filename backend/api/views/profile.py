from rest_framework import generics, permissions, viewsets

from api.models import Profile
from api.serializers import ProfileSerializer


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