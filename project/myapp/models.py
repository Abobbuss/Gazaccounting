from django.db import models


class City(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Person(models.Model):
    last_name = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
            return f"{self.last_name}, {self.first_name} {self.middle_name} - {self.city}"

    
class Item(models.Model):
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name
    
class Ownership(models.Model):
    owner = models.ForeignKey(Person, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    serial_number = models.CharField(max_length=255, blank=True, null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)

    def __str__(self):
        return f"{self.owner} - {self.item}"
