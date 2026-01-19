// ============================================
// FILE 1: astro.config.mjs (Main Config File)
// ============================================

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
        // Essential static pages to keep
        const allowedPages = [
          `${SITE.website}`,
          `${SITE.website}about/`,
          `${SITE.website}contact/`,
          `${SITE.website}posts/`,
          `${SITE.website}tags/`,
        ];

        // Only keep these 8 main tags
        const allowedTags = [
          'ai',
          'android',
          'mobile-gaming',
          'opinions',
          'reviews',
          'apple',
          'samsung',
          'games'
        ];

        // Keep all individual blog posts (but not pagination)
        if (page.includes('/posts/') && !page.match(/\/posts\/\d+\/$/)) {
          return true;
        }

        // Keep allowed static pages
        if (allowedPages.includes(page)) {
          return true;
        }

        // Keep only the 8 main tag pages (exclude pagination)
        if (page.includes('/tags/')) {
          const tagMatch = allowedTags.some(tag => 
            page === `${SITE.website}tags/${tag}/`
          );
          return tagMatch;
        }

        // Exclude everything else
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


// ============================================
// FILE 2: src/config.ts (Your SITE Config)
// ============================================

export const SITE = {
  website: "https://www.revibyte.blog/", 
  author: "iSamuel",
  profile: "https://pin.it/1NYS28vrR",
  desc: "ReviByte Technology Opinions delivers the latest tech news, gadget reviews, Android updates, and in-depth guides to keep you informed and ahead in the digital world.",
  title: "ReviByte Opinions",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 20,
  scheduledPostMargin: 15 * 60 * 1000, 
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/bytecascade11/astrobyte/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "Africa/Lagos", 
  analytics: {
    googleAnalyticsId: "G-2MH0T4DFR3",
  },
} as const;
