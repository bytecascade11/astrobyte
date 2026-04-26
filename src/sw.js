// src/sw.js — PWA + PushPilot

// ── PushPilot (must be first) ──
importScripts('https://cdn.pushpilot.io/sw.js');

// ── Workbox PWA ──
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

const DYNAMIC_CACHE = 'revibyte-dynamic-v3';
const STATIC_CACHE = 'revibyte-static-v3';

const CORE_ASSETS = [
  '/',
  '/offline.html',
  '/site.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  const skip = ['googletagmanager', 'googlesyndication', 'pagead'];
  if (skip.some(s => url.href.includes(s))) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(async () => {
        return (
          (await caches.match(req)) ||
          (await caches.match('/offline.html'))
        );
      })
    );
    return;
  }

  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(DYNAMIC_CACHE).then(c => c.put(req, clone));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});                   
