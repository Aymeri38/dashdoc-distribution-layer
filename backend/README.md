# Backend Dashdoc Distribution Layer

Node/Express API (HTTP only) for collecting scans from the PWA, plus legacy FastAPI helpers for Dashdoc. TLS is handled upstream by Cloudflare Tunnel; no HTTPS or certificates are needed in Node.

## Node / Express (scans)
- Routes:
  - `GET /health` and `GET /api/health` → `{ ok: true }`
  - `POST /scan` and `POST /api/scan` accept `{ code, symbology?, device_id?, scanned_at? }` and respond `{ ok: true, received_at }`
- Persists scans to `backend/data/scans.jsonl` (JSON Lines). The folder is created at startup.
- CORS: `ALLOWED_ORIGINS` (comma-separated) is optional; if unset, any origin is allowed (the PWA is typically on the same domain).
- Trust proxy is enabled so `req.ip` reflects Cloudflare Tunnel headers.

### Config
```
PORT=3000                # optional, default 3000
ALLOWED_ORIGINS=         # optional, comma-separated list
```

### Run in dev
```bash
npm install
npm run dev
```

### Run in production (HTTP)
```bash
npm run build
npm start   # listens on http://localhost:${PORT}
```
Cloudflare terminates HTTPS and forwards traffic to the container.

### curl examples
```bash
curl http://localhost:3000/health
curl -X POST http://localhost:3000/scan \
  -H "Content-Type: application/json" \
  -d '{"code":"COL-0001","symbology":"qr","device_id":"test","scanned_at":"2025-01-01T10:00:00Z"}'
```

## (Optional) FastAPI legacy
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

### Examples
```bash
# Generate a dispatch EDI
curl -X POST http://localhost:8000/edi/dispatch \
  -H "Content-Type: application/json" \
  -d '{"shipment_id":"CMD-20240501-1","customer":"Traplus","destination_postal_code":"59000","packages":[{"code":"COL-001","weight_kg":2.5}]}'

# Assign a driver
curl -X POST http://localhost:8000/routing/assign-driver \
  -H "Content-Type: application/json" \
  -d '{"postal_code":"59000"}'

# Receive a scan (legacy FastAPI endpoint)
curl -X POST http://localhost:8000/scan \
  -H "Content-Type: application/json" \
  -d '{"code":"COL-0001","scanned_at":"2024-12-12T10:00:00Z","source":"mobile-scan-app"}'
```
