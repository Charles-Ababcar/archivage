from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional, List

# --- SCHÉMAS POUR LA BANQUE ---
class BanqueBase(BaseModel):
    rib: str
    nom_banque: str

class BanqueCreate(BanqueBase):
    pass

class Banque(BanqueBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- SCHÉMAS POUR LA TRANSACTION ---
class TransactionBase(BaseModel):
    type: str             # 'Entrée' ou 'Sortie'
    nature: str = "Externe"  # 'Externe' ou 'Interne' (Cahier des charges 4.2)
    date_trans: date
    libelle: str
    montant: float
    tiers: str            # Provenance ou Destination
    banque_id: int

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    pdf_path: Optional[str] = None
    
    # Nouveaux attributs de suivi financier (Cahier des charges 4.6)
    solde_initial: float = 0.0
    solde_final: float = 0.0
    leveling_id: Optional[str] = None  # Pour lier les virements internes
    
    # Relation complète pour afficher le nom de la banque dans les listes
    banque: Optional[Banque] = None

    model_config = ConfigDict(from_attributes=True)

    # --- SCHÉMA POUR LA PAGINATION ---
class TransactionPagination(BaseModel):
    total: int                  # Nombre total de transactions en base
    results: List[Transaction]  # La liste des transactions pour la page actuelle
    
    model_config = ConfigDict(from_attributes=True)