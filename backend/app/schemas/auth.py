from pydantic import BaseModel, EmailStr, Field

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    username: str = Field(..., min_length=3)

class AuthResponse(BaseModel):
    access_token: str
    token_type: str

class GoogleAuthResponse(BaseModel):
    id_token: str
    access_token: str
    refresh_token: str
    expires_in: int