import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
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

// https://astro.build/config
export default defineConfig({
  /** 🔑 REQUIRED FOR OPERA MINI + SEO */
  output: "static",

  /** Site URL (important for sitemap & canonical URLs) */
  site: SITE.website,

  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    indexnow(),
  ],

  /** Markdown = best for Opera Mini */
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

  /** Tailwind is fine – Opera Mini will just ignore unsupported CSS */
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },

  /** Images still render as normal <img> tags */
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },

  /** Public env vars (SEO verification is safe) */
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },

  /** Prevent JS order issues (safe for Opera Mini) */
  experimental: {
    preserveScriptOrder: true,
  },
});
