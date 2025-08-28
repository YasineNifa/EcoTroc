from rest_framework import serializers

from api.models import Profile
from api.serializers.user import UserSerializer


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "user", "bio", "jeton_balance", "image", "locked_jetons"]
        read_only_fields = ["id", "user", "jeton_balance", "locked_jetons"]
