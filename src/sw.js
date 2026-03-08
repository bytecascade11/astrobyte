// src/sw.js

import { precacheAndRoute } from 'workbox-precaching';
import { cleanupOutdatedCaches } from 'workbox-precaching';

// This is REQUIRED for vite-plugin-pwa injectManifest – do NOT remove or change it!
// The plugin replaces self.__WB_MANIFEST with the actual array of files to precache
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old/outdated caches on activation (prevents storage bloat over updates)
cleanupOutdatedCaches();

const CACHE_NAME = "revibyte-v3";
const STATIC_CACHE = "revibyte-static-v3";

// Core files to cache during install (these are in addition to the precached manifest)
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/site.webmanifest",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/favicon.svg",
];

// ── Install: cache core static assets ──
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );

  // Activate the new SW immediately
  self.skipWaiting();
});

// ── Activate: clean up old caches ──
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

  // Take control of open clients immediately
  self.clients.claim();
});

// ── Fetch handler ──
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Only same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip analytics / ads / third-party tracking scripts
  const skipPatterns = [
    "googletagmanager",
    "googlesyndication",
    "onesignal",
    "pagead",
  ];

  if (skipPatterns.some((p) => url.href.includes(p))) return;

  // ── HTML pages → Network first, fallback to cache or offline.html ──
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses for future offline use
          if (response.ok && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            // Return cached page if available, else fallback to offline page
            return cached || caches.match("/offline.html");
          });
        })
    );

    return;
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
          .catch(() => {
            // If fetch fails and no cache, return 404 or fallback image if desired
            return new Response("", { status: 404 });
          });
      })
    );

    return;
  }

  // ── Everything else → Network first, fallback to cache if available ──
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
