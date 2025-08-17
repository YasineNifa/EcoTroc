from rest_framework import serializers

from api.models import Listing
from api.serializers.profile import ProfileSerializer


class ListingSerializer(serializers.ModelSerializer):
    """
    Serializer for the Listing model. Includes computed fields and
    human-readable representations for choice fields.
    """
    owner = ProfileSerializer(read_only=True)

    # Use SerializerMethodField to add custom data to the serialized output.
    # This calls the 'get_number_of_likes' method below.
    number_of_likes = serializers.SerializerMethodField()
    
    # Use `source='get_..._display'` to get the human-readable value
    # from a 'choices' field on the model.
    # For example, it will show "New with tag" instead of "new_with_tag".
    condition_display = serializers.CharField(source='get_condition_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id',
            'title',
            'description',
            'token_value',
            'owner',
            'brand',
            'size',
            'condition',
            'condition_display',
            'category',
            'category_display',
            'status',
            'status_display',
            'image',
            'number_of_likes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'number_of_likes', 'created_at', 'updated_at']

    def get_number_of_likes(self, obj):
        """
        Computes the number of likes for a listing.
        'obj' is the Listing instance.
        """
        return obj.likes.count()

    # def create(self, validated_data):
    #     """
    #     Custom create method to automatically assign the owner
    #     when a new listing is created.
    #     """
    #     # The owner is not part of the validated_data, so we get it from the request context.
    #     # This requires you to pass the request object to the serializer in your view.
    #     # Example in view: serializer = ListingSerializer(data=request.data, context={'request': request.user})
    #     # C'est utile dans le cas où on utilise pas les ViewSets
    #     request = self.context.get('request')
    #     if request and hasattr(request, "user"):
    #         validated_data['owner'] = request.user.profile
        
    #     return super().create(validated_data)


# class ListingSerializer(serializers.ModelSerializer):
#     owner = ProfileSerializer(read_only=True)

#     class Meta:
#         model = Listing
#         fields = [
#             "id",
#             "title",
#             "description",
#             "jeton_value",
#             "owner",
#             "status",
#             "created_at",
#             "updated_at",
#             "image",
#         ]
#         read_only_fields = ["id", "created_at", "updated_at", "owner"]