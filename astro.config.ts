import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind"; // ← Updated import (preferred over @tailwindcss/vite)
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName"; // assuming this is your custom file
import { SITE } from "./src/config";
import indexnow from "./src/integrations/indexnow";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,

  integrations: [
    tailwind({
      // Optional: applyBaseStyles: false if you want full control
    }),
    sitemap({
      filter: (page) => SITE.showArchives || !page.endsWith("/archives"),
      // Optional: changefreq, priority, lastmod for better SEO
    }),
    indexnow(),
  ],

  markdown: {
    remarkPlugins: [
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
    ],
    shikiConfig: {
      themes: {
        light: "min-light",
        dark: "night-owl",
      },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },

  vite: {
    // tailwind is now handled by @astrojs/tailwind integration — remove manual plugin if using it
    // plugins: [tailwindcss()],  ← Comment out or remove
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },

  image: {
    // responsiveStyles is deprecated in newer Astro — use service config instead if needed
    // service: { entrypoint: 'astro/assets/services/sharp' }, // optional for Sharp
  },

  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },

  experimental: {
    preserveScriptOrder: true,
    // Consider adding if using new features:
    // contentCollectionCache: true, // improves build speed for large collections
  },
});
