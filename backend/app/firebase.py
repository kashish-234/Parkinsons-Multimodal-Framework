import os
from firebase_admin import credentials, initialize_app, auth
from dotenv import load_dotenv
load_dotenv()

cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT")
if not cred_path:
    raise RuntimeError("FIREBASE_SERVICE_ACCOUNT not set")
cred = credentials.Certificate(cred_path)
initialize_app(cred)

def verify_id_token(id_token: str):
    return auth.verify_id_token(id_token)

def create_user(email: str, password: str, display_name: str | None = None):
    return auth.create_user(email=email, password=password, display_name=display_name)

def get_user(uid: str):
    return auth.get_user(uid)