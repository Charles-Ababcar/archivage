from fastapi import APIRouter, Depends, Form, File, UploadFile, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from sqlalchemy import func, extract
from fastapi.encoders import jsonable_encoder

import schemas, database, models 
from services.transaction_service import TransactionService

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)

# --- ROUTES DE STATISTIQUES ---

@router.get("/stats/summary")
def get_summary(db: Session = Depends(database.get_db)):
    stats = db.query(
        models.Transaction.type,
        func.sum(models.Transaction.montant).label('total'),
        func.count(models.Transaction.id).label('count')
    ).group_by(models.Transaction.type).all()
    
    entrees = next((s.total for s in stats if s.type == "Entrée"), 0)
    sorties = next((s.total for s in stats if s.type == "Sortie"), 0)
    
    return {
        "total_entrees": entrees,
        "total_sorties": sorties,
        "solde_global": entrees - sorties,
        "nombre_transactions": sum(s.count for s in stats)
    }

@router.get("/stats/monthly-flow")
def get_monthly_flow(db: Session = Depends(database.get_db)):
    stats = db.query(
        extract('month', models.Transaction.date_trans).label('month'),
        models.Transaction.type,
        func.sum(models.Transaction.montant).label('total')
    ).group_by('month', models.Transaction.type).all()
    return [{"month": s.month, "type": s.type, "total": s.total} for s in stats]

@router.get("/stats/bank-distribution")
def get_bank_distribution(db: Session = Depends(database.get_db)):
    dist = db.query(
        models.Banque.nom_banque,
        func.count(models.Transaction.id).label('count'),
        func.sum(models.Transaction.montant).label('total')
    ).join(models.Transaction).group_by(models.Banque.nom_banque).all()
    return [{"banque": d.nom_banque, "count": d.count, "total": d.total} for d in dist]

# --- ROUTES CRUD & NIVELLEMENT ---

from typing import Optional # Assure-toi d'avoir cet import

@router.post("/leveling")
async def add_leveling(
    banque_source_id: int = Form(...),
    banque_source_nom: str = Form(...),
    banque_dest_id: int = Form(...),
    banque_dest_nom: str = Form(...),
    date_trans: str = Form(...),
    libelle: str = Form(...),
    montant: float = Form(...),
    file: Optional[UploadFile] = File(None), # Utilisation explicite de Optional
    db: Session = Depends(database.get_db)
):
    try:
        date_obj = datetime.strptime(date_trans, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Format date invalide")

    # On vérifie si le fichier est vide (certains navigateurs envoient un fichier vide au lieu de rien)
    actual_file = file
    if file and file.filename == "":
        actual_file = None

    leveling_data = {
        "banque_source_id": banque_source_id,
        "banque_source_nom": banque_source_nom,
        "banque_dest_id": banque_dest_id,
        "banque_dest_nom": banque_dest_nom,
        "date_trans": date_obj,
        "libelle": libelle,
        "montant": montant
    }

    # On passe actual_file qui est soit le fichier, soit None
    result = TransactionService.create_leveling(db, leveling_data, actual_file)
    return jsonable_encoder(result)

@router.post("/")
async def add_transaction(
    banque_id: int = Form(...),
    type_trans: str = Form(...), # 'Entrée' ou 'Sortie'
    date_trans: str = Form(...),
    libelle: str = Form(...),
    montant: float = Form(...),
    tiers: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    try:
        date_obj = datetime.strptime(date_trans, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Format date invalide")

    trans_dict = {
        "banque_id": banque_id, 
        "type": type_trans, 
        "libelle": libelle,
        "montant": montant, 
        "tiers": tiers, 
        "date_trans": date_obj
    }
    
    result = TransactionService.create_transaction(db, trans_dict, file)
    return jsonable_encoder(result)

# --- RECHERCHE AVEC FILTRES ET PAGINATION ---

@router.get("/", response_model=schemas.TransactionPagination)
def find_transactions(
    min_m: Optional[float] = Query(None),
    max_m: Optional[float] = Query(None),
    start_date: Optional[str] = Query(None, description="Format: YYYY-MM-DD"), # Nouveau
    end_date: Optional[str] = Query(None, description="Format: YYYY-MM-DD"),   # Nouveau
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=5000),
    db: Session = Depends(database.get_db)
):
    """
    Récupère les transactions avec filtrage par montant et par date.
    Tous les filtres sont optionnels.
    """
    skip = (page - 1) * size
    
    # On passe maintenant les dates au service
    return TransactionService.search_transactions(
        db, 
        min_m=min_m, 
        max_m=max_m, 
        start_date=start_date, 
        end_date=end_date, 
        skip=skip, 
        limit=size
    )

@router.delete("/{t_id}")
def delete_transaction(t_id: int, db: Session = Depends(database.get_db)):
    success = TransactionService.delete_transaction(db, t_id)
    if not success:
        raise HTTPException(status_code=404, detail="Transaction non trouvée")
    return {"status": "success", "message": "Transaction et fichiers supprimés"}