import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

export default defineConfig({
  site: SITE.website,

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),

    react(),

    sitemap({
      filter: (page) => {
        /**
         * Astro sitemap filter receives PATHS, not full URLs
         * Examples:
         *  /
         *  /about/
         *  /posts/my-post/
         *  /tags/ai/
         */

        // Static pages to keep
        const allowedPages = [
          "/",
          "/about/",
          "/contact/",
          "/posts/",
          "/tags/",
        ];

        // Allowed main tags only (NO pagination)
        const allowedTags = [
          "ai",
          "android",
          "mobile-gaming",
          "opinions",
          "reviews",
          "apple",
          "samsung",
          "games",
        ];

        // ❌ Exclude all pagination pages
        if (page.includes("/page/")) {
          return false;
        }

        // ✅ Keep all individual blog posts
        if (page.startsWith("/posts/")) {
          return true;
        }

        // ✅ Keep allowed static pages
        if (allowedPages.includes(page)) {
          return true;
        }

        // ✅ Keep only main tag pages
        if (page.startsWith("/tags/")) {
          return allowedTags.some(
            (tag) => page === `/tags/${tag}/`
          );
        }

        // ❌ Exclude everything else
        return false;
      },
    }),
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
      theme: "one-dark-pro",
      wrap: true,
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },

  scopedStyleStrategy: "where",
});
