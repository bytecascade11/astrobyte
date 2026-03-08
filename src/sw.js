// src/sw.js

import { precacheAndRoute } from 'workbox-precaching';
import { cleanupOutdatedCaches } from 'workbox-precaching';

// REQUIRED placeholder for vite-plugin-pwa (injectManifest mode)
// The build process replaces the line below with the real asset list
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

// ... the rest of your file stays exactly the same
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

  self.clients.claim();
});

// ── Fetch handler ── (unchanged)
self.addEventListener("fetch", (event) => {
  // ... your full fetch logic here, no changes needed
});
