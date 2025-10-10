# Dans app/models/notification.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base
from .modele_notification import ModeleNotification # Cette importation est correcte

class Notification(Base):
    __tablename__ = "notifications_envoyees"

    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    message = Column(String, nullable=False)
    dateEnvoi = Column(DateTime, default=datetime.utcnow)
    
    destinataire_id = Column(Integer, ForeignKey("users.id"))
    idFacture = Column(Integer, ForeignKey("factures.id"))
    idModele = Column(Integer, ForeignKey("modeles_notifications.id"))

    # Relations
    destinataire = relationship("User", back_populates="notifications")
    facture = relationship("Facture", back_populates="notifications")
    modele = relationship("ModeleNotification", back_populates="notifications_envoyees")