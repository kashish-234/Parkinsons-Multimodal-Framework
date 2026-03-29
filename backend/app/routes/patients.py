from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from app.schemas.user import User
from app.services.user_service import get_patients, create_patient

router = APIRouter()

@router.get("/patients", response_model=list[User])
async def read_patients(current_user: User = Depends(get_current_user)):
    patients = await get_patients(current_user.id)
    return patients

@router.post("/patients", response_model=User)
async def add_patient(patient: User, current_user: User = Depends(get_current_user)):
    new_patient = await create_patient(patient, current_user.id)
    return new_patient