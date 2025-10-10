from pydantic import BaseModel, Field, EmailStr, root_validator
from datetime import date, datetime
from typing import Optional, List
from ..models.user import RoleEnum
from .vehicule import VehiculeCreate, VehiculeResponse


class UserBase(BaseModel):
    prenom: str
    nom: str
    dNaissance: Optional[date] = None
    cni: str
    tel: str
    email: EmailStr
    adresse: Optional[str] = None
    role: RoleEnum


class UserCreate(UserBase):
    password: str                                           # mot de passe en clair
    vehicules: Optional[List[VehiculeCreate]] = Field(default_factory=list)

    @root_validator(pre=True)
    def check_vehicule_for_conducteur(cls, values):
        if values.get("role") == RoleEnum.conducteur and not values.get("vehicules"):
            raise ValueError("Le rôle 'conducteur' nécessite au moins un véhicule.")
        return values


class UserUpdate(BaseModel):
    prenom: Optional[str] = None
    nom: Optional[str] = None
    dNaissance: Optional[date] = None
    tel: Optional[str] = None
    email: Optional[EmailStr] = None
    adresse: Optional[str] = None
    role: Optional[RoleEnum] = None
    # ⚠️ Pas de matricule ni de CNI modifiables (identifiants stables)
    # ⚠️ Mot de passe géré via une route spécifique (ex: /users/{id}/password)


class UserResponse(UserBase):
    id: int
    matricule: Optional[str] = None
    dateCreation: datetime
    vehicules: Optional[List[VehiculeResponse]] = None

    class Config:
        from_attributes = True
