import django_filters

from django.db.models import Case, When, Value, CharField

from api.models import Brand

class BrandFilter(django_filters.FilterSet):
    name_search = django_filters.CharFilter(method='filter_by_relevance', label="Search by brand name with relevance")

    class Meta:
        model = Brand
        fields = ['name_search']

    def filter_by_relevance(self, queryset, name, value):
        """
        Filters the queryset by name__icontains and then orders the results
        by relevance to the search query 'value'.
        """
        if not value:
            return queryset

        filtered_queryset = queryset.filter(name__icontains=value)
        return filtered_queryset.annotate(
            relevance=Case(
                When(name__iexact=value, then=Value(1)),
                When(name__istartswith=value, then=Value(2)),
                default=Value(3),
                output_field=CharField()
            )
        ).order_by('relevance', 'name')