"""
Evolve URL Configuration
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include, re_path

prefix = 'api/evolve/'
urlpatterns = [
    path(prefix + 'admin/', admin.site.urls),
    path(prefix + 'user/', include('user.urls')),
    path(prefix + 'auto/', include('auto.urls')),
    path(prefix + 'program/', include('program.urls')),
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
]
