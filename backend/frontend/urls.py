from . import views
from django.urls import path

urlpatterns = [
    path('', views.home, name = 'home'),
    path(r'<string>', views.home, name = 'home'),
    path(r'<string>/<string1>', views.home, name = 'home'),
    path(r'<string>/<string1>/<string2>', views.home, name = 'home')
]
