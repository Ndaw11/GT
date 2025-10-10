from sqlalchemy.orm import Session
from app import models, schemas

def create_modele_notification(db: Session, data: schemas.ModeleNotificationCreate):
    modele = models.ModeleNotification(**data.dict())
    db.add(modele)
    db.commit()
    db.refresh(modele)
    return modele

def get_modele_by_type(db: Session, type_notification: models.TypeNotificationEnum):
    return db.query(models.ModeleNotification).filter_by(type_notification=type_notification).first()

def list_modeles_notifications(db: Session):
    return db.query(models.ModeleNotification).all()

def update_modele_notification(db: Session, modele_id: int, data: schemas.ModeleNotificationUpdate):
    modele = db.query(models.ModeleNotification).filter(models.ModeleNotification.id == modele_id).first()
    if not modele:
        return None
    
    if data.titre is not None:
        modele.titre = data.titre
    if data.message is not None:
        modele.message = data.message
    if data.type_notification is not None:
        modele.type_notification = data.type_notification

    db.commit()
    db.refresh(modele)
    return modele