# Dashdoc Distribution Layer

Ce repository contient les modules complémentaires nécessaires à la gestion
de la distribution pour Jeantin Casset Distribution, en complément de Dashdoc.

## Modules
- 📦 **Mobile Scan App** : PWA de scan colis (chauffeurs) accessible hors ligne
- 🚚 **Routing** : affectation automatique des chauffeurs par code postal
- 🔌 **Backend** : génération et envoi des EDI vers Dashdoc

## Architecture
- `mobile-scan-app` : application mobile chauffeurs (statique)
- `backend` : logique métier, API FastAPI, intégrations Dashdoc
- `docs` : documentation fonctionnelle et technique

## Mise en route
- Backend : voir `backend/README.md` pour lancer l'API
- Mobile : `python -m http.server 8080 --directory mobile-scan-app`
- Documentation : `docs/architecture.md`
- Deploiement Synology/Cloudflare : `docs/deploy-synology-cloudflare.md`
