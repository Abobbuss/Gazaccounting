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
        city_value = request.data.get('city', None)
        last_name = request.data.get('last_name', None)
        first_name = request.data.get('first_name', None)
        middle_name = request.data.get('middle_name', None)

        existing_person_query = models.Person.objects.filter(
            last_name=last_name,
            first_name=first_name,
            middle_name=middle_name
        )

        if isinstance(city_value, str):
            existing_person_query = existing_person_query.filter(city__name=city_value)

        existing_person = existing_person_query.first()

        if existing_person:
            return Response({'error': 'Человек с такими данными существует'})
        
        if isinstance(city_value, str):
            try:
                request.data['city'] = utils.check_existing_city(city=city_value)
            except models.City.DoesNotExist:
                return Response({'error': 'City not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        result = super().create(request, *args, **kwargs)
        return result

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

        search_terms = re.split(r'\s+', search_query)

        q_filter = Q()

        if search_terms:
            q_filter |= Q(last_name__icontains=search_terms[0])

        if len(search_terms) > 1:
            q_filter |= Q(first_name__icontains=search_terms[1])

        if len(search_terms) > 2:
            q_filter |= Q(middle_name__icontains=' '.join(search_terms[2:]))

        q_filter |= (
            Q(last_name__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(middle_name__icontains=search_query)
        )

        queryset = models.Person.objects.filter(q_filter)

        return queryset
    
# Item
class ItemCreateView(generics.CreateAPIView):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        brand = request.data.get('brand')

        existing_item = models.Item.objects.filter(name=name, brand=brand).first()

        if existing_item:
            response_data = {'message': 'Такая вещь уже существует'}
            return Response(response_data)

        response = super().create(request, *args, **kwargs)
        response_data = {
            'message': 'Успешно добавлено',
            'name': response.data.get('name'),
            'brand': response.data.get('brand')
        }
        return Response(response_data, status=response.status_code)

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

        queryset = models.Item.objects.filter(
            Q(name__icontains=search_query) | Q(brand__icontains=search_query)
        )

        return queryset

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
        data = request.data
        print(data)
        owner_name = data['owner']['name']
        item_name = data['item']['name']
        serial_number = data['serial_number']
        quantity = data['quantity']
        download_qr = data['downloadQR']
        download_doc = data['downloadDOC']
        if data is None:
            return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        owner_id = utils.check_existing_owner(owner_name)
        if not owner_id:
            return Response({"message": "Человек не найден"})

        item_id = utils.check_existing_item(item_name)
        if not item_id:
            return Response({"message": "Вещь не найдена"})

        request.data['owner'] = owner_id
        request.data['item'] = item_id

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        created_record = serializer.save()

        qr_data = utils.generate_qr_code(created_record.id)
        if qr_data is None:
            return Response({"message": "Не удалось создать qr"})

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
