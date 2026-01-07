import os
import shutil
from fastapi import UploadFile, HTTPException
from datetime import datetime

class FileService:
    UPLOAD_DIR = "uploads"

    @staticmethod
    def save_pdf(file: UploadFile) -> str:
        # 1. Vérification stricte de l'extension
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400, 
                detail="Format de fichier non supporté. Veuillez joindre un PDF."
            )
        
        # 2. Création du dossier de stockage
        if not os.path.exists(FileService.UPLOAD_DIR):
            os.makedirs(FileService.UPLOAD_DIR)

        # 3. Génération d'un nom unique (timestamp + nom original nettoyé)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{timestamp}_{file.filename.replace(' ', '_')}"
        file_path = os.path.join(FileService.UPLOAD_DIR, safe_filename)

        # 4. Écriture sur le disque
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            return file_path
        except Exception as e:
            print(f"Erreur écriture fichier: {e}")
            raise HTTPException(
                status_code=500, 
                detail="Erreur interne lors de la sauvegarde du justificatif."
            )

    @staticmethod
    def delete_file(path: str):
        if path and os.path.exists(path):
            try:
                os.remove(path)
            except Exception as e:
                print(f"Erreur suppression fichier: {e}")