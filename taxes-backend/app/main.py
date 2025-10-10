from fastapi import FastAPI
from .database import Base, engine
from .routers import users, taxes, factures,facture_generation, modele_notification as modele_notif_router,paiements,auth, conducteurs
from .models import user, vehicule, taxe, facture, paiement, notification, transaction_mobile, webhook_log, modele_notification as modele_notif_model
from .schemas import taxe as taxe_schema, facture as facture_schema, notification as notif_schema, paiement as paiement_schema, transaction_mobile as trans_schema, webhook_log as webhook_schema, modele_notification as modele_notif_schema
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ton domaine exact
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users.router)
app.include_router(taxes.router) 
app.include_router(facture_generation.router) 
app.include_router(modele_notif_router.router)
app.include_router(factures.router)
app.include_router(paiements.router)
app.include_router(auth.router)
app.include_router(conducteurs.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API de gestion des taxes"}