from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Paiement(Base):
    __tablename__ = "paiements"

    id = Column(Integer, primary_key=True, index=True)
    idFacture = Column(Integer, ForeignKey("factures.id"))  # nom de colonne dans la DB
    montant = Column(Integer, nullable=False)
    moyen = Column(String)
    reference = Column(String)
    statut = Column(String)
    datePaiement = Column(DateTime, default=datetime.utcnow)

    idTresorier = Column(Integer, ForeignKey("users.id"), nullable=True)  # renommé
    tresorier = relationship("User", back_populates="paiements_valides")

    # Relations
    facture = relationship("Facture", back_populates="paiements")
    transaction_mobile = relationship("TransactionMobile", back_populates="paiement")
