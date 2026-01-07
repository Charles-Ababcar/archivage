from pydantic import BaseModel
from datetime import date
from typing import Optional, List

class BanqueBase(BaseModel):
    rib: str
    nom_banque: str

class BanqueCreate(BanqueBase):
    pass

class Banque(BanqueBase):
    id: int
    class Config:
          from_attributes = True

class TransactionBase(BaseModel):
    type: str
    date_trans: date
    libelle: str
    montant: float
    tiers: str
    banque_id: int
    banque: Optional[BanqueBase]

class Transaction(TransactionBase):
    id: int
    pdf_path: Optional[str] = None
    class Config:
          from_attributes = True
                  