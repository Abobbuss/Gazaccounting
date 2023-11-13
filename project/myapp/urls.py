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
    path('', views.index, name='index'),
    path('api',
        include([
            path('swagger/shema/', shema_view.with_ui('swagger', cache_timeout=0)),

            path('city/', views.CityListView.as_view(), name='city-list'),

            path('person/create/', views.PersonCreateView.as_view(), name='person-create'),
            path('person/', views.PersonListView.as_view(), name='person-list'),
            path('person/<int:pk>/', views.PersonDetailView.as_view(), name='person-detail'),

            path('item/create/', views.ItemCreateView.as_view(), name='item-create'),
            path('item/', views.ItemListView.as_view(), name='item-list'),
            path('item/<int:pk>/', views.ItemDetailView.as_view(), name='item-detail'),

            path('ownership/', views.OwnershipListView.as_view(), name='ownership-list'),
            path('ownership/create', views.OwnerShipCreateView.as_view(), name='ownership-list'),
            path('ownership/<int:pk>/', views.OwnerShipDetailView.as_view(), name='ownership-detail')
        ]))
    
]
