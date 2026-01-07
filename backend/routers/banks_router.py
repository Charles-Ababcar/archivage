from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

# On importe depuis les fichiers à la racine du dossier backend
import schemas, database
# On importe le service spécifique depuis le package services
from services.bank_service import BankService 

router = APIRouter(
    prefix="/banques",
    tags=["Banques"]
)

@router.post("/", response_model=schemas.Banque)
def create_bank(bank: schemas.BanqueCreate, db: Session = Depends(database.get_db)):
    return BankService.create_bank(db, bank)

@router.get("/", response_model=List[schemas.Banque])
def list_banks(db: Session = Depends(database.get_db)):
    return BankService.get_all_banks(db)