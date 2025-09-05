from django_countries import countries

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

class CountryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):        
        country_list = [{"code": code, "name": name} for code, name in list(countries)]
        return Response(country_list)
