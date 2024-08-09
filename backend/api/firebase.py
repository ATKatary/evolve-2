import os
import json
from pathlib import Path
from datetime import datetime
from utils import report, ERROR
from firebase_admin import credentials, initialize_app, firestore, auth

FILE = "[API][Firebase]"
BASE_DIR = Path(__file__).resolve().parent.parent.parent
cred = credentials.Certificate(f"{BASE_DIR}/.creds/firebase-creds.json")
app = initialize_app(cred)

db = firestore.client()

def send_email(subject: str, html: str, toUids: list[str], ccUids: list[str], to: list[str]) -> bool:
    try:
        db.collection("mail").add({
            "message": {
                "subject": subject, 
                "html": html
            }, 
            "to": to,
            "toUids": toUids,
            "ccUids": ccUids
        })

        report(f"{FILE}[send_email] >> Email sent!")
    except:
        report(f"{FILE}[send_email] >> Error occurred while sending email...", mode=ERROR, debug=True)
        