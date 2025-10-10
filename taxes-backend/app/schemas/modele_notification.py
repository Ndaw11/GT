# app/schemas/modele_notification.py

from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional

class TypeNotificationEnum(str, Enum):
    facture_emise = "facture_emise"
    paiement_reussi = "paiement_reussi"
    paiement_echec = "paiement_echec"
    rappel_facture = "rappel_facture"

class ModeleNotificationBase(BaseModel):
    titre: str
    message: str
    type_notification: TypeNotificationEnum

class ModeleNotificationCreate(ModeleNotificationBase):
    pass

class ModeleNotificationUpdate(BaseModel):
    titre: Optional[str] = None
    message: Optional[str] = None
    type_notification: Optional[TypeNotificationEnum] = None

class ModeleNotificationResponse(ModeleNotificationBase):
    id: int
    dateCreation: datetime

    class Config:
        from_attributes = True
