# Dans app/schemas/vehicule.py

from pydantic import BaseModel
from typing import Optional

class VehiculeBase(BaseModel):
    immatriculation: str
    type: str
    marque: str
    annee: Optional[int] = None

class VehiculeCreate(VehiculeBase):
    pass

class VehiculeResponse(VehiculeBase):
    id: int
    conducteur_id: int

    class Config:
        from_attributes = True