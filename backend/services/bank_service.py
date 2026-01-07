from sqlalchemy.orm import Session
import models, schemas
from fastapi import HTTPException

class BankService:
    @staticmethod
    def create_bank(db: Session, bank_data: schemas.BanqueCreate):
        # Vérifier si le RIB existe déjà
        existing = db.query(models.Banque).filter(models.Banque.rib == bank_data.rib).first()
        if existing:
            raise HTTPException(status_code=400, detail="Une banque avec ce RIB existe déjà.")
            
        db_bank = models.Banque(**bank_data.dict())
        db.add(db_bank)
        db.commit()
        db.refresh(db_bank)
        return db_bank

    @staticmethod
    def get_all_banks(db: Session):
        return db.query(models.Banque).all()