from pydantic import BaseModel
from typing import Optional

class TaxeBase(BaseModel):
    libelle: str
    montant: int
    periodicite: str
    active: bool = True

class TaxeCreate(TaxeBase):
    pass

class TaxeResponse(TaxeBase):
    id: int

    class Config:
        from_attributes = True