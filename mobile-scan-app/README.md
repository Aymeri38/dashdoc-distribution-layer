# Mobile Scan App

Installable PWA for Android/mobile browsers. Uses the camera (BarcodeDetector) or manual entry and posts scans to the backend; the last scan is persisted and replayed if needed.

## Backend URL
- Default: `/api` (same domain as the PWA; compatible with Cloudflare Tunnel reverse proxy).
- The field remains editable for overrides like `http://192.168.0.42:3000/api` if you bypass the tunnel.
- Requests use `${BACKEND_URL}/scan` and `${BACKEND_URL}/health`.

## Features
- Camera scan + manual entry with clear sent/error status.
- Last scan cached locally (retried on reload if it failed).
- Service Worker caches only static assets; `/api/*` is never cached.
- Kiosk mode `?kiosk=1` hides the form and tries to keep the screen awake.

## Run locally (static preview)
```bash
python -m http.server 5173 --directory mobile-scan-app
```
Or run `docker compose up -d` (nginx serves the PWA on port 5173).

## Notes
- Keep the public site behind HTTPS via Cloudflare; the backend stays in HTTP behind the tunnel (no mkcert needed).
