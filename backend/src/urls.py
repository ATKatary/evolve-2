"""
Evolve URL Configuration
"""
from django.contrib import admin
from django.urls import path, include

prefix = 'api/evolve/'
urlpatterns = [
    path(prefix + 'admin/', admin.site.urls),
    path(prefix + 'user/', include('user.urls')),
    path(prefix + 'auto/', include('auto.urls')),
    path(prefix + 'program/', include('program.urls')),
]

