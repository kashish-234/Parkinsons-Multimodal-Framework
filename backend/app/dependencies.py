from fastapi import Depends, HTTPException, Header
from app.firebase import verify_id_token

async def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        return verify_id_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")