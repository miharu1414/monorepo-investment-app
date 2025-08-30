from dataclasses import dataclass
from datetime import datetime

@dataclass
class User:
    id: int
    username: str
    email: str
    created_at: datetime = None

    def validate_email(self) -> bool:
        return '@' in self.email
