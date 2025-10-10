from sqlalchemy import Column, Integer, String, Date, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class RoleEnum(str, enum.Enum):
    admin = "admin"
    tresorier = "tresorier"
    agent = "agent"
    conducteur = "conducteur"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    prenom = Column(String, nullable=False)
    nom = Column(String, nullable=False)
    dNaissance = Column(Date)
    cni = Column(String, unique=True, index=True, nullable=False)
    tel = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    adresse = Column(String)
    matricule = Column(String, unique=True, index=True, nullable=True)
    role = Column(Enum(RoleEnum), nullable=False)
    dateCreation = Column(DateTime, default=datetime.utcnow)
    hashed_password = Column(String, nullable=False)

    vehicules = relationship("Vehicule", back_populates="conducteur")
    factures = relationship("Facture", back_populates="conducteur")
    notifications = relationship("Notification", back_populates="destinataire")
    paiements_valides = relationship("Paiement", back_populates="tresorier")
