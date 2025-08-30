from typing import List
from abc import ABC, abstractmethod
from ..models.todo import Todo

class TodoRepository(ABC):
    @abstractmethod
    def create(self, todo: Todo) -> Todo:
        pass

    @abstractmethod
    def get_by_id(self, todo_id: int) -> Todo:
        pass

    @abstractmethod
    def get_by_user_id(self, user_id: int) -> List[Todo]:
        pass

    @abstractmethod
    def update(self, todo: Todo) -> Todo:
        pass

    @abstractmethod
    def delete(self, todo_id: int) -> bool:
        pass
