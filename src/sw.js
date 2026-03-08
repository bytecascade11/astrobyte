// src/sw.js — 2025–2026 version, custom offline page working

import { precacheAndRoute } from 'workbox-precaching';
import { cleanupOutdatedCaches } from 'workbox-precaching';

// REQUIRED — vite-plugin-pwa injects the real manifest array here during build
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

const DYNAMIC_CACHE = 'revibyte-dynamic-v3';
const STATIC_CACHE  = 'revibyte-static-v3';

const CORE_ASSETS = [
  '/',
  '/offline.html',              // ← your custom page must be here
  '/site.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon.svg',
];

// ── Install: cache core files ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate: remove old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== DYNAMIC_CACHE && key !== STATIC_CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch handler ──
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET, cross-origin, trackers
  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  const skip = ['googletagmanager', 'googlesyndication', 'onesignal', 'pagead'];
  if (skip.some(s => url.href.includes(s))) return;

  // ── Navigation (pages) ── network first → cache → custom offline page
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(req);

          // Cache good responses
          if (response?.ok && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => cache.put(req, clone));
          }

          return response;
        } catch (err) {
          // Offline or network error
          const cached = await caches.match(req);
          if (cached) return cached;

          // Serve your custom offline page
          const offlinePage = await caches.match('/offline.html');
          if (offlinePage) return offlinePage;

          // Last-resort plain text (should never reach here)
          return new Response(
            '<h1>Offline</h1><p>No connection. Please try again later.</p>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
      })()
    );
    return;
  }

  // ── Static files (images, css, js, fonts) ── cache first
  if (url.pathname.match(/\.(png|jpe?g|svg|webp|gif|ico|woff2?|ttf|css|js)$/i)) {
    event.respondWith(
      caches.match(req).then(cached => {
        return cached || fetch(req);
      })
    );
    return;
  }

  // Everything else: network only
  event.respondWith(fetch(req));
});
