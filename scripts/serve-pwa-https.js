#!/usr/bin/env node
/**
 * Serve the PWA over HTTPS to allow camera access on mobile.
 * Env:
 *  - PWA_CERT_PATH (required)
 *  - PWA_KEY_PATH (required)
 *  - PWA_PORT (optional, default 5173)
 *  - PWA_ROOT (optional, default "../mobile-scan-app")
 */
const fs = require("fs");
const path = require("path");
const httpServer = require("http-server");

const certPath = process.env.PWA_CERT_PATH;
const keyPath = process.env.PWA_KEY_PATH;
const port = process.env.PWA_PORT ? Number(process.env.PWA_PORT) : 5173;
const root = process.env.PWA_ROOT || path.join(__dirname, "..", "mobile-scan-app");

if (!certPath || !keyPath) {
  console.error("PWA_CERT_PATH et PWA_KEY_PATH sont requis pour servir en HTTPS.");
  process.exit(1);
}

const server = httpServer.createServer({
  root,
  cache: "no-cache",
  https: {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
  },
});

server.listen(port, "0.0.0.0", () => {
  console.log(`PWA served in HTTPS on https://localhost:${port} (root: ${root})`);
});
