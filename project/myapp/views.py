from rest_framework import generics
from . import models
from . import serializers
from rest_framework.response import Response
from . import utils
from io import BytesIO
from django.shortcuts import render


#index
def index(request):
    return render(request, 'index.html')

# Person
class PersonCreateView(generics.CreateAPIView):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

class PersonListView(generics.ListAPIView):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

class PersonDetailView(generics.RetrieveAPIView):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

# Item
class ItemCreateView(generics.CreateAPIView):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer

class ItemListView(generics.ListAPIView):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer

class ItemDetailView(generics.RetrieveAPIView):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer

# City
class CityListView(generics.ListAPIView):
    queryset = models.City.objects.all()
    serializer_class = serializers.CitySerializer

# Ownership
class OwnershipListView(generics.ListAPIView):
    queryset = models.Ownership.objects.all()
    serializer_class = serializers.OwnershipSerializer

class OwnerShipCreateView(generics.CreateAPIView):
    queryset = models.Ownership.objects.all()
    serializer_class = serializers.OwnershipSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if utils.check_existing_record(serializer):
            return Response({"message": "Эта запись уже существует"})

        created_record = serializer.save()

        qr_data = utils.generate_qr_code(created_record.id)
        if qr_data is None:
            return Response({"message": "Не удалось создать qr"})

        created_record.qr_code.save(f'qr_code_{created_record.id}.png', BytesIO(qr_data), save=True)

        return Response({"message": "Запись создана успешно"})
    
class OwnerShipDetailView(generics.RetrieveAPIView):
    queryset = models.Ownership.objects.all()
    serializer_class = serializers.OwnershipSerializer
