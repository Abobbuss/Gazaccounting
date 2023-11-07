from rest_framework import serializers
from . import models

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Item
        fields = '__all__'

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.City
        fields = 'name'

class PersonSerializer(serializers.ModelSerializer):    
    city = serializers.StringRelatedField()

    class Meta:
        model = models.Person
        fields = '__all__'
