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

  // ✅ ENFORCE TRAILING SLASHES
  trailingSlash: "always",

  // Image optimization with Sharp
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
        description: "ReviByte Technology Opinions delivers the latest tech news, gadget reviews, Android updates, and in-depth guides to keep you informed and ahead in the digital world.",
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
            icons: [
              {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
              },
            ],
          },
          {
            name: "Smartphone Reviews",
            short_name: "Reviews",
            description: "See phone comparisons and reviews",
            url: "/category/reviews",
            icons: [
              {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
              },
            ],
          },
        ],
      },
      workbox: {
        navigateFallback: "/",
        globPatterns: ["**/*.{css,js,html,svg,png,ico,txt}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
    sitemap({
      filter: (page) => {
        // Exclude archives if SITE.showArchives is false
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

        // Keep all individual blog posts (exclude pagination pages)
        if (page.includes("/posts/") && !page.match(/\/posts\/\d+\/$/)) {
          return true;
        }

        // Keep allowed static pages
        if (allowedPages.includes(page)) {
          return true;
        }

        // Keep only the main tag pages (exclude pagination)
        if (page.includes("/tags/")) {
          return allowedTags.some(
            (tag) => page === `${SITE.website}tags/${tag}/`
          );
        }

        // Exclude everything else (pagination, extra tags, legal pages, etc.)
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
