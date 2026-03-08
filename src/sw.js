// src/sw.js

import { precacheAndRoute } from 'workbox-precaching';
import { cleanupOutdatedCaches } from 'workbox-precaching';

// REQUIRED for vite-plugin-pwa injectManifest mode
// The build replaces this with the real asset list
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches
cleanupOutdatedCaches();

const CACHE_NAME = "revibyte-v3";
const STATIC_CACHE = "revibyte-static-v3";

const STATIC_ASSETS = [
  "/",
  "/offline.html",  // still cached, but we won't use it as fallback
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

// ── Fetch handler ── (no fallbacks, pure network-first + cache for static)
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Skip tracking/ads
  const skipPatterns = [
    "googletagmanager",
    "googlesyndication",
    "onesignal",
    "pagead",
  ];
  if (skipPatterns.some((p) => url.href.includes(p))) return;

  // ── Navigation requests ──
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses (so next time offline it can serve from cache)
          if (response?.ok && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // NO FALLBACK HERE — let it fail
          // Browser will show native "You're offline" screen
          return Response.error();
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

  // ── Everything else → Network only, no cache fallback ──
  event.respondWith(fetch(request));
});
