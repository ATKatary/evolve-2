"""
Auto url patterns
"""
from . import views
from django.urls import path, re_path

urlpatterns = [
    path("sendEmail", views.send_email, name="send_email"),
]

websocket_urlpatterns = [
]