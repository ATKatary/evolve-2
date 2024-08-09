"""
Module admin
"""
from program.models import *
from django.contrib import admin

admin.site.register(Step)
admin.site.register(Entry)
admin.site.register(Module)
admin.site.register(Program)
admin.site.register(Response)
admin.site.register(Submission)
