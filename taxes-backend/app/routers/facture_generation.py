from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app import models, crud  # tes imports habituels

router = APIRouter(prefix="/generate-factures", tags=["Facture Generation"])

@router.post("/{taxe_id}")
def generate_factures(taxe_id: int, db: Session = Depends(get_db)):
    taxe = db.query(models.Taxe).filter(models.Taxe.id == taxe_id, models.Taxe.active == True).first()
    if not taxe:
        raise HTTPException(status_code=404, detail="Taxe introuvable")

    # Cherche tous les conducteurs avec au moins un véhicule de type "Moto"
    conducteurs = (
        db.query(models.User)
        .join(models.Vehicule)
        .filter(models.User.role == models.RoleEnum.conducteur,
                models.Vehicule.type.ilike("moto"))
        .all()
    )

    modele_notif = db.query(models.ModeleNotification)\
                     .filter(models.ModeleNotification.type_notification == models.TypeNotificationEnum.facture_emise)\
                     .first()
    if not modele_notif:
        raise HTTPException(status_code=400, detail="Modele de notification 'facture_emise' manquant")

    factures_creees = []

    for cond in conducteurs:
        for vehicule in cond.vehicules:
            if vehicule.type.lower() == "moto":
                facture = models.Facture(
                    periode=f"{date.today():%Y-%m}",
                    montantDu=taxe.montant,
                    dateEmission=date.today(),
                    dateEcheance=date.today().replace(day=26),
                    idConducteur=cond.id,
                    idTaxe=taxe.id,
                    idVehicule=vehicule.id
                )
                db.add(facture)
                db.flush()  # pour obtenir l’ID avant la notification

                notif = models.Notification(
                    titre=modele_notif.titre,
                    message=modele_notif.message.format(
                        prenom=cond.prenom,
                        nom=cond.nom,
                        montant=facture.montantDu,
                        periode=facture.periode
                    ),
                    destinataire_id=cond.id,
                    idFacture=facture.id,
                    idModele=modele_notif.id
                )
                db.add(notif)
                factures_creees.append(facture)

    db.commit()
    return {"total_factures": len(factures_creees)}
