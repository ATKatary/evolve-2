from user.models import *
from user.graphql.queues import *
from program.models import Program
from utils import report, ERROR, update_queues
from program.graphql.mutations import ProgramMutations

FILE = "[user][mutations]"
async def assign_student_programs(*_, id, pids, action):
    student = await Student.objects.aget(auth__id=id)
    for pid in pids:
        program = await Program.objects.aget(id=pid)
        if action == "add": await program.students.aadd(student)
        if action == "remove": await program.students.aremove(student)

        await ProgramMutations.update(id=pid)

    return await student.ajson()

async def create_student(*_, id, first, last, email, password, parental):
    auth, _ = await CustomUser.objects.acreate(id, first, last, email, password)
    student = await Student.objects.acreate(auth=auth, parental_email=parental)
    await student.asave()

    return await student.ajson()

async def create_coach(*_, id, first, last, email, password, calendly):
    auth, _ = await CustomUser.objects.acreate(id, first, last, email, password)
    coach = await Coach.objects.acreate(auth=auth, calendly_link=calendly)
    await coach.asave()

    return await coach.ajson()