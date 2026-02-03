from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Banque(Base):
    __tablename__ = "banques"
    id = Column(Integer, primary_key=True, index=True)
    rib = Column(String, unique=True, index=True, nullable=False)
    nom_banque = Column(String, nullable=False)
    
    # Relation vers les transactions
    transactions = relationship("Transaction", back_populates="banque", cascade="all, delete-orphan")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    
    # Champs de base
    type = Column(String, nullable=False)      # 'Entrée' ou 'Sortie'
    nature = Column(String, default="Externe") # 'Externe' ou 'Interne' (Nivellement)
    date_trans = Column(Date, nullable=False)
    libelle = Column(String, nullable=False)
    montant = Column(Float, nullable=False)
    
    # Tiers (Provenance pour Entrée, Destination pour Sortie)
    tiers = Column(String) 
    
    # Pièce justificative
    pdf_path = Column(String)
    
    # Suivi des soldes (Règle 4.6)
    solde_initial = Column(Float, default=0.0)
    solde_final = Column(Float, default=0.0)
    
    # Identifiant de groupe pour le nivellement (Règle 4.2 c)
    leveling_id = Column(String, nullable=True, index=True) 
    
    # Relations
    banque_id = Column(Integer, ForeignKey("banques.id"))
    banque = relationship("Banque", back_populates="transactions")