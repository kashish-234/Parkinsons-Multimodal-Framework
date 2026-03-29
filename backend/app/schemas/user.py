from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=30)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(UserBase):
    password: Optional[str] = Field(None, min_length=6)

class UserInDB(UserBase):
    id: int
    hashed_password: str

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True