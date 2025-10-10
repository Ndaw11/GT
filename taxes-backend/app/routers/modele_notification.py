from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/modeles-notifications", tags=["ModeleNotification"])

@router.post("/", response_model=schemas.ModeleNotificationResponse)
def create_modele_notification(
    data: schemas.ModeleNotificationCreate,
    db: Session = Depends(get_db)
):
    return crud.create_modele_notification(db, data)

@router.get("/", response_model=list[schemas.ModeleNotificationResponse])
def list_modeles_notifications(db: Session = Depends(get_db)):
    return crud.list_modeles_notifications(db)


@router.put("/{modele_id}", response_model=schemas.ModeleNotificationResponse)
def update_modele_notification(
    modele_id: int,
    data: schemas.ModeleNotificationUpdate,
    db: Session = Depends(get_db)
):
    modele = crud.update_modele_notification(db, modele_id, data)
    if not modele:
        raise HTTPException(status_code=404, detail="Modèle de notification introuvable")
    return modele