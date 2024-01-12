import qrcode
from . import models
from io import BytesIO
from django.shortcuts import get_object_or_404
from docx import Document
from docx.shared import Pt
from django.db.models import Q
from django.db.models import Count
import re


#Persons
def check_existing_person(last_name, first_name, middle_name, city_id):
    try:
        person = models.Person.objects.get(
            first_name=first_name,
            last_name=last_name, 
            middle_name=middle_name,  
            city=city_id
        )
        return person.id
    except models.Person.DoesNotExist:
        return None

def search_persons(search_query):
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

#City
def search_city(search_query):
    queryset = models.City.objects.filter(
        Q(name__icontains=search_query)
    )

    return queryset

def check_existing_city(city_name):
    try:
        city = models.City.objects.get(name=city_name)
        return city.id
    except models.City.DoesNotExist:
        return None

#Item
def search_items(search_query):
    queryset = models.Item.objects.filter(
        Q(name__icontains=search_query) | Q(brand__icontains=search_query)
    )

    return queryset

def check_existing_item(name, brand):
    try:
        item = models.Item.objects.get(name=name, brand=brand)
        return item.id
    except models.Item.DoesNotExist:
        return None

#Departmens
def check_existing_department(department_name, city_id):
    try:
        department = models.Department.objects.get(name=department_name, city=city_id)
        return department.id
    except models.Department.DoesNotExist:
        return None

def generate_qr_code(ownership_id):
    url = f"http://192.168.11.129:8000/record_detail/{ownership_id}/"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    img_byte_array = BytesIO()
    img.save(img_byte_array)
    img_bytes = img_byte_array.getvalue()

    return img_bytes

def filter_ownership_data(person_id, item_id, added_date, serial_number):
    filters = Q()

    if person_id:
        filters &= Q(owner__id=person_id)

    if item_id:
        filters &= Q(item__id=item_id)

    if added_date:
        filters &= Q(added_date=added_date)

    queryset = models.Ownership.objects.filter(filters).order_by('owner__last_name', 'item__name', 'added_date')

    return queryset


def count_items_by_city(city_name=None, item_id=None):
    filters = Q()

    if city_name:
        filters &= Q(owner__city__name=city_name)

    if item_id:
        filters &= Q(item__id=item_id)

    queryset = models.Ownership.objects.filter(filters).values('owner__city__name', 'item__name', 'item__brand').annotate(item_count=Count('item')).order_by('owner__city__name', 'item__name', 'item__brand')

    return queryset