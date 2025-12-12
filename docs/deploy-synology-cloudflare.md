# Deploiement Synology + Cloudflare Tunnel

Objectif: servir la PWA en HTTPS via Cloudflare Tunnel et le backend en HTTP derriere le reverse proxy (pas de mkcert, pas d'IP locale exposee).

## Prerequis
- Cloudflare Tunnel deja configure vers le NAS.
- Regles d'ingress Cloudflare (ordre important):
  - `/api/*` -> `http://127.0.0.1:3000`
  - `/` -> `http://127.0.0.1:5173`
- Docker et docker compose disponibles sur le NAS.

## Deployer
```bash
cd /volume1/dashdoc-distribution-layer   # chemin du repo
docker compose up -d
```

## Verifications locales (NAS)
```bash
curl http://127.0.0.1:3000/health
curl http://127.0.0.1:5173/
```

Les scans sont append dans `backend/data/scans.jsonl` (volume monte par docker compose).

## Tests externes
- https://scan.alpien.fr
- https://scan.alpien.fr/api/health

## Notes
- Si Cloudflared tourne sur une autre machine que le NAS, remplace `127.0.0.1` par `0.0.0.0` dans les ports exposes du `docker-compose.yml`.
- Le TLS est termine par Cloudflare; le backend reste en HTTP.
- `trust proxy` est active pour respecter les IP clientes dans les logs.
