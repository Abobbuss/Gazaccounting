from rest_framework import generics
from . import models
from . import serializers
from rest_framework.response import Response
from . import utils
from io import BytesIO
from django.shortcuts import render
from django.db.models import Q
import re
from rest_framework import status


#index
def index(request):
    return render(request, 'index.html')

# Person
class PersonCreateView(generics.CreateAPIView):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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

        # Фильтр для поиска по Фамилии
        if search_terms:
            q_filter |= Q(last_name__icontains=search_terms[0])

        # Фильтр для поиска по Имени
        if len(search_terms) > 1:
            q_filter |= Q(first_name__icontains=search_terms[1])

        # Фильтр для поиска по Отчеству
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
