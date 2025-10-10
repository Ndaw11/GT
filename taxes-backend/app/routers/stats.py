# Ajoute ces routes (exemples) côté backend (FastAPI).
# Fichier ex : app/routers/stats.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List, Dict
from app.database import get_db
from app.models.facture import Facture
from app.models.paiement import Paiement
from app.models.user import User

router = APIRouter(prefix="/paiements/stats", tags=["PaiementsStats"])

@router.get("/daily")
def payments_daily(
    mois: int = Query(..., ge=1, le=12),
    annee: int = Query(..., ge=2000),
    db: Session = Depends(get_db)
):
    # Retourne liste [{day: 1, total: 1200}, ...]
    rows = (
        db.query(
            func.extract('day', Paiement.datePaiement).label('day'),
            func.sum(Paiement.montant).label('total')
        )
        .filter(
            extract('month', Paiement.datePaiement) == mois,
            extract('year', Paiement.datePaiement) == annee
        )
        .group_by('day')
        .order_by('day')
        .all()
    )
    return [{"day": int(r.day), "total": int(r.total or 0)} for r in rows]


@router.get("/by-tresorier")
def payments_by_tresorier(
    mois: int = Query(..., ge=1, le=12),
    annee: int = Query(..., ge=2000),
    db: Session = Depends(get_db)
):
    # with tresorier (idTresorier not null) vs without (null)
    with_t = db.query(func.sum(Paiement.montant)).filter(
        extract('month', Paiement.datePaiement) == mois,
        extract('year', Paiement.datePaiement) == annee,
        Paiement.idTresorier != None
    ).scalar() or 0

    without_t = db.query(func.sum(Paiement.montant)).filter(
        extract('month', Paiement.datePaiement) == mois,
        extract('year', Paiement.datePaiement) == annee,
        Paiement.idTresorier == None
    ).scalar() or 0

    return {"with_tresorier": int(with_t), "without_tresorier": int(without_t)}


# Roles distribution — utile pour pie chart
@router.get("/roles-count")
def roles_count(db: Session = Depends(get_db)):
    rows = db.query(User.role, func.count(User.id)).group_by(User.role).all()
    return {str(role): int(count) for role, count in rows}


# Optionnel : regroupe et expose factures/stats globales (si non déjà présent)
@router.get("/factures-overview")
def factures_overview(db: Session = Depends(get_db)):
    total_factures = db.query(func.count(Facture.id)).scalar() or 0
    total_payees = db.query(func.count(Facture.id)).filter(Facture.statut == "payee").scalar() or 0
    total_non_payees = db.query(func.count(Facture.id)).filter(Facture.statut == "non_payee").scalar() or 0
    montant_total = db.query(func.sum(Facture.montantDu)).scalar() or 0
    montant_payees = db.query(func.sum(Facture.montantDu)).filter(Facture.statut == "payee").scalar() or 0
    return {
        "total_factures": int(total_factures),
        "total_payees": int(total_payees),
        "total_non_payees": int(total_non_payees),
        "montant_total": int(montant_total),
        "montant_payees": int(montant_payees)
    }
