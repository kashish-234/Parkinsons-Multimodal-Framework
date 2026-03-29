from fastapi import APIRouter, HTTPException, Depends
from app.dependencies import get_current_user
from app.schemas.user import User
from app.services.user_service import get_datasets

router = APIRouter()

@router.get("/datasets", response_model=list[User])
async def read_datasets(current_user: User = Depends(get_current_user)):
    datasets = await get_datasets(current_user.id)
    if not datasets:
        raise HTTPException(status_code=404, detail="No datasets found")
    return datasets