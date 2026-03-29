from fastapi import APIRouter, HTTPException, Depends
from app.schemas.auth import UserLogin, UserRegister
from app.services.auth_service import register_user, login_user

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    try:
        return await register_user(user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(user: UserLogin):
    try:
        return await login_user(user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))