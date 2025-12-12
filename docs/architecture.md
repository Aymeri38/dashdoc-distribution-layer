# Architecture Distribution Layer

## Objectifs
- Accompagner la migration Traplus vers Dashdoc
- Centraliser les flux (scan colis, affectation chauffeurs, EDI)
- Faciliter le monitoring et les évolutions ultérieures

## Modules
- **mobile-scan-app** : PWA pour la saisie/scan des colis par les chauffeurs. Fonctionne hors ligne grâce au service worker et stocke le dernier scan en local.
- **backend** : API FastAPI orchestrant l'intégration vers Dashdoc. Expose la génération d'EDI et la logique d'affectation des chauffeurs.
- **routing** (sous-module backend) : moteur d'affectation par code postal, configurable via un mapping JSON.

## Flux simplifié
1. Le chauffeur scanne un colis dans la mobile-scan-app, qui stocke localement le scan.
2. L'API backend reçoit les informations d'expédition et génère un payload EDI compatible Dashdoc (`/edi/dispatch`).
3. L'API backend affecte un chauffeur en fonction du code postal (`/routing/assign-driver`).
4. Les payloads EDI peuvent ensuite être transmis à Dashdoc ou intégrés dans un connecteur EDI externe.
