import uuid
from utils import report
from program.models import *
from asgiref.sync import sync_to_async

FILE = "[program][queries]"
class ProgramQueries:
    async def get(*_, id):
        return await (await Program.objects.aget(id=id)).ajson()

    async def progress(*_, id, sid):
        student = await Student.objects.aget(auth__id=sid)
        return await sync_to_async((await Program.objects.aget(id=id)).progress)(student)

class ModuleQueries:
    async def get(*_, id):
        return await (await Module.objects.aget(id=id)).ajson()
    
    async def progress(*_, id, sid):
        student = await Student.objects.aget(auth__id=sid)
        return await sync_to_async((await Module.objects.aget(id=id)).progress)(student)

class StepQueries:
    async def get(*_, id):
        return await (await Step.objects.aget(id=id)).ajson()