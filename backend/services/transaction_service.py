from sqlalchemy.orm import Session, joinedload
import models, schemas
from .file_service import FileService # Import du service de fichiers
from fastapi import HTTPException

class TransactionService:
    @staticmethod
    def create_transaction(db: Session, trans_data: dict, file: any):
        # 1. Vérifications (Banque, Montant)
        bank = db.query(models.Banque).filter(models.Banque.id == trans_data['banque_id']).first()
        if not bank:
            raise HTTPException(status_code=404, detail="Banque introuvable.")

        if trans_data['montant'] <= 0:
            raise HTTPException(status_code=400, detail="Le montant doit être supérieur à 0.")

        # 2. Sauvegarde du fichier
        file_path = FileService.save_pdf(file)

        # 3. Insertion en base
        try:
            new_trans = models.Transaction(**trans_data, pdf_path=file_path)
            db.add(new_trans)
            db.commit()
            db.refresh(new_trans) # Crucial pour récupérer l'ID généré
            return new_trans
        except Exception as e:
            FileService.delete_file(file_path)
            db.rollback()
            raise HTTPException(status_code=500, detail="Erreur base de données.")

    # --- MÉTHODE QUI MANQUAIT ---
    @staticmethod
    def search_transactions(db: Session, min_m: float = None, max_m: float = None):
        query = db.query(models.Transaction).options(joinedload(models.Transaction.banque))
        
        if min_m is not None:
            query = query.filter(models.Transaction.montant >= min_m)
        
        if max_m is not None:
            query = query.filter(models.Transaction.montant <= max_m)
            
        return query.all()
    

    @staticmethod
    def delete_transaction(db: Session, t_id: int):
        trans = db.query(models.Transaction).filter(models.Transaction.id == t_id).first()
        if not trans:
            return False
        
        # 1. Supprimer le fichier PDF associé
        FileService.delete_file(trans.pdf_path)
        
        # 2. Supprimer l'entrée en base
        db.delete(trans)
        db.commit()
        return True