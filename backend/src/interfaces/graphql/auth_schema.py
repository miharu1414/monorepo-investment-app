from graphene import ObjectType, String, Boolean, Mutation, Field
from ...infrastructure.database.models import UserModel
from ...domain.models.user import User
from flask_jwt_extended import create_access_token

class AuthType(ObjectType):
    token = String()
    success = Boolean()
    message = String()

class LoginMutation(Mutation):
    class Arguments:
        username = String(required=True)  # フロントエンドからusernameとして送られてくるemailを受け取る
        password = String(required=True)

    Output = AuthType

    def mutate(self, info, username, password):
        user = UserModel.query.filter_by(email=username).first()  # usernameをemailとして使用
        
        if not user:
            return AuthType(
                success=False,
                message="ユーザーが見つかりません"
            )
            
        if not user.check_password(password):
            return AuthType(
                success=False,
                message="パスワードが正しくありません"
            )

        access_token = create_access_token(identity=user.id)
        
        return AuthType(
            token=access_token,
            success=True,
            message="Login successful"
        )

class RegisterMutation(Mutation):
    class Arguments:
        username = String(required=True)
        email = String(required=True)
        password = String(required=True)

    Output = AuthType

    def mutate(self, info, username, email, password):
        if UserModel.query.filter_by(email=email).first():
            return AuthType(
                success=False,
                message="Email already exists"
            )

        user = UserModel(username=username, email=email)
        user.set_password(password)
        user.save()

        access_token = create_access_token(identity=user.id)
        
        return AuthType(
            token=access_token,
            success=True,
            message="Registration successful"
        )
