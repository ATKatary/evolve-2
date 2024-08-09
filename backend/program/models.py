"""
Module models
"""
import json
import uuid
from django.db import models
from utils import report, ERROR
from user.models import Coach, Student
from asgiref.sync import sync_to_async

alphabet_len = 26
FILE = "[program][models]"
class Step(models.Model):
    title = models.CharField(max_length=2*alphabet_len)
    display_mode = models.CharField(
        max_length=5,
        default="doc",
        choices={
            "doc": "doc",
            "slide": "slide",
        } 
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def has_entries(self):
        entries = Entry.objects.filter(step=self)
        if entries.count() == 0: return False 
        return True 
    
    def progress(self, student):
        entries = Entry.objects.filter(step=self)
        if not entries.count(): return 1

        n = 0
        progress = 0
        for entry in entries:
            score = entry.progress(student)
            if score:
                n += 1
                progress += score
        if n > 0:
            return progress / n
        return 0
        
    def json(self) -> json:
        return {
            "id": self.id.hex,
            "title": self.title,
            "display_mode": self.display_mode,
            "entries": [entry.json() for entry in Entry.objects.filter(step=self)]
        }

    async def ajson(self):
        return await sync_to_async(self.json)()

    def __str__(self) -> str:
        try:
            module = Module.objects.get(
                models.Q(end__id=self.id) | 
                models.Q(start__id=self.id) |
                models.Q(check_in__id=self.id) |
                models.Q(action_plan__id=self.id)
            )
            return f"{module} / {self.title}"
        except: 
            # self.delete()
            return f"{self.id}"

class Entry(models.Model):
    step = models.ForeignKey(Step, on_delete=models.CASCADE)

    data = models.JSONField(null=True, blank=True)
    type = models.CharField(
        max_length=10,
        default="text",
        choices={
            "text": "text",
            "rank" : "rank",
            "email" : "email",
            "upload": "upload",
            "prompt" : "prompt",
        } 
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def progress(self, student):
        if self.type in ["text", "email"]: return

        try:
            response = Response.objects.get(entry=self, student=student)
            if response.data: return 1
            return 0
        except: return
        
    def json(self) -> json:
        return {
            "id": self.id.hex,
            "type": self.type, 
            "data": json.dumps(self.data), 
            "responses": [response.json() for response in Response.objects.filter(entry=self)]
        }

    async def ajson(self):
        return await sync_to_async(self.json)()
    
    def __str__(self) -> str:
        return f"{self.step} / {self.type}"

class Program(models.Model):
    coach = models.ForeignKey(Coach, on_delete=models.SET_NULL, null=True)
    students = models.ManyToManyField(Student, related_name="students", blank=True)
    
    title = models.CharField(max_length=2*alphabet_len)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def progress(self, student):
        modules = Module.objects.filter(program=self)
        n = modules.count()
        if not n: return 1

        progress = 0
        if self.students.contains(student):
            for module in list(modules.all()):
                progress += module.progress(student)

        return f"{progress / n:.2f}"
    
    def accessible_modules(self, student):
        modules = list(Module.objects.filter(program=self).all())
        n = len(modules)

        can_access = [modules[0].id.hex]
        for i in range(1, n):
            module = modules[i]
            prev_checked_in = modules[i - 1].checked_in(student)
            report(f"{FILE}[Program] (prev_checked_in) >> {prev_checked_in}")
            if prev_checked_in:
                can_access.append(module.id.hex)
        
        return can_access
    
    def json(self) -> json:
        return {
            "id": self.id.hex,
            "title": self.title, 

            "owner": self.coach.json() if self.coach else None,
            "students": [student.json() for student in list(self.students.all())],
            "modules": [module.json() for module in Module.objects.filter(program=self)]
        }

    async def ajson(self):
        return await sync_to_async(self.json)()
    
    def __str__(self) -> str:
        if self.coach:
            return f"[{self.coach.auth.email}] {self.title}"
        return f"[None] {self.title}"
    
class Module(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE)

    end = models.ForeignKey(Step, on_delete=models.SET_NULL, related_name="end", null=True)
    start = models.ForeignKey(Step, on_delete=models.SET_NULL, related_name="start", null=True)
    check_in = models.ForeignKey(Step, on_delete=models.SET_NULL, related_name="check_in", null=True)
    action_plan = models.ForeignKey(Step, on_delete=models.SET_NULL, related_name="action_plan", null=True)

    title = models.CharField(max_length=2*alphabet_len)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def progress(self, student):
        return self.start.progress(student)
    
    def checked_in(self, student):
        if not self.start.has_entries(): return True 
        try:
            submission = Submission.objects.get(module=self, student=student)
            if submission.checked_in: return True 
            else: return False
        except: 
            return False 
    
    def json(self) -> json:
        return {
            "id": self.id.hex,
            "title": self.title, 

            "end": self.end.json(),
            "start": self.start.json(),
            "check_in": self.check_in.json(),
            "action_plan": self.action_plan.json(),
            "submissions": [submission.json() for submission in Submission.objects.filter(module=self)]
        }

    async def ajson(self):
        return await sync_to_async(self.json)()

    def __str__(self) -> str:
        return f"{self.program} / {self.title}"
    
class Response(models.Model):
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE)

    data = models.JSONField(null=True, blank=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def json(self) -> json:
        return {
            "id": self.id.hex,
            "data": json.dumps(self.data),
            "student": self.student.json()
        }

    async def ajson(self):
        return await sync_to_async(self.json)()
    
    def __str__(self) -> str:
        return f"[{self.student.auth.email}][response] >> {self.entry}"
    
class Submission(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE)

    checked_in = models.BooleanField(default=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def json(self) -> json:
        return {
            "id": self.id.hex,
            "checked_in": self.checked_in,
            "student": self.student.json()
        }

    async def ajson(self):
        return await sync_to_async(self.json)()
    
    def __str__(self) -> str:
        return f"[{self.student.auth.email}][submission] >> {self.module}"
