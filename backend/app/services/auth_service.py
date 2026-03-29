from firebase_admin import auth
from fastapi import HTTPException
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials

# Initialize Firebase Admin SDK
cred = credentials.Certificate("firebase-service-account.json")
firebase_admin.initialize_app(cred)

class User(BaseModel):
    email: str
    password: str

async def register_user(user: User):
    try:
        user_record = auth.create_user(
            email=user.email,
            password=user.password
        )
        return {"uid": user_record.uid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def login_user(user: User):
    try:
        user_record = auth.get_user_by_email(user.email)
        # Here you would typically verify the password with your own method
        # Firebase does not provide a direct way to verify passwords
        return {"uid": user_record.uid}
    except auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def google_sign_in(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        return {"uid": uid}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid token")