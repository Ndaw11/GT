# app/routers/taxes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud import taxe as crud_taxe
from app.schemas import taxe as schemas_taxe
from app.database import get_db

router = APIRouter(prefix="/taxes", tags=["Taxes"])

# ==========================
# 🔹 Liste des taxes avec filtre
# ==========================
@router.get("/")
def list_taxes(filter: str = "active", skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retourne la liste des taxes filtrée par active / inactive / all
    """
    if filter == "all":
        return crud_taxe.get_taxes(db, skip=skip, limit=limit)
    elif filter == "active":
        return [t for t in crud_taxe.get_taxes(db, skip=skip, limit=limit) if t.active]
    elif filter == "inactive":
        return [t for t in crud_taxe.get_taxes(db, skip=skip, limit=limit) if not t.active]
    else:
        raise HTTPException(status_code=400, detail="Filter invalide")


# ==========================
# 🔹 Création d'une taxe
# ==========================
@router.post("/")
def create_taxe(taxe: schemas_taxe.TaxeCreate, db: Session = Depends(get_db)):
    return crud_taxe.create_taxe(db, taxe)


# ==========================
# 🔹 Mise à jour d'une taxe
# ==========================
@router.put("/{taxe_id}")
def update_taxe(taxe_id: int, taxe: schemas_taxe.TaxeCreate, db: Session = Depends(get_db)):
    db_taxe = crud_taxe.get_taxe(db, taxe_id)
    if not db_taxe:
        raise HTTPException(status_code=404, detail="Taxe introuvable")
    return crud_taxe.update_taxe(db, taxe_id, taxe)


# ==========================
# 🔹 Désactiver / Activer une taxe
# ==========================
@router.put("/{taxe_id}/active")
def toggle_taxe(taxe_id: int, active: bool, db: Session = Depends(get_db)):
    db_taxe = crud_taxe.get_taxe(db, taxe_id)
    if not db_taxe:
        raise HTTPException(status_code=404, detail="Taxe introuvable")
    db_taxe.active = active
    db.commit()
    db.refresh(db_taxe)
    return db_taxe


# ==========================
# 🔹 Supprimer une taxe (optionnel, mais attention perte de données)
# ==========================
@router.delete("/{taxe_id}")
def delete_taxe(taxe_id: int, db: Session = Depends(get_db)):
    db_taxe = crud_taxe.get_taxe(db, taxe_id)
    if not db_taxe:
        raise HTTPException(status_code=404, detail="Taxe introuvable")
    return crud_taxe.delete_taxe(db, taxe_id)
