from fastapi import APIRouter, Depends, Form, File, UploadFile, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from sqlalchemy import func, extract
from fastapi.encoders import jsonable_encoder

import schemas, database, models # Import de models ajouté
from services.transaction_service import TransactionService

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)

# --- ROUTES DE STATISTIQUES (Placées avant les routes dynamiques) ---

@router.get("/stats/summary")
def get_summary(db: Session = Depends(database.get_db)):
    # Calcul direct en SQL pour la performance
    stats = db.query(
        models.Transaction.type,
        func.sum(models.Transaction.montant).label('total'),
        func.count(models.Transaction.id).label('count')
    ).group_by(models.Transaction.type).all()
    
    entrees = next((s.total for s in stats if s.type == "Entrée"), 0)
    sorties = next((s.total for s in stats if s.type == "Sortie"), 0)
    nombre = sum(s.count for s in stats)
    
    return {
        "total_entrees": entrees,
        "total_sorties": sorties,
        "solde_global": entrees - sorties,
        "nombre_transactions": nombre
    }

@router.get("/stats/monthly-flow")
def get_monthly_flow(db: Session = Depends(database.get_db)):
    # On groupe par mois et par type
    stats = db.query(
        extract('month', models.Transaction.date_trans).label('month'),
        models.Transaction.type,
        func.sum(models.Transaction.montant).label('total')
    ).group_by('month', models.Transaction.type).all()
    
    # Transformation en dictionnaire lisible pour le frontend
    return [{"month": s.month, "type": s.type, "total": s.total} for s in stats]

@router.get("/stats/bank-distribution")
def get_bank_distribution(db: Session = Depends(database.get_db)):
    dist = db.query(
        models.Banque.nom_banque,
        func.count(models.Transaction.id).label('count'),
        func.sum(models.Transaction.montant).label('total')
    ).join(models.Transaction).group_by(models.Banque.nom_banque).all()
    
    return [{"banque": d.nom_banque, "count": d.count, "total": d.total} for d in dist]

# --- ROUTES CRUD ---

@router.get("/", response_model=List[schemas.Transaction])
def find_transactions(
    min_m: Optional[float] = Query(None),
    max_m: Optional[float] = Query(None),
    db: Session = Depends(database.get_db)
):
    return TransactionService.search_transactions(db, min_m, max_m)

@router.post("/")
async def add_transaction(
    banque_id: int = Form(...),
    type_trans: str = Form(...),
    date_trans: str = Form(...),
    libelle: str = Form(...),
    montant: float = Form(...),
    tiers: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    # Conversion date
    try:
        date_obj = datetime.strptime(date_trans, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Format date invalide (YYYY-MM-DD)")

    trans_dict = {
        "banque_id": banque_id, 
        "type": type_trans, 
        "libelle": libelle,
        "montant": montant, 
        "tiers": tiers, 
        "date_trans": date_obj
    }
    
    # Appel au service
    result = TransactionService.create_transaction(db, trans_dict, file)
    
    # Sécurisation de la réponse pour le Frontend
    return jsonable_encoder(result)

@router.delete("/{t_id}")
def delete_transaction(t_id: int, db: Session = Depends(database.get_db)):
    success = TransactionService.delete_transaction(db, t_id)
    if not success:
        raise HTTPException(status_code=404, detail="Transaction non trouvée")
    return {"status": "success", "message": "Transaction supprimée"}