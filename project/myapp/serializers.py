from rest_framework import serializers
from . import models

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Item
        fields = '__all__'

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.City
        fields = ('name',)

class PersonSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='city.name', read_only=True)    

    class Meta:
        model = models.Person
        fields = '__all__'
    
    def to_representation(self, instance):
        return {
            'first_name': instance.first_name,
            'last_name': instance.last_name,
            'middle_name': instance.middle_name,
            'city': instance.city.name
        }

class OwnershipSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Ownership
        fields = '__all__'

    def to_representation(self, instance):
        return {
            'name': instance.owner.first_name,
            'last_name': instance.owner.last_name,
            'middle_name': instance.owner.middle_name,
            'item': instance.item.name,
            'brand': instance.item.brand if instance.item.brand else None,
            'serial_number': instance.serial_number,
            'added_date': instance.added_date
        }