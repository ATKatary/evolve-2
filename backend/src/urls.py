"""
Evolve URL Configuration
"""
from django.contrib import admin
from django.urls import path, include

prefix = 'api/evolve/'
urlpatterns = [
    path(prefix + 'admin/', admin.site.urls),
    path(prefix + 'auto/', include('auto.urls')),
]

