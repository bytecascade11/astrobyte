const CACHE_NAME = "revibyte-v3";
const STATIC_CACHE = "revibyte-static-v3";

// Required for vite-plugin-pwa injectManifest
const WB_MANIFEST = self.__WB_MANIFEST || [];

// Core files cached during install
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/site.webmanifest",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/favicon.svg",
];

// ── Install: cache core assets ──
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );

  self.skipWaiting();
});

// ── Activate: remove old caches ──
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

// ── Fetch handler ──
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only GET requests
  if (request.method !== "GET") return;

  // Only same-origin requests
  if (url.origin !== location.origin) return;

  // Skip analytics / ads scripts
  const skipPatterns = [
    "googletagmanager",
    "googlesyndication",
    "onesignal",
    "pagead"
  ];

  if (skipPatterns.some((p) => url.href.includes(p))) return;

  // ── HTML pages → Network first ──
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) return cached;

            return caches.match("/offline.html");
          });
        })
    );

    return;
  }

  // ── Static assets → Cache first ──
  if (
    url.pathname.match(
      /\.(png|jpg|jpeg|svg|webp|gif|ico|woff|woff2|ttf|css|js)$/
    )
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, clone);
              });
            }

            return response;
          })
          .catch(() => cached || new Response("", { status: 404 }));
      })
    );

    return;
  }

  // ── Default → Network first ──
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
