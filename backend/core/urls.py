from django.urls import path

from . import views

urlpatterns = [
    path('releases/latest/', views.latest_release, name='latest-release'),
    path('contact/', views.contact, name='contact'),
]
