const CACHE_NAME = 'mobile-scan-cache-v4';
const BASE_URL = self.registration.scope;

const ASSETS = [
  'index.html',
  'manifest.json',
  'service-worker.js',
  'icons/icon-192.png',
  'icons/icon-512.png'
].map((path) => new URL(path, BASE_URL).pathname);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Never cache API traffic; go straight to network.
  if (requestUrl.pathname.startsWith('/api')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Do not cache backend or any cross-origin requests; go network-direct.
  if (requestUrl.origin !== self.location.origin) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first for known static assets; otherwise passthrough to network.
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request);
    })
  );
});
