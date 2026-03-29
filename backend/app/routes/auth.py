from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from app.firebase import verify_id_token, create_user, get_user
from app.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterBody(BaseModel):
    email: str
    password: str
    display_name: str | None = None

@router.post("/register")
async def register(body: RegisterBody):
    try:
        user = create_user(body.email, body.password, body.display_name)
        return {"uid": user.uid, "email": user.email}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(authorization: str = Header(..., description="Bearer <firebase_id_token>")):
    try:
        token = authorization.split(" ")[1]
        decoded = verify_id_token(token)
        return {"uid": decoded["uid"], "email": decoded.get("email")}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/me")
async def me(user = Depends(get_current_user)):
    return user