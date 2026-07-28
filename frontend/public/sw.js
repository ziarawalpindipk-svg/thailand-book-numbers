// Minimal service worker.
// Its main job here is to satisfy the browser's requirement of having an
// active service worker before it will show the "Add to Home Screen" /
// install prompt on Android/Chrome. It also caches a couple of core assets
// so the app shell loads even on a flaky connection.

const CACHE_NAME = "tb-shell-v1";
const CORE_ASSETS = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Network-first, falling back to cache. Keeps things simple and avoids
  // serving stale API responses.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
