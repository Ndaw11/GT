# Dans app/crud/user.py

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ..models import user as models_user, vehicule as models_vehicule
from ..schemas import user as schemas_user
from ..models.user import RoleEnum
# En haut de crud/user.py
from app.core.security import hash_password


def create_user(db: Session, user: schemas_user.UserCreate):
    """
    Crée un utilisateur et ses véhicules si le rôle est 'conducteur'.
    """
    # Génération du matricule
    role_prefix = user.role.value[0].upper()
    prenom_initial = user.prenom[0].upper()
    nom_initial = user.nom[0].upper()
    cni_suffix = user.cni[-4:]  # prend les 4 derniers chiffres du CNI
    generated_matricule = f"{role_prefix}{prenom_initial}{nom_initial}{cni_suffix}".upper()

    # Hash du mot de passe
    hashed_pwd = hash_password(user.password)

    # Création de l'objet User avec hashed_password
    db_user = models_user.User(
        prenom=user.prenom,
        nom=user.nom,
        dNaissance=user.dNaissance,
        cni=user.cni,
        tel=user.tel,
        email=user.email,
        adresse=user.adresse,
        role=user.role,
        matricule=generated_matricule,
        hashed_password=hashed_pwd  # <- ajouté ici
    )
    
    db.add(db_user)

    # Si l'utilisateur est un conducteur, on crée ses véhicules
    if user.role == RoleEnum.conducteur:
        for vehicule_data in user.vehicules:
            db_vehicule = models_vehicule.Vehicule(**vehicule_data.dict(), conducteur=db_user)
            db.add(db_vehicule)

    # Commit avec gestion des erreurs
    try:
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        db.rollback()
        raise ValueError("Un utilisateur avec ce CNI, email, téléphone ou matricule existe déjà.")
    
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models_user.User).filter(models_user.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models_user.User).filter(models_user.User.id == user_id).first()