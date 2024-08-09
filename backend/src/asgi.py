"""
ASGI config for src project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""
import os
from datetime import timedelta
from ariadne.asgi import GraphQL
from django.urls import path, re_path
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from starlette.middleware.cors import CORSMiddleware
from channels.routing import ProtocolTypeRouter, URLRouter
from ariadne.asgi.handlers import GraphQLTransportWSHandler

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'src.settings')
django_asgi_app = get_asgi_application()

from src.graphql.config import schema

application = AuthMiddlewareStack(
    URLRouter([
        re_path(
            r"/gql", 
            CORSMiddleware(
                GraphQL(
                    schema, 
                    debug=True,
                    websocket_handler=GraphQLTransportWSHandler(connection_init_wait_timeout=timedelta(hours=1))
                ),
                allow_methods=["*"],
                allow_origins=['http://localhost:3000', 'https://fabhous.com', 'http://www.fabhous.com']
            )
        ), 
        re_path(r"", django_asgi_app)
    ])
)