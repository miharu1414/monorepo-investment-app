from graphene import ObjectType, String, Int, Boolean, List, Mutation, Field, DateTime
from flask_jwt_extended import get_jwt_identity
from ...infrastructure.database.models import db, TodoModel

class TodoType(ObjectType):
    id = Int()
    title = String()
    description = String()
    completed = Boolean()
    created_at = DateTime()
    user_id = Int()

class CreateTodoMutation(Mutation):
    class Arguments:
        title = String(required=True)
        description = String(required=True)

    todo = Field(TodoType)
    success = Boolean()
    message = String()

    def mutate(self, info, title, description):
        try:
            current_user_id = get_jwt_identity()
            todo = TodoModel(
                title=title,
                description=description,
                user_id=current_user_id
            )
            db.session.add(todo)
            db.session.commit()
            return CreateTodoMutation(
                todo=todo,
                success=True,
                message="TODO created successfully"
            )
        except Exception as e:
            return CreateTodoMutation(
                todo=None,
                success=False,
                message=str(e)
            )

class UpdateTodoMutation(Mutation):
    class Arguments:
        id = Int(required=True)
        title = String()
        description = String()
        completed = Boolean()

    todo = Field(TodoType)
    success = Boolean()
    message = String()

    def mutate(self, info, id, title=None, completed=None):
        current_user_id = info.context.user.id
        todo = TodoModel.query.filter_by(id=id, user_id=current_user_id).first()
        
        if not todo:
            raise Exception('Todo not found')

        if title is not None:
            todo.title = title
        if completed is not None:
            todo.completed = completed

        db.session.commit()
        return todo

class DeleteTodoMutation(Mutation):
    class Arguments:
        id = Int(required=True)

    success = Boolean()

    def mutate(self, info, id):
        current_user_id = info.context.user.id
        todo = TodoModel.query.filter_by(id=id, user_id=current_user_id).first()
        
        if not todo:
            raise Exception('Todo not found')

        db.session.delete(todo)
        db.session.commit()
        return DeleteTodoMutation(success=True)
