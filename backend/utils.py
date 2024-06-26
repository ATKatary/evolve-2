import logging
from rest_framework import status

WARN = "warn"
INFO = "info"
ERROR = "error"
logger = logging.getLogger('django')

def report(message: str, mode: str = INFO, debug: bool = False):    
    if mode == INFO: logger.info(message)
    if mode == WARN: logger.warn(message)
    if mode == ERROR: 
        if debug: logger.exception(message)
        else: logger.error(message)
        
def is_subset(A: list, B: list) -> status:
    for elm in A:
        if elm not in B: 
            return status.HTTP_412_PRECONDITION_FAILED
    
    return status.HTTP_200_OK
