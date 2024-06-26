""" 
Auto views
"""
import json
from pathlib import Path
from datetime import datetime, timedelta
from rest_framework import status
from utils import is_subset, report
from django.shortcuts import render
from auto.tasks import schedule_email_task
from rest_framework.response import Response
from rest_framework.decorators import api_view

BASE_DIR = Path(__file__).resolve().parent.parent.parent

@api_view(['POST'])
def send_email(request, *args, **kwargs) -> Response:
    """Schedules an email to be sent
        
    Args:
        request (dict): includes the 

    Returns:
        Response: 
    """
    report("sending email...")
    fields = ["subject", "html", "toUids", "ccUids", "delay"]
    response_status = is_subset(fields, request.data.keys())
    
    if response_status == status.HTTP_200_OK:
        html = request.data['html']
        delay = request.data['delay']
        toUids = request.data['toUids']
        ccUids = request.data['ccUids']
        subject = request.data['subject']
        report([subject, html, toUids, ccUids])
        schedule_email_task.apply_async(args=[subject, html, toUids, ccUids], eta=(datetime.now() + timedelta(minutes=delay)))
        
    return Response({}, status=response_status)
