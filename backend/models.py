from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Banque(Base):
    __tablename__ = "banques"
    id = Column(Integer, primary_key=True, index=True)
    rib = Column(String, unique=True, index=True, nullable=False)
    nom_banque = Column(String, nullable=False)
    transactions = relationship("Transaction", back_populates="banque")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)  # 'Entrée' ou 'Sortie'
    date_trans = Column(Date, nullable=False)
    libelle = Column(String, nullable=False)
    montant = Column(Float, nullable=False)
    tiers = Column(String)  # Provenance ou Destination
    pdf_path = Column(String)
    banque_id = Column(Integer, ForeignKey("banques.id"))
    # RELATION CRUCIALE : permet d'accéder à transaction.banque.nom_banque
    banque = relationship("Banque", back_populates="transactions")