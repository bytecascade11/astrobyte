import { defineConfig, envField } from "astro/config";
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
import tailwindcss from "@tailwindcss/vite";   // ← Add this import

export default defineConfig({
  site: SITE.website,

  integrations: [
    sitemap({
      filter: (page) => SITE.showArchives || !page.endsWith("/archives"),
    }),
    indexnow(),
  ],

  markdown: {
    // ... (keep your existing markdown config)
  },

  vite: {
    plugins: [
      tailwindcss(),   // ← Add this (handles Tailwind processing)
    ],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },

  // ... keep the rest (image, env, experimental, etc.)
});
