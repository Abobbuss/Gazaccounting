import qrcode
from . import models
from io import BytesIO
from django.shortcuts import get_object_or_404
from docx import Document
from docx.shared import Pt
from django.db.models import Q
from django.db.models import Count


def check_existing_owner(full_name_city):
    full_name, city = full_name_city.split('-') 
    
    name_parts = full_name.split()
    
    if len(name_parts) == 2:
        last_name, first_name  = name_parts
        middle_name = None
    elif len(name_parts) == 3:
        last_name, first_name, middle_name = name_parts
    else:
        raise ValueError("Некорректный формат ФИО")

    city_id = check_existing_city(city=city)

    try:
        person = models.Person.objects.get(
            first_name=first_name,
            last_name=last_name, 
            middle_name=middle_name,  
            city=city_id
        )
        return person.id
    except models.Person.DoesNotExist:
        message = "Человек не найден"
        return message

def check_existing_city(city):
    city_obj = get_object_or_404(models.City, name=city)
    return city_obj.id

def check_existing_item(item_name):
    parts = item_name.split('(')
    
    if len(parts) > 1:
        name = parts[0].strip()
        brand = parts[1].rstrip(')').strip()
    else:
        name = item_name.strip()
        brand = None

    try:
        # Ищем вещь по названию и бренду
        item = models.Item.objects.get(name=name, brand=brand)
        return item.id
    except models.Item.DoesNotExist:
        return None
    
def check_existing_record(serializer):
    owner_id = serializer.validated_data['owner']
    item_id = serializer.validated_data['item']
    serial_number = serializer.validated_data.get('serial_number', '')

    existing_record = models.Ownership.objects.filter(
        owner_id=owner_id,
        item_id=item_id,
        serial_number=serial_number,
    ).first()

    return existing_record is not None

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

    # Преобразование изображения в байты
    img_byte_array = BytesIO()
    img.save(img_byte_array)
    img_bytes = img_byte_array.getvalue()

    return img_bytes

def create_document(owner_name, item_name, serial_number, date):
    # Создаем новый документ
    doc = Document()

    # Добавляем заголовок
    title = doc.add_paragraph('Заявление')
    title.alignment = 1  # Выравнивание по центру

    # Добавляем информацию о вещи и владельце
    info = doc.add_paragraph(f'Выдается Вещь({item_name}) ({serial_number}) такому-то человеку({owner_name}).')

    # Добавляем дату
    date_paragraph = doc.add_paragraph(f'Дата: {date.strftime("%Y-%m-%d")}')
    
    # Добавляем место для подписи
    signature_line = doc.add_paragraph('_______________________')
    signature_line.alignment = 1  # Выравнивание по центру

    # Устанавливаем размер шрифта для всего документа
    for paragraph in doc.paragraphs:
        for run in paragraph.runs:
            font = run.font
            font.size = Pt(12)

    # Создаем объект BytesIO для хранения данных документа
    doc_buffer = BytesIO()
    doc.save(doc_buffer)
    doc_buffer.seek(0)

    return doc_buffer

def filter_ownership_data(person_id, item_id, added_date, city_name):
    # Формирование фильтрационных условий
    filters = Q()

    if person_id:
        filters &= Q(owner__id=person_id)

    if item_id:
        filters &= Q(item__id=item_id)

    if added_date:
        filters &= Q(added_date=added_date)

    if city_name:
        filters &= Q(owner__city__name=city_name)

    # Применение фильтрации и сортировки
    queryset = models.Ownership.objects.filter(filters).order_by('owner__last_name', 'item__name', 'added_date')

    return queryset


def count_items_by_city(city_name=None, item_id=None):
    filters = Q()

    if city_name:
        filters &= Q(owner__city__name=city_name)

    if item_id:
        filters &= Q(item__id=item_id)

    queryset = models.Ownership.objects.filter(filters).values('owner__city__name', 'item__name').annotate(item_count=Count('item'))

    return queryset