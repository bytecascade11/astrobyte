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

      manifest: {
        id: "/",
        name: "ReviByte Technology Opinions",
        short_name: "ReviByte",
        description:
          "ReviByte Technology Opinions delivers the latest tech news, gadget reviews, Android updates, and in-depth guides.",
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

        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],

        shortcuts: [
          {
            name: "Latest Posts",
            short_name: "Latest",
            description: "Read newest tech articles",
            url: "/?latest=true",
            icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }],
          },
          {
            name: "Smartphone Reviews",
            short_name: "Reviews",
            description: "See phone comparisons and reviews",
            url: "/category/reviews/",
            icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }],
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{css,js,svg,png,ico,txt,woff,woff2}"],

        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.revibyte\.blog\/posts\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "posts-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: /^https:\/\/www\.revibyte\.blog\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "pages-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
        ],
      },

      // 🔥 IMPORTANT: disable dev mode in production
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
