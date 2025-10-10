# app/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()  # Charge le fichier .env

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ✅ Ajoute ceci :
def get_db():
    """
    Fournit une session de base de données à chaque requête FastAPI.
    Utilisation : Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
