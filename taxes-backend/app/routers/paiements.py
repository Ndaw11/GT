

from fastapi import Header
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from sqlalchemy.sql.functions import user
from app.database import get_db
from app.models.facture import Facture
from app.models.paiement import Paiement
from app.models.transaction_mobile import TransactionMobile
from app.models.notification import Notification
from sqlalchemy import func, extract
from app.models.modele_notification import ModeleNotification, TypeNotificationEnum

router = APIRouter(prefix="/paiements", tags=["Paiements"])

@router.post("/payer/{facture_id}")
def payer_facture(
    facture_id: int,
    db: Session = Depends(get_db),
    x_user_id: int = Header(...),  # ID du user envoyé depuis le front (ou extrait du token JWT)
):
    # Vérifier la facture
    facture = db.query(Facture).filter(Facture.id == facture_id).first()
    if not facture:
        raise HTTPException(status_code=404, detail="Facture introuvable")

    # Vérifier que le conducteur correspond
    if facture.idConducteur != x_user_id:
        raise HTTPException(status_code=403, detail="Accès refusé à cette facture")

    if facture.statut == "payee":
        raise HTTPException(status_code=400, detail="Facture déjà payée")

    # Création du paiement comme tu l'avais
    paiement = Paiement(
        idFacture=facture.id,
        montant=facture.montantDu,
        moyen="simulation",
        reference=f"SIM-{datetime.utcnow().timestamp()}",
        statut="valide"
    )
    db.add(paiement)

    transaction = TransactionMobile(
        idFacture=facture.id,
        idPaiement=None,
        operateur="simulation",
        referenceOperateur="sim-ref",
        montant=facture.montantDu,
        statutOperateur="SUCCES"
    )
    db.add(transaction)
    db.flush()
    transaction.idPaiement = paiement.id

    facture.statut = "payee"

    # Notification
    modele = db.query(ModeleNotification).filter(
        ModeleNotification.type_notification == TypeNotificationEnum.paiement_reussi
    ).first()
    if modele:
        notif = Notification(
            titre=modele.titre,
            message=modele.message,
            destinataire_id=facture.idConducteur,
            idFacture=facture.id,
            idModele=modele.id,
        )
        db.add(notif)

    db.commit()
    db.refresh(paiement)

    return {
        "message": "Paiement simulé avec succès",
        "facture_id": facture.id,
        "paiement_id": paiement.id,
        "statut_facture": facture.statut
    }


@router.post("/payer_par_tresorier/{facture_id}")
def payer_facture_par_tresorier(
    facture_id: int,
    db: Session = Depends(get_db),
    x_tresorier_id: str = Header(..., alias="x-tresorier-id"),  # ✅ Accepte string
):
    # Convertir en int
    try:
        tresorier_id = int(x_tresorier_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="ID trésorier invalide")

    # Vérifier la facture
    facture = db.query(Facture).filter(Facture.id == facture_id).first()
    if not facture:
        raise HTTPException(status_code=404, detail="Facture introuvable")

    if facture.statut == "payee":
        raise HTTPException(status_code=400, detail="Facture déjà payée")

    # Création du paiement
    paiement = Paiement(
        idFacture=facture.id,
        montant=facture.montantDu,
        moyen="tresorier",
        reference=f"TRES-{datetime.utcnow().timestamp()}",
        statut="valide",
        idTresorier=tresorier_id,
    )
    db.add(paiement)

    # Mettre à jour le statut de la facture
    facture.statut = "payee"

    db.commit()

    return {
        "message": "Paiement effectué avec succès",
        "facture_id": facture.id,
        "paiement_id": paiement.id,
    }

    
@router.get("/stats/daily")
def get_paiements_daily(mois: int, annee: int, db: Session = Depends(get_db)):
    try:
        results = (
            db.query(
                extract('day', Paiement.datePaiement).label("day"),
                func.sum(Paiement.montant).label("total")
            )
            .filter(extract('month', Paiement.datePaiement) == mois)
            .filter(extract('year', Paiement.datePaiement) == annee)
            .group_by(extract('day', Paiement.datePaiement))
            .order_by("day")
            .all()
        )

        return [{"day": int(r.day), "total": float(r.total)} for r in results]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/stats/by-tresorier")
def get_paiements_by_tresorier(mois: int, annee: int, db: Session = Depends(get_db)):
    """
    Retourne le total des paiements faits avec ou sans trésorier
    Format attendu :
    {
      "with_tresorier": 12345,
      "without_tresorier": 6789
    }
    """
    # Paiements avec trésorier
    with_tresorier = (
        db.query(func.sum(Paiement.montant))
        .filter(Paiement.idTresorier.isnot(None))
        .filter(func.extract('month', Paiement.datePaiement) == mois)
        .filter(func.extract('year', Paiement.datePaiement) == annee)
        .scalar()
    ) or 0

    # Paiements sans trésorier
    without_tresorier = (
        db.query(func.sum(Paiement.montant))
        .filter(Paiement.idTresorier.is_(None))
        .filter(func.extract('month', Paiement.datePaiement) == mois)
        .filter(func.extract('year', Paiement.datePaiement) == annee)
        .scalar()
    ) or 0

    return {
        "with_tresorier": float(with_tresorier),
        "without_tresorier": float(without_tresorier)
    }

@router.post("/payer-tresorier/{facture_id}")
def payer_facture_tresorier(facture_id: int, tresorier_id: int, db: Session = Depends(get_db)):
    facture = db.query(Facture).filter(Facture.id == facture_id).first()
    if not facture:
        raise HTTPException(status_code=404, detail="Facture introuvable")

    if facture.statut == "payee":
        raise HTTPException(status_code=400, detail="Facture déjà payée")

    tresorier = db.query(user).filter(user.id == tresorier_id).first()
    if not tresorier or tresorier.role != "tresorier":
        raise HTTPException(status_code=403, detail="Non autorisé")

    paiement = Paiement(
        idFacture=facture.id,
        montant=facture.montantDu,
        moyen="tresorier",
        reference=f"TRES-{datetime.utcnow().timestamp()}",
        statut="valide",
        idTresorier=tresorier.id
    )

    facture.statut = "payee"
    db.add(paiement)
    db.commit()
    db.refresh(paiement)

    return {"message": "Paiement effectué avec succès", "paiement": paiement}