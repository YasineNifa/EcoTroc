from django_filters import rest_framework as filters

from django.db.models import Q

from api.models import Listing


class ListingFilter(filters.FilterSet):
    liked_by_user = filters.BooleanFilter(method="filter_liked_by_user", label="Liked by User")
    search = filters.CharFilter(method="filter_search", label="Search")

    class Meta:
        model = Listing
        fields = ["category", "brand", "liked_by_user", "owner", "status"]

    def filter_liked_by_user(self, queryset, name, value):
        """
        Custom filter method.
        - 'queryset' is the initial queryset.
        - 'name' is the name of the filter field ('liked_by_user').
        - 'value' is the value from the URL query (True or False).
        """
        user = self.request.user
        if user.is_authenticated and value:
            return queryset.filter(likes=user.profile)

        return queryset
    
    def filter_search(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(title__icontains=value) | Q(description__icontains=value) | Q(brand__name__icontains=value)
            )

        return queryset