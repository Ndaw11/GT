# Dans app/crud/facture.py

from sqlalchemy.orm import Session
from ..models import facture as models_facture, user as models_user
from ..schemas import facture as schemas_facture

def get_facture(db: Session, facture_id: int):
    return db.query(models_facture.Facture).filter(models_facture.Facture.id == facture_id).first()

def get_factures(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models_facture.Facture).offset(skip).limit(limit).all()

def get_factures_by_user(db: Session, user_id: int):
    return db.query(models_facture.Facture).filter(models_facture.Facture.idConducteur == user_id).all()

def create_facture(db: Session, facture: schemas_facture.FactureCreate):
    db_facture = models_facture.Facture(**facture.model_dump())
    db.add(db_facture)
    db.commit()
    db.refresh(db_facture)
    return db_facture