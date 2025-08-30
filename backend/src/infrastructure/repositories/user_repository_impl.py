from typing import List, Optional
from ...domain.models.user import User
from ...domain.repositories.user_repository import UserRepository
from ..database.models import UserModel, db

class SQLAlchemyUserRepository(UserRepository):
    def find_by_id(self, user_id: int) -> Optional[User]:
        user_model = UserModel.query.get(user_id)
        if user_model is None:
            return None
        return User(
            id=user_model.id,
            username=user_model.username,
            email=user_model.email,
            created_at=user_model.created_at
        )

    def find_all(self) -> List[User]:
        user_models = UserModel.query.all()
        return [
            User(
                id=user.id,
                username=user.username,
                email=user.email,
                created_at=user.created_at
            )
            for user in user_models
        ]

    def save(self, user: User) -> User:
        if user.id is None:
            user_model = UserModel(
                username=user.username,
                email=user.email
            )
            db.session.add(user_model)
        else:
            user_model = UserModel.query.get(user.id)
            user_model.username = user.username
            user_model.email = user.email
        
        db.session.commit()
        return User(
            id=user_model.id,
            username=user_model.username,
            email=user_model.email,
            created_at=user_model.created_at
        )

    def delete(self, user_id: int) -> bool:
        user_model = UserModel.query.get(user_id)
        if user_model is None:
            return False
        db.session.delete(user_model)
        db.session.commit()
        return True
