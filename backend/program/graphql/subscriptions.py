import asyncio
from utils import report, ERROR
from program.graphql.queues import *

FILE = "[program][subscriptions]"
class ProgramSubscriptions:
    async def watch(*_, id=None):
        if id is None: return 
        
        queue = asyncio.Queue()
        if id in program_queue: 
            program_queue[id].append(queue)
        else: 
            program_queue[id] = [queue]
        report(f"{FILE}[ProgramSubscription][watch] >> watching program {id}")
        try:
            while True:
                program = await queue.get()
                queue.task_done()
                yield program
        except asyncio.CancelledError:
            report(f"{FILE}[ProgramSubscription][watch] >> Error occured while watching program {id}", mode=ERROR, debug=True)

    async def resolve(message, info, id):
        return message

class ModuleSubscriptions:
    async def watch(*_, id=None):
        if id is None: return 
        
        queue = asyncio.Queue()
        if id in module_queue: 
            module_queue[id].append(queue)
        else: 
            module_queue[id] = [queue]
        report(f"{FILE}[ModuleSubscriptions][watch] >> watching module {id}")
        try:
            while True:
                module = await queue.get()
                queue.task_done()
                yield module
        except asyncio.CancelledError:
            report(f"{FILE}[ModuleSubscriptions][watch] >> Error occured while watching module {id}", mode=ERROR, debug=True)

    async def resolve(message, info, id):
        return message
    
class StepSubscriptions:
    async def watch(*_, id=None):
        if id is None: return 
        
        queue = asyncio.Queue()
        if id in step_queue: 
            step_queue[id].append(queue)
        else: 
            step_queue[id] = [queue]
        report(f"{FILE}[StepSubscriptions][watch] >> watching step {id}")
        try:
            while True:
                step = await queue.get()
                queue.task_done()
                yield step
        except asyncio.CancelledError:
            report(f"{FILE}[StepSubscriptions][watch] >> Error occured while watching step {id}", mode=ERROR, debug=True)

    async def resolve(message, info, id):
        return message