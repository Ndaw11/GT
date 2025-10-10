# app/routers/conducteurs.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional

from app.database import get_db
from app.models.user import User, RoleEnum
from app.models.vehicule import Vehicule
from app.schemas.user import UserResponse

router = APIRouter(prefix="/conducteurs", tags=["conducteurs"])

# Lister tous les conducteurs
@router.get("/", response_model=List[UserResponse])
def list_conducteurs(db: Session = Depends(get_db)):
    conducteurs = (
        db.query(User)
        .options(selectinload(User.vehicules))    # 🔑 charger les véhicules
        .filter(User.role == RoleEnum.conducteur)
        .all()
    )
    return conducteurs


# Chercher un conducteur via l'immatriculation d'un véhicule
@router.get("/search", response_model=UserResponse)
def search_conducteur_by_vehicule(immatriculation: str, db: Session = Depends(get_db)):
    vehicule = db.query(Vehicule).filter(Vehicule.immatriculation == immatriculation).first()
    if not vehicule:
        raise HTTPException(status_code=404, detail="Véhicule non trouvé")
    conducteur = vehicule.conducteur
    if not conducteur:
        raise HTTPException(status_code=404, detail="Conducteur non trouvé pour ce véhicule")
    return conducteur
