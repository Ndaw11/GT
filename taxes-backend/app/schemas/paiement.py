# Dans app/schemas/paiement.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PaiementBase(BaseModel):
    idFacture: int
    montant: int
    moyen: Optional[str] = None
    reference: Optional[str] = None
    statut: Optional[str] = "en_attente"
    idTresorier: int

class PaiementCreate(PaiementBase):
    pass

class PaiementResponse(PaiementBase):
    id: int
    datePaiement: datetime
    
    class Config:
        from_attributes = True