import uuid
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
import models
from .file_service import FileService
from fastapi import HTTPException

class TransactionService:
    
    @staticmethod
    def get_last_balance(db: Session, banque_id: int):
        """Récupère le solde final de la toute dernière transaction d'une banque."""
        last_trans = db.query(models.Transaction)\
            .filter(models.Transaction.banque_id == banque_id)\
            .order_by(desc(models.Transaction.id))\
            .first()
        return last_trans.solde_final if last_trans else 0.0

    @staticmethod
    def create_transaction(db: Session, trans_data: dict, file: any, nature="Externe", leveling_id=None):
        # 1. Validation de base
        if trans_data['montant'] <= 0:
            raise HTTPException(status_code=400, detail="Le montant doit être positif.")

        # 2. Calcul des soldes (Règle 4.6)
        solde_initial = TransactionService.get_last_balance(db, trans_data['banque_id'])
        
        if trans_data['type'] == 'Entrée':
            solde_final = solde_initial + trans_data['montant']
        else: # Sortie
            solde_final = solde_initial - trans_data['montant']

        # 3. Sauvegarde PDF
        file_path = FileService.save_pdf(file)

        try:
            new_trans = models.Transaction(
                **trans_data,
                nature=nature,
                leveling_id=leveling_id,
                solde_initial=solde_initial,
                solde_final=solde_final,
                pdf_path=file_path
            )
            db.add(new_trans)
            db.commit()
            db.refresh(new_trans)
            return new_trans
        except Exception as e:
            db.rollback()
            FileService.delete_file(file_path)
            raise HTTPException(status_code=500, detail="Erreur lors de l'enregistrement.")

    @staticmethod
    def create_leveling(db: Session, leveling_data: dict, file: any):
        """
        Gère le Nivellement (Règle 4.2.c)
        Crée deux transactions liées par un identifiant unique.
        """
        if leveling_data['banque_source_id'] == leveling_data['banque_dest_id']:
            raise HTTPException(status_code=400, detail="Les banques source et destination doivent être différentes.")

        lev_id = str(uuid.uuid4()) # Identifiant unique de nivellement
        # --- MODIFICATION ICI ---
    # On ne sauvegarde le PDF que si un fichier est réellement envoyé
        file_path = FileService.save_pdf(file) if file else None

        try:
            # A. Transaction de SORTIE (Banque Source)
            last_solde_src = TransactionService.get_last_balance(db, leveling_data['banque_source_id'])
            sortie = models.Transaction(
                date_trans=leveling_data['date_trans'],
                libelle=leveling_data['libelle'],
                montant=leveling_data['montant'],
                type='Sortie',
                nature='Interne',
                tiers=leveling_data['banque_dest_nom'],
                banque_id=leveling_data['banque_source_id'],
                solde_initial=last_solde_src,
                solde_final=last_solde_src - leveling_data['montant'],
                leveling_id=lev_id,
                pdf_path=file_path
            )

            # B. Transaction d'ENTRÉE (Banque Destination)
            last_solde_dest = TransactionService.get_last_balance(db, leveling_data['banque_dest_id'])
            entree = models.Transaction(
                date_trans=leveling_data['date_trans'],
                libelle=leveling_data['libelle'],
                montant=leveling_data['montant'],
                type='Entrée',
                nature='Interne',
                tiers=leveling_data['banque_source_nom'],
                banque_id=leveling_data['banque_dest_id'],
                solde_initial=last_solde_dest,
                solde_final=last_solde_dest + leveling_data['montant'],
                leveling_id=lev_id,
                pdf_path=file_path
            )

            db.add(sortie)
            db.add(entree)
            db.commit()
            return {"leveling_id": lev_id, "status": "Success"}
            
        except Exception as e:
            db.rollback()
            if file_path:
                FileService.delete_file(file_path)
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def search_transactions(db: Session, min_m: float = None, max_m: float = None, start_date=None, end_date=None,skip: int = 0, limit: int = 20):
        query = db.query(models.Transaction).options(joinedload(models.Transaction.banque))
        if min_m is not None: query = query.filter(models.Transaction.montant >= min_m)
        if max_m is not None: query = query.filter(models.Transaction.montant <= max_m)

        # Filtres de Date (YYYY-MM-DD)
        if start_date:
            query = query.filter(models.Transaction.date_trans >= start_date)
        if end_date:
            query = query.filter(models.Transaction.date_trans <= end_date)

       # On compte le total pour la pagination avant d'appliquer offset/limit
        total = query.count()

        # On récupère les résultats paginés, triés par date décroissante
        results = query.order_by(desc(models.Transaction.date_trans), desc(models.Transaction.id)) \
                       .offset(skip) \
                       .limit(limit) \
                       .all()

        return {
            "total": total,
            "results": results,
            "page": (skip // limit) + 1,
            "size": limit
        }

    @staticmethod
    def delete_transaction(db: Session, t_id: int):
        trans = db.query(models.Transaction).filter(models.Transaction.id == t_id).first()
        if not trans: return False
        
        # Si c'est un nivellement, on supprime les deux (Optionnel selon ton besoin)
        if trans.leveling_id:
            all_linked = db.query(models.Transaction).filter(models.Transaction.leveling_id == trans.leveling_id).all()
            for t in all_linked:
                FileService.delete_file(t.pdf_path)
                db.delete(t)
        else:
            FileService.delete_file(trans.pdf_path)
            db.delete(trans)
            
        db.commit()
        return True