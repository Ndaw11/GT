# Dans app/models/vehicule.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base

class Vehicule(Base):
    __tablename__ = "vehicules"

    id = Column(Integer, primary_key=True, index=True)
    immatriculation = Column(String, unique=True, index=True, nullable=False)
    type = Column(String, nullable=False)
    marque = Column(String, nullable=False)
    annee = Column(Integer)

    # Clé étrangère pour lier le véhicule au conducteur
    conducteur_id = Column(Integer, ForeignKey("users.id"))

    # Relations
    conducteur = relationship("User", back_populates="vehicules")

    # Ajout de la relation inverse vers Facture
    factures = relationship("Facture", back_populates="vehicule")