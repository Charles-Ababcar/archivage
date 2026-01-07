from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # Import important pour les PDF
import models, database
from routers import banks_router, transactions_router
import os

# Création des tables en base de données
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Archivage Bancaire API")

# --- SÉCURITÉ CORS ---
# Indispensable pour que ton Frontend React (souvent sur le port 5173) 
# puisse communiquer avec ton Backend (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GESTION DES FICHIERS STATIQUES ---
# Cette ligne permet d'accéder aux PDF via : http://localhost:8000/uploads/nom_du_fichier.pdf
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- INCLUSION DES ROUTERS ---
app.include_router(banks_router.router)
app.include_router(transactions_router.router)

@app.get("/")
def read_root():
    return {
        "status": "Online", 
        "message": "API Archivage Bancaire v1",
        "docs": "/docs"
    }