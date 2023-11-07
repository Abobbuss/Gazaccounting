from django.urls import path, include
from . import views
from drf_yasg.views import get_schema_view as swagger_get_shema_view
from drf_yasg import openapi


shema_view = swagger_get_shema_view(
    openapi.Info(
        title="Posts API",
        default_version='1.0.0',
        description="API documentation of App"
    ),
    public=True,
)

urlpatterns = [
    path('api/',
        include([
            path('swagger/shema/', shema_view.with_ui('swagger', cache_timeout=0)),

            path('cities/', views.CityListView.as_view(), name='city-list'),

            path('persons/create/', views.PersonCreateView.as_view(), name='person-create'),
            path('persons/', views.PersonListView.as_view(), name='person-list'),
            path('persons/<int:pk>/', views.PersonDetailView.as_view(), name='person-detail'),

            path('items/create/', views.ItemCreateView.as_view(), name='item-create'),
            path('items/', views.ItemListView.as_view(), name='item-list'),
            path('items/<int:pk>/', views.ItemDetailView.as_view(), name='item-detail'),

        ]))
    
]
