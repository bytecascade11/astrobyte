// astro.config.ts
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import indexnow from "./src/integrations/indexnow";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";

export default defineConfig({
  site: SITE.website,

  trailingSlash: "always",

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false,
      },
    },
  },

  integrations: [
    AstroPWA({
      registerType: "autoUpdate",
      injectRegister: null,

      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",

      injectManifest: {
        injectionPoint: "self.__WB_MANIFEST",
        rollupFormat: "iife", // ← prevents Vite from tree-shaking the global
      },

      manifest: {
        id: "/",
        name: "ReviByte Opinions",
        short_name: "ReviByte",
        description:
          "ReviByte Technology Opinions delivers the latest tech news, gadget reviews, Android updates, and in-depth guides to keep you informed and ahead in the digital world.",
        start_url: "/?source=pwa",
        scope: "/",
        display: "standalone",
        display_override: ["standalone", "minimal-ui"],
        background_color: "#0f172a",
        theme_color: "#0f172a",
        orientation: "portrait-primary",
        lang: "en",
        dir: "ltr",
        categories: ["technology", "news", "blog"],
        prefer_related_applications: false,

        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],

        shortcuts: [
          {
            name: "Latest Posts",
            short_name: "Latest",
            description: "Read newest tech articles",
            url: "/?source=pwa",
            icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }],
          },
          {
            name: "Samsung",
            short_name: "Samsung",
            description: "Latest Samsung news and reviews",
            url: "/tags/samsung/?source=pwa",
            icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }],
          },
          {
            name: "Apple",
            short_name: "Apple",
            description: "Latest Apple news and reviews",
            url: "/tags/apple/?source=pwa",
            icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }],
          },
          {
            name: "Android",
            short_name: "Android",
            description: "Latest Android news and updates",
            url: "/tags/android/?source=pwa",
            icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }],
          },
        ],
      },

      devOptions: {
        enabled: false,
      },
    }),

    sitemap({
      filter: (page) => {
        if (!SITE.showArchives && page.endsWith("/archives/")) {
          return false;
        }

        const allowedPages = [
          `${SITE.website}`,
          `${SITE.website}about/`,
          `${SITE.website}contact/`,
          `${SITE.website}posts/`,
          `${SITE.website}tags/`,
        ];

        const allowedTags = [
          "ai",
          "android",
          "news",
          "opinions",
          "apple",
          "samsung",
          "games",
        ];

        if (page.includes("/posts/") && !page.match(/\/posts\/\d+\/$/)) {
          return true;
        }

        if (allowedPages.includes(page)) {
          return true;
        }

        if (page.includes("/tags/")) {
          return allowedTags.some(
            (tag) => page === `${SITE.website}tags/${tag}/`
          );
        }

        return false;
      },
    }),

    indexnow(),
  ],

  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],

    shikiConfig: {
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerFileName(),
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
```

**`src/sw.js`** — use this exact form so `self.__WB_MANIFEST` survives the `iife` build:

```js
const CACHE_NAME = "revibyte-v3";
const STATIC_CACHE = "revibyte-static-v3";

// Required for vite-plugin-pwa injectManifest
const WB_MANIFEST = self.__WB_MANIFEST || [];

const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/site.webmanifest",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

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

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== location.origin) return;

  const skipPatterns = [
    "googletagmanager",
    "googlesyndication",
    "onesignal",
    "pagead",
  ];

  if (skipPatterns.some((p) => url.href.includes(p))) return;

  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/offline.html"))
        )
    );
    return;
  }

  if (url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico|woff|woff2|ttf|css|js)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => cached || new Response("", { status: 404 }));
      })
    );
    return;
  }

  event.respondWith(fetch(request).catch(() => caches.match(request)));
});
