from rest_framework import serializers

from api.models import Brand


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = "__all__"
        read_only_fields = ["id", "slug"]



class BrandRelatedField(serializers.RelatedField):
    """
    A custom field to handle creating a Brand from a name string
    or retrieving it from an existing ID.
    """
    def to_internal_value(self, data):
        # This method is called when data is coming IN to the API (e.g., from a POST/PUT request)
        # It converts the raw data into a model instance.        
        if isinstance(data, str) and data.isdigit():
            try:
                return Brand.objects.get(pk=int(data))
            except Brand.DoesNotExist:
                raise serializers.ValidationError("Brand with this ID does not exist.")
        
        elif isinstance(data, str):
            normalized_name = data.strip().title()
            brand, _ = Brand.objects.get_or_create(name__iexact=data, defaults={'name': normalized_name})
            return brand
        
        elif isinstance(data, int):
            try:
                return Brand.objects.get(pk=data)
            except Brand.DoesNotExist:
                raise serializers.ValidationError("Brand with this ID does not exist.")
        
        raise serializers.ValidationError("Invalid input for brand. Expected an ID or a name string.")

    def to_representation(self, value):
        # This method is called for data going OUT of the API (in a response)
        # It converts the model instance into a simple representation.
        return value.name