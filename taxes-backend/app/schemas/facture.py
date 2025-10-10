# Dans app/schemas/facture.py

from pydantic import BaseModel
from datetime import date
from typing import Optional, List
from .vehicule import VehiculeResponse

# On importe les schémas de notification, car une facture peut en avoir plusieurs
from .notification import NotificationResponse
from .user import UserResponse

class FactureBase(BaseModel):
    periode: str
    montantDu: int
    dateEmission: Optional[date] = None
    dateEcheance: Optional[date] = None
    statut: Optional[str] = "non_payee"
    idConducteur: int
    idTaxe: int
    idVehicule: int

class FactureCreate(FactureBase):
    pass

class FactureResponse(FactureBase):
    id: int
    notifications: Optional[List[NotificationResponse]] = None
    vehicule: Optional[VehiculeResponse] = None   # ✅ nouvelle clé
    conducteur: Optional[UserResponse] = None

    class Config:
        from_attributes = True