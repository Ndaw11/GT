
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.facture import Facture
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from sqlalchemy import extract,func
from app.database import get_db
from app.models.facture import Facture
from app.models.user import User
from app.schemas.facture import FactureResponse
from app.models.vehicule import Vehicule

router = APIRouter(prefix="/factures", tags=["Factures"])

@router.get("/conducteur/{user_id}")
def factures_conducteur(user_id: int, db: Session = Depends(get_db)):
    # Vérifier que le conducteur existe
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Conducteur introuvable")

    factures = db.query(Facture).filter(Facture.idConducteur == user_id).all()

    return {
        "conducteur": f"{user.prenom} {user.nom}",
        "nombre_factures": len(factures),
        "factures": [
            {
                "id": f.id,
                "periode": f.periode,
                "montantDu": f.montantDu,
                "dateEmission": f.dateEmission,
                "statut": f.statut,
                "immatriculation": f.vehicule.immatriculation if f.vehicule else None,
                "type_vehicule": f.vehicule.type if f.vehicule else None,
                "modele_vehicule": f.vehicule.marque if f.vehicule else None,
                "annee_vehicule": f.vehicule.annee if f.vehicule else None,
                "conducteur_prenom": f.conducteur.prenom if f.conducteur else None,
                "conducteur_nom": f.conducteur.nom if f.conducteur else None,
            }
            for f in factures
        ],
    }



    # Vérifier que le conducteur existe
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Conducteur introuvable")

    factures = (
        db.query(Facture)
        .filter(Facture.idConducteur == user_id)
        .all()
    )

    return {
        "conducteur": f"{user.prenom} {user.nom}",
        "nombre_factures": len(factures),
        "factures": [
            {
                "id": f.id,
                "periode": f.periode,
                "montantDu": f.montantDu,
                "dateEmission": f.dateEmission,
                "statut": f.statut,
                # ✅ Ajouts demandés
                "immatriculation": f.vehicule.immatriculation if f.vehicule else None,
                "conducteur_prenom": f.conducteur.prenom if f.conducteur else None,
                "conducteur_nom": f.conducteur.nom if f.conducteur else None,
            }
            for f in factures
        ],
    }

# --- Factures payées ou non payées d’un conducteur
@router.get("/conducteur/{user_id}/statut", response_model=List[FactureResponse])
def factures_conducteur_par_statut(
    user_id: int,
    statut: str = Query(..., regex="^(payee|non_payee)$"),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Conducteur introuvable")
    factures = db.query(Facture).filter(
        Facture.idConducteur == user_id,
        Facture.statut == statut
    ).all()
    return factures

# --- Filtrer par mois et année
@router.get("/conducteur/{user_id}/par-mois", response_model=List[FactureResponse])
def factures_conducteur_par_mois(
    user_id: int,
    mois: int = Query(..., ge=1, le=12),
    annee: int = Query(..., ge=2000),
    statut: Optional[str] = Query(None, regex="^(payee|non_payee)$"),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Conducteur introuvable")

    query = db.query(Facture).filter(
        Facture.idConducteur == user_id,
        Facture.dateEmission != None,
        extract('month', Facture.dateEmission) == mois,
        extract('year', Facture.dateEmission) == annee
    )

    if statut:
        query = query.filter(Facture.statut == statut)
    
    return query.all()

# --- Stats : nombre total de factures payées et non payées
@router.get("/conducteur/{user_id}/stats")
def stats_factures_conducteur(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Conducteur introuvable")

    total_payees = db.query(Facture).filter(Facture.idConducteur == user_id, Facture.statut == "payee").count()
    total_non_payees = db.query(Facture).filter(Facture.idConducteur == user_id, Facture.statut == "non_payee").count()

    return {
        "conducteur": f"{user.prenom} {user.nom}",
        "total_payees": total_payees,
        "total_non_payees": total_non_payees
    }

    # 1️⃣ Lister toutes les factures
@router.get("/", response_model=List[FactureResponse])
def list_all_factures(db: Session = Depends(get_db)):
    factures = db.query(Facture).all()
    return factures

# 2️⃣ Lister les factures payées
@router.get("/payees", response_model=List[FactureResponse])
def list_factures_payees(db: Session = Depends(get_db)):
    factures = db.query(Facture).filter(Facture.statut == "payee").all()
    return factures

# 3️⃣ Lister les factures non payées
@router.get("/non-payees", response_model=List[FactureResponse])
def list_factures_non_payees(db: Session = Depends(get_db)):
    factures = db.query(Facture).filter(Facture.statut == "non_payee").all()
    return factures

# 4️⃣ Filtrer par mois et année et statut optionnel
@router.get("/par-mois", response_model=List[FactureResponse])
def factures_par_mois(
    mois: int = Query(..., ge=1, le=12),
    annee: int = Query(..., ge=2000),
    statut: Optional[str] = Query(None, regex="^(payee|non_payee)$"),
    db: Session = Depends(get_db)
):
    query = db.query(Facture).filter(
        Facture.dateEmission != None,
        extract('month', Facture.dateEmission) == mois,
        extract('year', Facture.dateEmission) == annee
    )
    if statut:
        query = query.filter(Facture.statut == statut)
    return query.all()

# 5️⃣ Statistiques globales
@router.get("/stats")
def factures_stats(
    db: Session = Depends(get_db)
):
    total_factures = db.query(func.count(Facture.id)).scalar()
    total_payees = db.query(func.count(Facture.id)).filter(Facture.statut == "payee").scalar()
    total_non_payees = db.query(func.count(Facture.id)).filter(Facture.statut == "non_payee").scalar()

    montant_total = db.query(func.sum(Facture.montantDu)).scalar() or 0
    montant_payees = db.query(func.sum(Facture.montantDu)).filter(Facture.statut == "payee").scalar() or 0
    montant_non_payees = db.query(func.sum(Facture.montantDu)).filter(Facture.statut == "non_payee").scalar() or 0

    return {
        "total_factures": total_factures,
        "total_payees": total_payees,
        "total_non_payees": total_non_payees,
        "montant_total": montant_total,
        "montant_payees": montant_payees,
        "montant_non_payees": montant_non_payees
    }


@router.get("/conducteur/{conducteur_id}", response_model=List[FactureResponse])
def get_factures_by_conducteur(conducteur_id: int, db: Session = Depends(get_db)):
    factures = db.query(Facture).filter(Facture.idConducteur == conducteur_id).all()
    if not factures:
        return []
    return factures

@router.get("/vehicule/{immatricule}")
def get_factures_by_vehicule(immatricule: str, db: Session = Depends(get_db)):
    # Vérifier si le véhicule existe
    vehicule = db.query(Vehicule).filter(Vehicule.immatriculation == immatricule).first()
    if not vehicule:
        raise HTTPException(
            status_code=404,
            detail=f"Véhicule avec l'immatriculation {immatricule} introuvable"
        )

    # Récupérer les factures liées à ce véhicule
    factures = db.query(Facture).filter(Facture.idVehicule == vehicule.id).all()
    if not factures:
        raise HTTPException(
            status_code=404,
            detail=f"Aucune facture trouvée pour le véhicule {immatricule}"
        )

    return [
        {
            "id": f.id,
            "periode": f.periode,
            "montantDu": f.montantDu,
            "dateEmission": f.dateEmission,
            "statut": f.statut,
            "conducteur": f"{f.conducteur.prenom} {f.conducteur.nom}" if f.conducteur else None,
            "vehicule": vehicule.immatriculation,
        }
        for f in factures
    ]