from rest_framework import serializers

from api.models.brand import Brand
from api.models.category import Category
from api.models.listing import Listing
from api.serializers.brand import BrandRelatedField
from api.serializers.listing_image import ListingImageSerializer
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
    is_liked = serializers.SerializerMethodField()

    # Use `source='get_..._display'` to get the human-readable value
    # from a 'choices' field on the model.
    # For example, it will show "New with tag" instead of "new_with_tag".
    condition_display = serializers.CharField(
        source="get_condition_display", read_only=True
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        allow_null=True,
    )
    category_display = serializers.CharField(source="category.name", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
    )
    brand = BrandRelatedField(
        queryset=Brand.objects.all(), allow_null=True, required=False
    )
    # brand_id = serializers.PrimaryKeyRelatedField(
    #     queryset=Brand.objects.all(), source='brand', write_only=True, allow_null=True
    # )
    # brand = BrandSerializer(read_only=True)

    class Meta:
        model = Listing
        fields = [
            "id",
            "title",
            "description",
            "token_value",
            "owner",
            "brand",
            "size",
            "condition",
            "condition_display",
            "category_display",
            "category_id",
            "status_display",
            "status",
            "number_of_likes",
            "created_at",
            "updated_at",
            "is_liked",
            "location",
            "latitude",
            "longitude",
            "images",
            "uploaded_images",
        ]
        read_only_fields = [
            "id",
            "owner",
            "number_of_likes",
            "created_at",
            "updated_at",
            "is_liked",
        ]

    def get_number_of_likes(self, obj):
        """
        Computes the number of likes for a listing.
        """
        return obj.likes.count()

    def get_is_liked(self, obj):
        """
        Checks if the user making the request has liked the listing.
        """
        # The request object is passed from the view's context.
        request = self.context.get("request")
        if request is None or not request.user.is_authenticated:
            return False

        return obj.likes.filter(user=request.user).exists()

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
