from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Imports locaux
import models
from database import engine, Base  # Importation cruciale pour le reset
from routers import banks_router, transactions_router

# 1. Création initiale des tables au démarrage
# (Note: create_all ne modifie pas les tables existantes, d'où l'utilité du reset)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Archivage Bancaire API")

# --- SÉCURITÉ CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GESTION DES FICHIERS STATIQUES ---
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- ROUTEUR ADMIN (Reset Database) ---
admin_router = APIRouter(prefix="/admin", tags=["Admin"])

@admin_router.post("/reset-database")
def reset_database():
    """
    ACTION DANGEREUSE : Supprime toutes les tables et les recrée.
    Idéal pour corriger l'erreur 'no such column: nature'.
    """
    try:
        # On ferme les connexions pour éviter les fichiers 'locked' sur SQLite
        engine.dispose()
        
        # Ordre : Supprimer puis Recréer
        models.Base.metadata.drop_all(bind=engine)
        models.Base.metadata.create_all(bind=engine)
        
        return {
            "status": "success", 
            "message": "La base de données a été vidée et recréée avec la nouvelle structure."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du reset : {str(e)}")

# --- INCLUSION DES ROUTERS ---
app.include_router(admin_router) # On inclut le router admin créé plus haut
app.include_router(banks_router.router)
app.include_router(transactions_router.router)

@app.get("/")
def read_root():
    return {
        "status": "Online", 
        "message": "API Archivage Bancaire v1 - Prête pour PostgreSQL et SQLite",
        "docs": "/docs"
    }