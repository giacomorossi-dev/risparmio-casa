// Service worker minimale: rende l'app installabile (PWA) senza precache.
// Passthrough sulla rete — nessun caching offline per ora (niente risorse
// stale). Sostituire con una strategia di cache quando serve l'offline.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // no-op: lascia che la richiesta vada in rete normalmente.
});
