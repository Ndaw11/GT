
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import func

from app.database import get_db
from app.models.user import User
from app.models.vehicule import Vehicule
from app.schemas.user import UserCreate, UserUpdate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])

# -------- LISTE DES UTILISATEURS --------
@router.get("/", response_model=List[UserResponse])
def list_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(User).offset(skip).limit(limit).all()


# -------- RECHERCHE UTILISATEURS --------
@router.get("/search", response_model=List[UserResponse])
def search_users(
    matricule: Optional[str] = None,
    immatriculation: Optional[str] = None,
    nom: Optional[str] = None,
    prenom: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(User)

    if matricule:
        query = query.filter(User.matricule.ilike(f"%{matricule}%"))
    if nom:
        query = query.filter(User.nom.ilike(f"%{nom}%"))
    if prenom:
        query = query.filter(User.prenom.ilike(f"%{prenom}%"))
    if immatriculation:
        query = query.join(User.vehicules).filter(Vehicule.immatriculation.ilike(f"%{immatriculation}%"))

    users = query.all()
    if not users:
        raise HTTPException(status_code=404, detail="Aucun utilisateur trouvé")
    return users


# -------- MODIFIER UN UTILISATEUR --------
@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/stats/roles")
def get_users_roles_stats(db: Session = Depends(get_db)):
    """
    Retourne la distribution des rôles des utilisateurs.
    Format attendu :
    {
      "admin": 2,
      "tresorier": 3,
      "agent": 10,
      "conducteur": 5
    }
    """
    results = db.query(User.role, func.count(User.id)).group_by(User.role).all()

    stats = {role: count for role, count in results}

    return {
        "admin": stats.get("admin", 0),
        "tresorier": stats.get("tresorier", 0),
        "agent": stats.get("agent", 0),
        "conducteur": stats.get("conducteur", 0)
    }
