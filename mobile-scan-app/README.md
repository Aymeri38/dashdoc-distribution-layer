# Mobile Scan App

PWA légère permettant de simuler le scan colis côté chauffeur. Les scans sont conservés en local (localStorage) et prêts pour une synchronisation ultérieure vers Dashdoc.

## Lancer en local
Servez le dossier statique avec n'importe quel serveur HTTP. Exemple :
```bash
python -m http.server 8080 --directory mobile-scan-app
```

## Fonctionnalités
- Saisie/scan d'un code colis
- Stockage local du dernier scan avec horodatage
- Service Worker pour le mode hors ligne
