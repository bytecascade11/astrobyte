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
import vercel from '@astrojs/vercel';


export default defineConfig({
  site: SITE.website,

  adapter: vercel(),

  trailingSlash: "always",

  build: {
    format: "directory",
    inlineStylesheets: "auto",  // ← ADDED: Inlines small critical CSS automatically
  },

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
        rollupFormat: "es",
        minify: false,
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
      filter: page => SITE.showArchives || !page.endsWith("/archives/"),
      customPages: [`${SITE.website}sitemap-post-images.xml`],
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
    build: {
      cssCodeSplit: true,  // ← ADDED: Splits CSS per route for smaller chunks
    },
  },
});
