from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.schemas.user import UserSettings
from app.services.user_service import update_user_settings

router = APIRouter()

@router.get("/settings", response_model=UserSettings)
async def get_settings(current_user: str = Depends(get_current_user)):
    # Logic to retrieve user settings
    return {"email": current_user.email, "preferences": current_user.preferences}

@router.put("/settings", response_model=UserSettings)
async def update_settings(settings: UserSettings, current_user: str = Depends(get_current_user)):
    # Logic to update user settings
    updated_user = await update_user_settings(current_user.id, settings)
    return updated_user