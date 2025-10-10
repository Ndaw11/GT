# Dans app/models/facture.py

from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Facture(Base):
    __tablename__ = "factures"

    id = Column(Integer, primary_key=True, index=True)
    periode = Column(String, nullable=False)
    montantDu = Column(Integer, nullable=False)
    dateEmission = Column(Date)
    dateEcheance = Column(Date)
    statut = Column(String, default="non_payee")

    # Clés étrangères
    idConducteur = Column(Integer, ForeignKey("users.id"))
    idTaxe = Column(Integer, ForeignKey("taxes.id"))
    idVehicule = Column(Integer, ForeignKey("vehicules.id"))

    # Relations
    conducteur = relationship("User", back_populates="factures")
    taxe = relationship("Taxe", back_populates="factures")
    vehicule = relationship("Vehicule", back_populates="factures") # Cette relation est correcte
    paiements = relationship("Paiement", back_populates="facture")
    notifications = relationship("Notification", back_populates="facture")