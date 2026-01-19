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

export default defineConfig({
  site: SITE.website,

  // ✅ ENFORCE TRAILING SLASHES
  trailingSlash: "always",

  integrations: [
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
          'ai', 
          'android', 
          'news',
          'opinions',
          'apple', 
          'samsung', 
          'games'
        ];

        // Keep all individual blog posts (exclude pagination pages)
        if (page.includes('/posts/') && !page.match(/\/posts\/\d+\/$/)) {
          return true;
        }

        // Keep allowed static pages
        if (allowedPages.includes(page)) {
          return true;
        }

        // Keep only the 8 main tag pages (exclude pagination)
        if (page.includes('/tags/')) {
          return allowedTags.some(tag => 
            page === `${SITE.website}tags/${tag}/`
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
