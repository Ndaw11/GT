# Dans app/models/transaction_mobile.py

from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base

class TransactionMobile(Base):
    __tablename__ = "transactions_mobiles"
    
    id = Column(Integer, primary_key=True, index=True)
    idFacture = Column(Integer, ForeignKey("factures.id"))
    idPaiement = Column(Integer, ForeignKey("paiements.id")) # Clé étrangère vers Paiement
    operateur = Column(String, nullable=False)
    referenceOperateur = Column(String)
    montant = Column(Integer, nullable=False)
    statutOperateur = Column(String, nullable=False)
    cleIdempotence = Column(String)
    urlPaiement = Column(String)
    donneesSignees = Column(String)
    dateCallback = Column(DateTime)
    dateInitiation = Column(DateTime, default=datetime.utcnow)
    
    # Relation vers Paiement
    paiement = relationship("Paiement", back_populates="transaction_mobile")