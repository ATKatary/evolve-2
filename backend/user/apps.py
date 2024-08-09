from datetime import datetime
from django.apps import AppConfig

class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user'

    # def ready(self):
    #     from user.models import CustomUser
    #     ahmed, status = CustomUser.objects.create(id="1g6XMwbM57e9BI1wotNLGwMeSz03", first_name="Ahmed", last_name="Katary", date_of_birth=datetime(2001, 1, 17).date(), email="atkatary@gmail.com", password="Ployem2024$$")
    #     if ahmed: ahmed.save()
        # TODO: here I can add stuff to do once add is ready