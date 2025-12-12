# Quickstart Android (HTTPS, camera OK)

> Pour Synology + Cloudflare Tunnel, voir `docs/deploy-synology-cloudflare.md`. Ce guide mkcert reste utile pour des tests LAN hors tunnel.

Objectif : servir la PWA et le backend en HTTPS sur le LAN pour que la caméra fonctionne sur Android, sans mixed content.

## 1) Récupérer l’IP locale
```powershell
ipconfig
```
Notez l’IPv4 de votre interface Wi‑Fi (ex: `192.168.0.42`).

## 2) Installer mkcert (Windows)
```powershell
choco install mkcert -y
mkcert -install
```

## 3) Générer des certificats pour l’IP du PC
```powershell
cd C:\chemin\vers\dashdoc-distribution-layer
mkcert 192.168.0.42
# produit 192.168.0.42.pem et 192.168.0.42-key.pem dans le dossier courant
```

## 4) Lancer le backend en HTTPS
```powershell
cd backend
npm install            # première fois
$env:USE_HTTPS="true"
$env:HTTPS_CERT_PATH="C:\chemin\vers\dashdoc-distribution-layer\192.168.0.42.pem"
$env:HTTPS_KEY_PATH="C:\chemin\vers\dashdoc-distribution-layer\192.168.0.42-key.pem"
$env:ALLOWED_ORIGINS="https://192.168.0.42:5173"
npm run dev            # backend sur https://localhost:3000 (également https://192.168.0.42:3000)
```
Les scans sont append dans `backend/data/scans.jsonl`.

## 5) Servir la PWA en HTTPS
```powershell
# depuis la racine du repo
$env:PWA_CERT_PATH="C:\chemin\vers\dashdoc-distribution-layer\192.168.0.42.pem"
$env:PWA_KEY_PATH="C:\chemin\vers\dashdoc-distribution-layer\192.168.0.42-key.pem"
npm run serve:pwa:https --prefix backend
```
La PWA est disponible sur `https://192.168.0.42:5173`.

## 6) Ouvrir sur le téléphone
- Connectez le téléphone au même Wi‑Fi.
- Ouvrez `https://192.168.0.42:5173` dans Chrome mobile.
- Acceptez le certificat local si demandé.
- Autorisez la caméra.
- Dans le champ Backend, vérifiez `https://192.168.0.42:3000` (HTTPS pour éviter le mixed content).

## 7) Tester
- Appuyez sur « Scanner » et lisez un code-barres/QR.
- Le statut doit afficher “envoyé”.
- Vérifiez `backend/data/scans.jsonl` : une ligne JSON par scan.

## Dépannage
- Caméra bloquée : assurez-vous d’être en HTTPS (PWA) + backend en HTTPS (sinon mixed content).
- Certificat non reconnu : validez le certificat généré par mkcert dans Chrome (page d’avertissement).
- Firewall Windows : autorisez node.exe et le port 3000/5173 en entrant/sortant sur le réseau privé.
- Pas d’accès au backend : vérifiez que le téléphone ping `192.168.0.42` et que le port 3000 est ouvert.
