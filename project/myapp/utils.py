import qrcode
from . import models
from io import BytesIO


def check_existing_owner(full_name_city):
    print(full_name_city)
    full_name, city = full_name_city.split('-')
    print(full_name)
    print(city)
    # first_name, middle_name, last_name = full_name.split()
    # print(first_name, middle_name, last_name)
    # try:
    #     person = models.Person.objects.get(first_name=first_name, middle_name=middle_name, last_name=last_name, city=city)
    #     return person.id
    # except models.Person.DoesNotExist:
    #     message = "Человек не найден"
    #     return message

def check_existing_item(item_name):
    name, brand = item_name.split('(')
    brand = brand.rstrip(')')  

    try:
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