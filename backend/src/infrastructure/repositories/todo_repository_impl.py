from typing import List
from ...domain.repositories.todo_repository import TodoRepository
from ...domain.models.todo import Todo
from ..database.models import db, TodoModel

class TodoRepositoryImpl(TodoRepository):
    def create(self, todo: Todo) -> Todo:
        todo_model = TodoModel(
            title=todo.title,
            description=todo.description,
            completed=todo.completed,
            user_id=todo.user_id
        )
        db.session.add(todo_model)
        db.session.commit()
        return self._to_domain(todo_model)

    def get_by_id(self, todo_id: int) -> Todo:
        todo_model = TodoModel.query.get(todo_id)
        if todo_model:
            return self._to_domain(todo_model)
        return None

    def get_by_user_id(self, user_id: int) -> List[Todo]:
        todo_models = TodoModel.query.filter_by(user_id=user_id).all()
        return [self._to_domain(model) for model in todo_models]

    def update(self, todo: Todo) -> Todo:
        todo_model = TodoModel.query.get(todo.id)
        if todo_model:
            todo_model.title = todo.title
            todo_model.description = todo.description
            todo_model.completed = todo.completed
            db.session.commit()
            return self._to_domain(todo_model)
        return None

    def delete(self, todo_id: int) -> bool:
        todo_model = TodoModel.query.get(todo_id)
        if todo_model:
            db.session.delete(todo_model)
            db.session.commit()
            return True
        return False

    def _to_domain(self, model: TodoModel) -> Todo:
        return Todo(
            id=model.id,
            title=model.title,
            description=model.description,
            completed=model.completed,
            user_id=model.user_id,
            created_at=model.created_at
        )
