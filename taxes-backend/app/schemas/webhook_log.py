# Dans app/schemas/webhook_log.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WebhookLogBase(BaseModel):
    idTransaction: int
    entetes: str
    contenu: str
    statuHttp: int
    signatureValide: Optional[bool] = False
    
class WebhookLogCreate(WebhookLogBase):
    pass

class WebhookLogResponse(WebhookLogBase):
    id: int
    dateReception: datetime

    class Config:
        from_attributes = True