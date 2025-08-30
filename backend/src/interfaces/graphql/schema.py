import graphene
from ...infrastructure.repositories.user_repository_impl import SQLAlchemyUserRepository
from ...domain.models.user import User

class UserType(graphene.ObjectType):
    id = graphene.ID(required=True)
    username = graphene.String(required=True)
    email = graphene.String(required=True)
    created_at = graphene.DateTime()

class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.Int(required=True))

    def resolve_users(self, info):
        repository = SQLAlchemyUserRepository()
        return repository.find_all()

    def resolve_user(self, info, id):
        repository = SQLAlchemyUserRepository()
        return repository.find_by_id(id)

class CreateUserInput(graphene.InputObjectType):
    username = graphene.String(required=True)
    email = graphene.String(required=True)

class CreateUser(graphene.Mutation):
    class Arguments:
        input = CreateUserInput(required=True)

    user = graphene.Field(UserType)

    def mutate(self, info, input):
        user = User(id=None, username=input.username, email=input.email)
        repository = SQLAlchemyUserRepository()
        created_user = repository.save(user)
        return CreateUser(user=created_user)

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
