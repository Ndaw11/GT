# Dans app/schemas/notification.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationBase(BaseModel):
    titre: str
    message: str
    idFacture: Optional[int] = None
    destinataire_id: Optional[int] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: int
    dateEnvoi: datetime

    class Config:
        from_attributes = True