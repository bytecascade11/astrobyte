// astro.config.mjs (or .ts)
import { defineConfig, envField } from "astro/config";
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
    // IMPORTANT: Removed remarkToc & remarkCollapse – these were likely causing empty <Content /> rendering
    // If you want TOC later, use manual generation from headings (safer & more control):
    //   const { headings } = await render(post); → then build your own TOC component
    //
    // remarkPlugins: [],  // ← empty is safe & default

    extendDefaultPlugins: true, // Keeps Astro's built-in GFM + SmartyPants

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
