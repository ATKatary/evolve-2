from celery import shared_task
from api.firebase import send_email

@shared_task()
def schedule_email_task(subject: str, html: str, toUids: list[str], ccUids: list[str]) -> bool:
    send_email(subject, html, toUids, ccUids)
