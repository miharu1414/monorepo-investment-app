from datetime import datetime
from typing import Optional

class Todo:
    def __init__(
        self,
        id: Optional[int],
        title: str,
        description: str,
        completed: bool,
        user_id: int,
        created_at: Optional[datetime] = None
    ):
        self.id = id
        self.title = title
        self.description = description
        self.completed = completed
        self.user_id = user_id
        self.created_at = created_at or datetime.utcnow()
