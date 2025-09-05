from rest_framework import serializers

from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    # By redeclaring the username field, we prevent the DRF to execute the default unicity validator for the username. 
    # Our personalized method "validate_username" will be executed
    username = serializers.CharField(max_length=150)
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]

    def validate_username(self, value):
        user_instance = None
        view = self.context.get('view')
        if view and hasattr(view, 'get_object'):
            user_instance = view.get_object().user

        if not user_instance:
            if User.objects.filter(username=value).exists():
                raise serializers.ValidationError("A user with the same username exists.")
            return value

        if User.objects.exclude(pk=user_instance.pk).filter(username=value).exists():
            raise serializers.ValidationError("A user with the same username exists.")
        
        return value
