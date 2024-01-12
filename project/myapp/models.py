from django.db import models
from django.forms import ValidationError


class City(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Person(models.Model):
    last_name = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    def __str__(self):
            return f"{self.last_name} {self.first_name} {self.middle_name} - {self.city}"

    
class Item(models.Model):
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=255)
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - {self.city}"

class Ownership(models.Model):
    owner = models.ForeignKey(Person, on_delete=models.CASCADE, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    serial_number = models.CharField(max_length=255, blank=True, null=True)
    added_date = models.DateField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)

    def clean(self):
        if self.owner is None and self.department is None:
            raise ValidationError("Either owner or department must be specified.")

    def __str__(self):
        return f"{self.owner or self.department} - {self.item}"


    



