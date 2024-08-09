import logging
from rest_framework import status

WARN = "warn"
INFO = "info"
ERROR = "error"
FILE = "[utils]"
logger = logging.getLogger('django')

def report(message: str, mode: str = INFO, debug: bool = False):    
    if mode == INFO: logger.info(message)
    if mode == WARN: logger.warn(message)
    if mode == ERROR: logger.debug(message, exc_info=debug)
        
def is_subset(A: list, B: list) -> status:
    for elm in A:
        if elm not in B: 
            return status.HTTP_412_PRECONDITION_FAILED
    
    return status.HTTP_200_OK

async def update_queues(queues, id, json):
    try:
        report(f"{queues.keys()}")
        for queue in queues[id]:
            await queue.put(json)
        report(f"{FILE}[update_queues] >> queue at {id} queue updated with {json}")
    except: 
        report(f"{FILE}[update_queues] >> No subscription listening to {id} changes", mode=ERROR, debug=True)
