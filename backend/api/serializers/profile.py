from rest_framework import serializers

from api.models import Profile
from api.serializers.user import UserSerializer


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    country = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "bio",
            "jeton_balance",
            "image",
            "locked_jetons",
            "country",
            "city",
            "show_city_in_profile",
            "phone_number",
            "email_verified",
            "created_at",
            "updated_at",
            "last_login_at",
        ]
        # Ignore the validation process for the read_only_fields
        read_only_fields = [
            "id",
            "jeton_balance",
            "locked_jetons",
            "email_verified",
            "created_at",
            "updated_at",
            "last_login_at",
        ]
        extra_kwargs = {"image": {"required": False}}  # "allow_null": True

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        user = instance.user

        user.username = user_data.get("username", user.username)
        user.email = user_data.get("email", user.email)
        user.first_name = user_data.get("first_name", user.first_name)
        user.last_name = user_data.get("last_name", user.last_name)
        user.save()

        instance.bio = validated_data.get("bio", instance.bio)
        if "image" in validated_data:
            instance.image = validated_data["image"]

        instance.country = validated_data.get("country", instance.country)
        instance.city = validated_data.get("city", instance.city)
        instance.show_city_in_profile = validated_data.get(
            "show_city_in_profile", instance.show_city_in_profile
        )
        instance.phone_number = validated_data.get(
            "phone_number", instance.phone_number
        )

        instance.save()
        return instance
