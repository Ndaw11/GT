# Dans app/models/modele_notification.py

from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from ..database import Base

class TypeNotificationEnum(str, enum.Enum):
    facture_emise = "facture_emise"
    paiement_reussi = "paiement_reussi"
    paiement_echec = "paiement_echec"
    rappel_facture = "rappel_facture"

class ModeleNotification(Base):
    __tablename__ = "modeles_notifications"

    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type_notification = Column(Enum(TypeNotificationEnum), nullable=False, unique=True)
    dateCreation = Column(DateTime, default=datetime.utcnow)

    # Utilise une chaîne de caractères pour éviter l'importation circulaire
    notifications_envoyees = relationship("Notification", back_populates="modele")