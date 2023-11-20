from django.contrib import admin
from . import models

class OwnershipAdmin(admin.ModelAdmin):
    list_display = ['owner', 'item', 'added_date']
    ordering = ['owner__last_name', 'owner__first_name', 'item__name', 'added_date']
    search_fields = ['owner__first_name', 'owner__last_name', 'item__name']

admin.site.register(models.Ownership, OwnershipAdmin)

class PersonAdmin(admin.ModelAdmin):
    list_display = ['last_name', 'first_name', 'middle_name', 'city']
    ordering = ['last_name', 'first_name', 'middle_name', 'city']
    search_fields = ['last_name', 'first_name', 'middle_name', 'city__name']

admin.site.register(models.Person, PersonAdmin)

class ItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand']
    ordering = ['name', 'brand']
    search_fields = ['name', 'brand']

admin.site.register(models.Item, ItemAdmin)

class CityAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

admin.site.register(models.City, CityAdmin)
