from typing import Optional
from firebase_admin import auth
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class UserService:
    @staticmethod
    def create_user(user_data: UserCreate) -> User:
        user = auth.create_user(
            email=user_data.email,
            password=user_data.password,
            display_name=user_data.display_name
        )
        return User(id=user.uid, email=user.email, display_name=user.display_name)

    @staticmethod
    def get_user(user_id: str) -> Optional[User]:
        try:
            user = auth.get_user(user_id)
            return User(id=user.uid, email=user.email, display_name=user.display_name)
        except auth.AuthError:
            return None

    @staticmethod
    def update_user(user_id: str, user_data: UserUpdate) -> Optional[User]:
        try:
            user = auth.update_user(
                user_id,
                email=user_data.email,
                display_name=user_data.display_name
            )
            return User(id=user.uid, email=user.email, display_name=user.display_name)
        except auth.AuthError:
            return None

    @staticmethod
    def delete_user(user_id: str) -> None:
        auth.delete_user(user_id)