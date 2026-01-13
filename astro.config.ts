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
import indexnow from "./src/integrations/indexnow";  // ← Your custom integration

import AstroPWA from '@vite-pwa/astro';  // ← New import for PWA

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    indexnow(),  // ← Your IndexNow integration
    AstroPWA({
      // Recommended minimal config – customize as needed
      registerType: 'autoUpdate',          // Auto-updates SW when new version deployed
      includeAssets: [
        'favicon.ico',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
      ],
      manifest: {
        name: 'RevivByte Blog',              // Full app name
        short_name: 'RevivByte',             // Short label on home screen
        description: 'Insights on revival, tech, personal growth, and more from Benin City.',
        theme_color: '#ffffff',              // Match your site's theme (change if needed)
        background_color: '#ffffff',
        display: 'standalone',               // Opens like a native app (no browser UI)
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'          // Rounded/masked icon support
          },
        ],
      },
      workbox: {
        navigateFallback: '/',               // Serve home for unmatched routes (good for SPA feel)
        globPatterns: ['**/*.{js,css,html,svg,png,ico,jpg,webp,woff,woff2}'],  // Cache your assets
      },
      // devOptions: { enabled: true },     // Uncomment to test PWA features in dev (preview mode)
    }),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
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
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
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
  },
});
