# Dans app/schemas/transaction_mobile.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TransactionMobileBase(BaseModel):
    idFacture: int
    operateur: str
    referenceOperateur: str
    montant: int
    statutOperateur: str
    cleIdempotence: Optional[str] = None
    urlPaiement: Optional[str] = None
    donneesSignees: Optional[str] = None
    dateCallback: Optional[datetime] = None
    idPaiement: Optional[int] = None

class TransactionMobileCreate(TransactionMobileBase):
    pass

class TransactionMobileResponse(TransactionMobileBase):
    id: int
    dateInitiation: datetime

    class Config:
        from_attributes = True