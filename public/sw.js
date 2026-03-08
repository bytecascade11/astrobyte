const CACHE_NAME = "revibyte-v3";
const STATIC_CACHE = "revibyte-static-v3";

self.__WB_MANIFEST;

// Core files always cached on install
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/site.webmanifest",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/favicon.svg",
];

// ── Install: cache static assets ──
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── Activate: clean up old caches ──
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== STATIC_CACHE)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ── Fetch: network first, fall back to cache ──
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests from same origin
  if (request.method !== "GET") return;
  if (!url.origin.includes(self.location.hostname) && !url.origin.includes("revibyte.blog")) return;

  // Skip analytics, ads, onesignal
  const skipPatterns = ["googletagmanager", "googlesyndication", "onesignal", "pagead"];
  if (skipPatterns.some(p => url.href.includes(p))) return;

  // For HTML pages: network first, cache as fallback
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache a copy of every page the user visits
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Try cached version of this specific page
          return caches.match(request).then(cached => {
            if (cached) return cached;
            // Fall back to offline page
            return caches.match("/offline.html");
          });
        })
    );
    return;
  }

  // For static assets (images, fonts, CSS, JS): cache first, network fallback
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico|woff|woff2|ttf|css|js)$/)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => cached || new Response('', { status: 404 }));
      })
    );
    return;
  }

  // Default: network first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
