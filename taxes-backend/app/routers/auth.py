from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.vehicule import Vehicule
from app.schemas.user import UserCreate, UserResponse
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

from random import randint
from sqlalchemy.exc import IntegrityError

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Vérifie email et téléphone
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    if db.query(User).filter(User.tel == user.tel).first():
        raise HTTPException(status_code=400, detail="Téléphone déjà utilisé")

    # Fonction pour générer un matricule unique
    def generate_unique_matricule(role, prenom, nom, cni):
        prenom_initial = prenom[0].upper()
        nom_initial = nom[0].upper()

        
        role_prefix = role[0].upper()
        cni_suffix = cni[-4:] if cni else str(randint(1000, 9999))
        matricule = f"{role_prefix}{prenom_initial}{nom_initial}{cni_suffix}".upper()
        

        # Vérifie unicité et régénère si besoin
        while db.query(User).filter(User.matricule == matricule).first():
            if role == "conducteur":
                cni_suffix = str(randint(1000, 9999))
                matricule = f"{role_prefix}{prenom_initial}{nom_initial}{cni_suffix}"
            else:
                matricule = f"{prenom_initial}{nom_initial}{randint(1000, 9999)}"
        return matricule

    # Génère le matricule
    generated_matricule = generate_unique_matricule(user.role, user.prenom, user.nom, user.cni)

    # Création de l'utilisateur
    db_user = User(
        prenom=user.prenom,
        nom=user.nom,
        dNaissance=user.dNaissance,
        cni=user.cni,
        tel=user.tel,
        email=user.email,
        adresse=user.adresse,
        role=user.role,
        hashed_password=hash_password(user.password),
        matricule=generated_matricule
    )
    db.add(db_user)

    # Création des véhicules si conducteur
    if user.role == "conducteur" and user.vehicules:
        for v in user.vehicules:
            vehicule = Vehicule(
                immatriculation=v.immatriculation,
                type=v.type,
                marque=v.marque,
                annee=v.annee,
                conducteur=db_user
            )
            db.add(vehicule)

    # Commit avec gestion d'erreurs
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erreur lors de la création de l'utilisateur")

    db.refresh(db_user)
    return db_user


    # Vérifie email et téléphone
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    if db.query(User).filter(User.tel == user.tel).first():
        raise HTTPException(status_code=400, detail="Téléphone déjà utilisé")

    # Génération du matricule
    def generate_unique_matricule(role, prenom, nom, cni):
        if role == "conducteur":
            # Format conducteur : C+initiales+CNI
            role_prefix = role[0].upper()
            prenom_initial = prenom[0].upper()
            nom_initial = nom[0].upper()
            cni_suffix = cni[-4:] if cni else "0000"
            matricule = f"{role_prefix}{prenom_initial}{nom_initial}{cni_suffix}".upper()
        else:
            # Pour les autres : format simple avec initiales + nombre aléatoire
            prenom_initial = prenom[0].upper()
            nom_initial = nom[0].upper()
            matricule = f"{prenom_initial}{nom_initial}{randint(1000, 9999)}"
        
        # Vérifie unicité
        while db.query(User).filter(User.matricule == matricule).first():
            if role == "conducteur":
                cni_suffix = str(randint(1000, 9999))
                matricule = f"{role_prefix}{prenom_initial}{nom_initial}{cni_suffix}"
            else:
                matricule = f"{prenom_initial}{nom_initial}{randint(1000, 9999)}"
        return matricule

    generated_matricule = generate_unique_matricule(user.role, user.prenom, user.nom, user.cni)

    # Création de l'utilisateur
    db_user = User(
        prenom=user.prenom,
        nom=user.nom,
        dNaissance=user.dNaissance,
        cni=user.cni,
        tel=user.tel,
        email=user.email,
        adresse=user.adresse,
        role=user.role,
        hashed_password=hash_password(user.password),
        matricule=generated_matricule
    )
    db.add(db_user)

    # Création des véhicules si conducteur
    if user.role == "conducteur" and user.vehicules:
        for v in user.vehicules:
            vehicule = Vehicule(
                immatriculation=v.immatriculation,
                type=v.type,
                marque=v.marque,
                annee=v.annee,
                conducteur=db_user
            )
            db.add(vehicule)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erreur lors de la création de l'utilisateur")

    db.refresh(db_user)
    return db_user


# @router.post("/login")
# def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.email == form_data.username).first()
#     if not user or not verify_password(form_data.password, user.hashed_password):
#         raise HTTPException(status_code=401, detail="Identifiants invalides")
#     token = create_access_token({"sub": str(user.id)})
#     return {
#         "access_token": token,
#         "token_type": "bearer",
#         "role": user.role,
#         "user_id": user.id  # <- rôle ajouté
#     }

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "prenom": user.prenom,       # ✅ ajouté
        "nom": user.nom              # ✅ ajouté
    }
