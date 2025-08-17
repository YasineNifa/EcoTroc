from rest_framework import serializers
from django.contrib.auth.models import User


from api.models import Profile, Listing, Transaction, Conversation, Message, Review


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "user", "bio", "jeton_balance", "image", "locked_jetons"]
        read_only_fields = ["id", "user", "jeton_balance", "locked_jetons"]


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



class TransactionSerializer(serializers.ModelSerializer):
    buyer = ProfileSerializer(read_only=True)
    listing = ListingSerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = ["id", "buyer", "listing", "transaction_date", "status"]
        read_only_fields = ["id", "transaction_date", "buyer", "listing"]


class MessageSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "content", "timestamp", "conversation"]
        read_only_fields = ["id", "sender", "timestamp", "conversation"]


class ConversationSerializer(serializers.ModelSerializer):
    participants = ProfileSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    listing = ListingSerializer(read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "listing", "participants", "messages", "created_at"]
        # fields = ['id', 'listing', 'participants', 'messages']
        read_only_fields = ["id", "created_at", "listing", "participants", "messages"]


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = ProfileSerializer(read_only=True)
    reviewed_profile = ProfileSerializer(read_only=True)
    transaction = TransactionSerializer(read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "reviewer",
            "reviewed_profile",
            "transaction",
            "rating",
            "comment",
            "created_at",
        ]

    # When a user tries to submit a review by making a POST request to /api/reviews/, the ReviewSerializer automatically runs its validate method before attempting to create the review.
    def validate(self, data):
        """
        Custom validation to ensure a user can leave a review for this transaction.
        """
        transaction = data.get("transaction")
        request = self.context["request"]
        reviewer_profile = request.user.profile

        # 1. Check if the transaction is completed
        if transaction.status != "completed":
            raise serializers.ValidationError(
                "You can only review completed transactions."
            )

        # 2. Check if the reviewer was part of the transaction
        seller_profile = transaction.listing.owner
        buyer_profile = transaction.buyer.profile
        if reviewer_profile != seller_profile and reviewer_profile != buyer_profile:
            raise serializers.ValidationError(
                "You were not a participant in this transaction."
            )

        # 3. Check if the user has already reviewed this transaction
        if Review.objects.filter(
            transaction=transaction, reviewer=reviewer_profile
        ).exists():
            raise serializers.ValidationError(
                "You have already reviewed this transaction."
            )

        return data
