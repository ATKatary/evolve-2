import uuid
from utils import report
from user.models import *
from program.models import *
from asgiref.sync import sync_to_async

def get_student_programs(student: Student):
    programs = list(Program.objects.all())

    student_programs = []
    for program in programs:
        if student in list(program.students.all()):
            student_programs.append(program)
    
    return student_programs

FILE = "[users][queries]"
async def get_student(*_, id):
    report(f"{FILE}[get_student] >> fetching student: {id}")
    student = await Student.objects.aget(auth__id=id)
    programs = await sync_to_async(get_student_programs)(student)

    return {
        **(await student.ajson()), 
        "programs": [
            {
                **(await program.ajson()),
                "progress": await sync_to_async(program.progress)(student),
                "accessible_modules": await sync_to_async(program.accessible_modules)(student)
            }
            for program in programs
        ]
    }

async def get_coach(*_, id):
    report(f"{FILE}[get_coach] >> fetching coach: {id}")
    coach = await Coach.objects.aget(auth__id=id)

    programs = await sync_to_async(lambda: list(Program.objects.filter(coach=coach)))()
    students = await sync_to_async(lambda: list(Student.objects.filter(coach=coach)))()

    return {
        **(await coach.ajson()), 
        "students": [await student.ajson() for student in students],
        "programs": [await program.ajson() for program in programs],
    }
