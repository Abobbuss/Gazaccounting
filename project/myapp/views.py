import json
from rest_framework import generics
from . import models
from . import serializers
from rest_framework.response import Response
from . import utils
from io import BytesIO
from django.shortcuts import render, get_object_or_404
from django.db.models import Q
import re
from rest_framework import status
from django.http import JsonResponse, FileResponse


#html
def index(request):
    return render(request, 'index.html')

def record(request):
    return render(request, 'record.html')

def record_detail(request, pk):
    record = get_object_or_404(models.Ownership, id=pk)
    context = {'record': record}
    return render(request, 'details.html', context)

# Person
class PersonCreateView(generics.CreateAPIView):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

    def create(self, request, *args, **kwargs):
        city_value = request.data.get('city')
        last_name = request.data.get('last_name')
        first_name = request.data.get('first_name')
        middle_name = request.data.get('middle_name')

        city_id = utils.check_existing_city(city=city_value)

        if not city_id:
            message = 'Город не найден'
            return Response({'error': message})

        request.data['city'] = city_id

        if utils.check_person_existing(last_name, first_name, middle_name, city_id):
            message = 'Человек с такими данными существует'
            return Response({'error': message})

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer.save()

        message = "Человек добавлен"
        return Response({'response_data': message})

class PersonListView(generics.ListAPIView):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

class PersonDetailView(generics.RetrieveAPIView):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

class PersonSearchView(generics.ListAPIView):
    serializer_class = serializers.PersonSerializer

    def get_queryset(self):
        search_query = self.kwargs.get('search_query', '').strip()
        
        if not search_query:
            return models.Person.objects.all()

        return utils.search_persons(search_query)
    
# Item
class ItemCreateView(generics.CreateAPIView):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        brand = request.data.get('brand')

        existing_item = models.Item.objects.filter(name=name, brand=brand).first()

        if existing_item:
            message = 'Такая вещь уже существует'
            return Response({'error': message})

        response = super().create(request, *args, **kwargs)

        message =  'Успешно добавлено'
        return Response({'response_data': message}, status=response.status_code)

class ItemListView(generics.ListAPIView):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer

class ItemDetailView(generics.RetrieveAPIView):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer

class ItemSearchView(generics.ListAPIView):
    serializer_class = serializers.ItemSerializer

    def get_queryset(self):
        search_query = self.kwargs.get('search_query', '').strip()

        if not search_query:
            return models.Item.objects.all()

        return utils.search_items(search_query)

# City
class CityListView(generics.ListAPIView):
    queryset = models.City.objects.all()
    serializer_class = serializers.CitySerializer

class CitySearchView(generics.ListAPIView):
    serializer_class = serializers.CitySerializer

    def get_queryset(self):
        search_query = self.kwargs.get('search_query', '').strip()

        if not search_query:
            return models.Item.objects.all()

        return utils.search_city(search_query)

# Ownership
class OwnershipListView(generics.ListAPIView):
    queryset = models.Ownership.objects.all()
    serializer_class = serializers.OwnershipSerializer

class OwnerShipCreateView(generics.CreateAPIView):
    queryset = models.Ownership.objects.all()
    serializer_class = serializers.OwnershipSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        owner_name = data['owner']['name']
        item_name = data['item']['name']
        serial_number = data['serial_number']
        quantity = int(data['quantity'])
        download_qr = data['downloadQR']
        download_doc = data['downloadDOC']

        if data is None:
            message = "Данные не получены"
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
        
        full_name, city = owner_name.split('-') 
        name_parts = full_name.split()

        if len(name_parts) == 2:
            last_name, first_name  = name_parts
            middle_name = None
        elif len(name_parts) == 3:
            last_name, first_name, middle_name = name_parts
        else:
            message = "Некорректный формат ФИО"
            return Response({'error': message})

        city_id = utils.check_existing_city(city)
        owner_id = utils.check_person_existing(last_name, first_name, middle_name, city_id)

        if not owner_id:
            message = "Человек не найден"
            return Response({"error": message})

        item = item_name.split('(')
        if len(item) > 1:
            name = item[0].strip()
            brand = item[1].rstrip(')').strip()
        else:
            name = item_name.strip()
            brand = None

        item_id = utils.check_existing_item(name, brand)
        if not item_id:
            message = "Вещь не найдена"
            return Response({"error": message })

        request.data['owner'] = owner_id
        request.data['item'] = item_id

        records = []
        for _ in range(quantity):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            records.append(serializer.save())

        for created_record in records:
            qr_data = utils.generate_qr_code(created_record.id)
            if qr_data is None:
                message = "Не удалось создать QR-код"
                return Response({"error": message })

            created_record.qr_code.save(f'qr_code_{created_record.id}.png', BytesIO(qr_data), save=True)

        if download_qr:
            qr_file_path = created_record.qr_code.path
            return FileResponse(open(qr_file_path, 'rb'), content_type='image/png', as_attachment=True)
        
        if download_doc:
            # doc = utils.create_document(owner_name=owner_name, item_name=item_name, serial_number=serial_number, date=created_record.added_date)
            # return FileResponse(doc, as_attachment=True, filename='document.docx')
            return Response({"message": "Запись создана успешно"})

        return Response({"message": "Запись создана успешно"})

class OwnerShipDetailView(generics.RetrieveAPIView):
    queryset = models.Ownership.objects.all()
    serializer_class = serializers.OwnershipSerializer

class OwnerShipRecordView(generics.RetrieveAPIView):
    queryset = models.Ownership.objects.all()
    serializer_class = serializers.OwnershipSerializer

    def get(self, request):
        person_id = request.query_params.get('person_id', None)
        item_id = request.query_params.get('item_id', None)
        added_date = request.query_params.get('added_date', None)
        city_name = request.query_params.get('city_name', None)

        queryset = utils.filter_ownership_data(person_id, item_id, added_date, city_name)

        serializer = serializers.OwnershipSerializer(queryset, many=True)
        return Response(serializer.data)
    
class OwnerShipRecordCountView(generics.RetrieveAPIView):
    queryset = models.Ownership.objects.all()
    serializer_class = serializers.OwnershipSerializer

    def get(self, request):
        city_name = request.query_params.get('city_name', None)
        item_id = request.query_params.get('item_id', None)

        if city_name or item_id:
            queryset = utils.count_items_by_city(city_name, item_id)
        else:
            queryset = utils.count_items_by_city()

        return Response(queryset)