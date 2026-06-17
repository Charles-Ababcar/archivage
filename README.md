# Créer l'environnement virtuel
python -m venv env

# Activer l'environnement virtuel (sur Windows)
.\env\Scripts\activate

# Activer l'environnement virtuel (sur macOS / Linux)
source env/bin/activate

# Démarrer le projet
python -m uvicorn main:app --reload
