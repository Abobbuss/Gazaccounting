from rest_framework import generics
from . import models
from . import serializers

#Person
class PersonCreateView(generics.CreateAPIView):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

class PersonListView(generics.ListAPIView):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

class PersonDetailView(generics.RetrieveAPIView):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

#Item
class ItemCreateView(generics.CreateAPIView):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer

class ItemListView(generics.ListAPIView):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer

class ItemDetailView(generics.RetrieveAPIView):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer

#City
class CityListView(generics.ListAPIView):
    queryset = models.City.objects.all()
    serializer_class = serializers.CitySerializer