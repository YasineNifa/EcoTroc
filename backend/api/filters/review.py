import django_filters

from api.models import Review


class ReviewFilter(django_filters.FilterSet):
    class Meta:
        model = Review
        fields = {
            "reviewed_profile": ["exact"],
        }
