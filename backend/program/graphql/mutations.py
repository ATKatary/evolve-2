import json 
from program.models import *
from datetime import datetime
from django.db.models import Q
from asgiref.sync import sync_to_async
from utils import report, ERROR, update_queues
from program.graphql.queues import program_queue, step_queue, module_queue

FILE = "[program][mutations]"
class ProgramMutations:
    async def create(*_, cid, title):
        coach = await Coach.objects.aget(auth__id=cid)
        program = await Program.objects.acreate(coach=coach, title=title)

        await program.asave()
        return await program.ajson()

    async def update(*_, id, title=None):
        program = await Program.objects.aget(id=id)
        if title is not None: program.title = title 

        await program.asave()

        program_json = await program.ajson()
        await update_queues(program_queue, id, program_json)
        return program_json
    
    async def delete(*_, id):
        program = await Program.objects.aget(id=id)
        await program.adelete()
  
        return True

class ModuleMutations:
    async def create(*_, pid, title):
        program = await Program.objects.aget(id=pid)
        module = await Module.objects.acreate(
            title=title, 
            program=program,
            end=await Step.objects.acreate(title="End"),
            start=await Step.objects.acreate(title="Start"),
            check_in=await Step.objects.acreate(title="Check In"),
            action_plan=await Step.objects.acreate(title="Action Plan")
        )
        await module.asave()

        await ProgramMutations.update(id=pid)
        return await module.ajson()
    
    async def update(*_, id, title=None):
        module = await Module.objects.aget(id=id)
        if title is not None: module.title = title 

        await module.asave()

        program = await sync_to_async(lambda: module.program)()
        await ProgramMutations.update(id=program.id.hex)

        module_json = await module.ajson()
        await update_queues(module_queue, id, module_json)
        return module_json
    
    async def submit(*_, id, sid):
        module = await Module.objects.aget(id=id)
        student = await Student.objects.aget(auth__id=sid)
        submission = await Submission.objects.acreate(module=module, student=student)

        await submission.asave()

        await ModuleMutations.update(id=id)
        return await submission.ajson()

    async def unsubmit(*_, id, sid):
        module = await Module.objects.aget(id=id)
        submission = await Submission.objects.aget(module__id=id, student__auth__id=sid)

        await submission.adelete()

        await ModuleMutations.update(id=id)
        return await module.ajson()
    
    async def check_in(*_, id, sid, checkedIn):
        module = await Module.objects.aget(id=id)
        submission = await Submission.objects.aget(module__id=id, student__auth__id=sid)
        submission.checked_in = checkedIn
        await submission.asave()

        await ModuleMutations.update(id=id)
        return await module.ajson()

    async def delete(*_, id):
        module = await Module.objects.aget(id=id)

        program = await sync_to_async(lambda: module.program)()
        await module.adelete()

        await ProgramMutations.update(id=program.id.hex)
        return True

class StepMutations:
    async def update(*_, id, title=None, displayMode=None):
        step = await Step.objects.aget(id=id)
        if title is not None: step.title = title 
        if displayMode is not None: step.display_mode = displayMode 

        await step.asave()

        module = await Module.objects.aget(
            Q(end__id=id) | 
            Q(start__id=id) |
            Q(check_in__id=id) |
            Q(action_plan__id=id)
        )

        await ModuleMutations.update(id=module.id.hex)

        step_json = await step.ajson()
        await update_queues(step_queue, id, step_json)
        return step_json
    

class EntryMutations:
    async def create(*_, sid, type, data=None):
        step = await Step.objects.aget(id=sid)
        entry = await Entry.objects.acreate(type=type, step=step)
        if data is not None: entry.data = data 
        await entry.asave()

        await StepMutations.update(id=sid)
        return await entry.ajson()
    
    async def update(*_, id, data=None):
        entry = await Entry.objects.aget(id=id)
        if data is not None: entry.data = json.loads(data)

        await entry.asave()

        step = await sync_to_async(lambda: entry.step)()
        await StepMutations.update(id=step.id.hex)
        return await entry.ajson()
    
    async def respond(*_, id, sid, data):
        entry = await Entry.objects.aget(id=id)
        student = await Student.objects.aget(auth__id=sid)

        try:
            response = await Response.objects.aget(entry__id=id, student__id=sid)
        except:    
            response = await Response.objects.acreate(entry=entry, student=student)

        response.data = json.loads(data)
        await response.asave()

        step = await sync_to_async(lambda: entry.step)()
        await StepMutations.update(id=step.id.hex)
        return await entry.ajson()

    async def delete(*_, id):
        entry = await Entry.objects.aget(id=id)

        step = await sync_to_async(lambda: entry.step)()
        
        await entry.adelete()
        await StepMutations.update(id=step.id.hex)
        return True
    
