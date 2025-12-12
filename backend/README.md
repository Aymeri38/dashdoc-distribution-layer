# Backend Dashdoc Distribution Layer

Backend FastAPI pour exposer les services d'intégration vers Dashdoc :
- Génération d'EDI simplifiés
- Affectation de chauffeurs par code postal
- Point de santé pour la supervision

## Installation
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

## Lancer l'API
```bash
uvicorn backend.main:app --reload
```

## Endpoints
- `GET /health` : disponibilité du service
- `POST /edi/dispatch` : génère un payload EDI à partir d'une expédition
- `POST /routing/assign-driver` : renvoie le chauffeur assigné à un code postal

## Exemples d'appel

### Générer un dispatch EDI
```bash
curl -X POST http://localhost:8000/edi/dispatch \
  -H "Content-Type: application/json" \
  -d '{
        "shipment_id": "CMD-20240501-1",
        "customer": "Traplus",
        "destination_postal_code": "59000",
        "packages": [
          {"code": "COL-001", "weight_kg": 2.5},
          {"code": "COL-002"}
        ]
      }'
```

### Affecter un chauffeur
```bash
curl -X POST http://localhost:8000/routing/assign-driver \
  -H "Content-Type: application/json" \
  -d '{"postal_code": "59000"}'
```
