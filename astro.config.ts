// astro.config.ts (or .mjs)
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import indexnow from "./src/integrations/indexnow";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: SITE.website,

  integrations: [
    sitemap({
      filter: (page) => SITE.showArchives || !page.endsWith("/archives"),
    }),
    indexnow(),
  ],

  markdown: {
    // IMPORTANT: Removed invalid extendDefaultPlugins
    // Default remark + rehype plugins (GFM + Smartypants) are already included by Astro

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
