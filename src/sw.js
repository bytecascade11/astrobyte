// src/sw.js

import { precacheAndRoute } from 'workbox-precaching';
import { cleanupOutdatedCaches } from 'workbox-precaching';
import { setCatchHandler } from 'workbox-routing';

// ────────────────────────────────────────────────
// REQUIRED for vite-plugin-pwa injectManifest mode
// The build process replaces the line below with the real precache array
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches on activation
cleanupOutdatedCaches();

// ────────────────────────────────────────────────

const CACHE_NAME = "revibyte-v3";
const STATIC_CACHE = "revibyte-static-v3";

// Core files cached during install (in addition to the injected manifest)
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/site.webmanifest",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/favicon.svg",
];

// ── Install: cache essential static assets ──
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── Activate: clean old caches & take control ──
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

  // Skip non-GET, cross-origin, and unwanted third-party requests
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  const skipPatterns = [
    "googletagmanager",
    "googlesyndication",
    "onesignal",
    "pagead",
  ];
  if (skipPatterns.some((p) => url.href.includes(p))) return;

  // ── Navigation requests (page loads, reloads, typing URL, links) ──
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful page responses
          if (response?.ok && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(async () => {
          // Offline: first try cache (visited pages)
          const cached = await caches.match(request);
          if (cached) return cached;

          // If not cached → return your custom offline page
          const offlinePage = await caches.match("/offline.html");
          return offlinePage || new Response(
            "<h1>Offline</h1><p>Please check your internet connection</p>",
            { headers: { "Content-Type": "text/html" } }
          );
        })
    );
    return; // Prevents browser default offline screen
  }

  // ── Static assets (images, fonts, css, js) → Cache first ──
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
            if (response.ok && response.status === 200) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, clone);
              });
            }
            return response;
          })
          .catch(() => new Response("", { status: 404 }));
      })
    );
    return;
  }

  // ── Everything else → Network first, fallback to cache ──
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// ── Global safety net (last resort) ──
setCatchHandler(async ({ event }) => {
  if (event.request.mode === 'navigate') {
    const offlinePage = await caches.match("/offline.html");
    return offlinePage || new Response("Offline", { status: 503 });
  }
  return Response.error();
});
