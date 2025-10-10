# Dans app/models/taxe.py

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from ..database import Base

class Taxe(Base):
    __tablename__ = "taxes"

    id = Column(Integer, primary_key=True, index=True)
    libelle = Column(String, unique=True, index=True, nullable=False)
    montant = Column(Integer, nullable=False)
    periodicite = Column(String, nullable=False)  # <-- C'est ici qu'il faut faire le changement
    active = Column(Boolean, default=True)

    factures = relationship("Facture", back_populates="taxe")