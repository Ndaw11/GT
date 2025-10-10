# Dans app/crud/taxe.py

from sqlalchemy.orm import Session
from ..models import taxe as models_taxe
from ..schemas import taxe as schemas_taxe
from typing import List, Optional

def get_taxe(db: Session, taxe_id: int):
    """
    Récupère une taxe par son ID.
    """
    return db.query(models_taxe.Taxe).filter(models_taxe.Taxe.id == taxe_id).first()

def get_taxes(db: Session, skip: int = 0, limit: int = 100):
    """
    Récupère une liste de toutes les taxes.
    """
    return db.query(models_taxe.Taxe).offset(skip).limit(limit).all()

def create_taxe(db: Session, taxe: schemas_taxe.TaxeCreate):
    """
    Crée une nouvelle taxe dans la base de données.
    """
    db_taxe = models_taxe.Taxe(**taxe.model_dump())
    db.add(db_taxe)
    db.commit()
    db.refresh(db_taxe)
    return db_taxe

def update_taxe(db: Session, taxe_id: int, taxe_update: schemas_taxe.TaxeCreate):
    """
    Met à jour les informations d'une taxe existante.
    """
    db_taxe = get_taxe(db, taxe_id)
    if db_taxe:
        for key, value in taxe_update.model_dump(exclude_unset=True).items():
            setattr(db_taxe, key, value)
        db.commit()
        db.refresh(db_taxe)
    return db_taxe

def delete_taxe(db: Session, taxe_id: int):
    """
    Supprime une taxe de la base de données.
    """
    db_taxe = get_taxe(db, taxe_id)
    if db_taxe:
        db.delete(db_taxe)
        db.commit()
        return {"message": "Taxe supprimée avec succès"}
    return None

def deactivate_taxe(db: Session, taxe_id: int):
    db_taxe = get_taxe(db, taxe_id)
    if db_taxe:
        db_taxe.active = False
        db.commit()
        db.refresh(db_taxe)
    return db_taxe