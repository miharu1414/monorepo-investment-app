import graphene
from models import User

class UserType(graphene.ObjectType):
    id = graphene.Int()
    username = graphene.String()
    email = graphene.String()

    def resolve_id(self, info):
        return self.id

    def resolve_username(self, info):
        return self.username

    def resolve_email(self, info):
        return self.email

class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.Int(required=True))

    def resolve_users(self, info):
        return User.query.all()

    def resolve_user(self, info, id):
        return User.query.get(id)

schema = graphene.Schema(query=Query)
