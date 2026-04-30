// src/content/config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import { SITE } from "@/config";

// Recommended: keep this constant for easier maintenance
export const BLOG_PATH = "src/data/blog";

// --------------- Blog Collection (unchanged) ---------------
const blog = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: `./${BLOG_PATH}`,
  }),

  schema: ({ image }) =>
    z.object({
      // Core fields
      title: z.string(),
      description: z.string(),
      author: z.string().default(SITE.author),

      // Dates
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      timezone: z.string().optional(),

      // SEO / Social
      ogImage: image()
        .optional()
        .or(z.string().url().optional()),

      canonicalURL: z.string().url().optional(),

      // Categorization & Control
      tags: z.array(z.string()).default(["others"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),

      // Custom slug
      slug: z.string().optional(),

      // Cover / Featured image
      coverImage: z.string().optional(),
      coverImageAlt: z.string().optional(),

      // UI/Behavior controls
      hideEditPost: z.boolean().optional().default(false),
    }),
});

// --------------- CODM Collection ---------------
const codm = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/data/codm",
  }),

  schema: ({ image }) =>
    z.object({
      // Core
      title: z.string(),
      description: z.string(),
      author: z.string().default(SITE.author),

      // Dates
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      lastUpdated: z.string().optional(),

      // SEO / Social
      ogImage: image().optional().or(z.string().url().optional()),
      canonicalURL: z.string().url().optional(),

      // Cover image
      coverImage: z.string().optional(),
      coverImageAlt: z.string().optional(),

      // Gaming-specific metadata
      type: z
        .enum(["loadout", "tier-list", "guide", "settings", "news"])
        .default("guide"),
      gameMode: z
        .enum(["Multiplayer", "Battle Royale", "Ranked", "All Modes"])
        .optional(),
      season: z.string().optional(),

      // Categorization
      tags: z.array(z.string()).default(["codm"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),

      // Internal linking
      relatedSlugs: z.array(z.string()).optional(),
      slug: z.string().optional(),
    }),
});

// --------------- eFootball Collection ---------------
const efootball = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/data/efootball",
  }),

  schema: ({ image }) =>
    z.object({
      // Core
      title: z.string(),
      description: z.string(),
      author: z.string().default(SITE.author),

      // Dates
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      lastUpdated: z.string().optional(),

      // SEO / Social
      ogImage: image().optional().or(z.string().url().optional()),
      canonicalURL: z.string().url().optional(),

      // Cover image
      coverImage: z.string().optional(),
      coverImageAlt: z.string().optional(),

      // Gaming-specific metadata
      type: z
        .enum(["formation", "guide", "tier-list", "player-review", "news"])
        .default("guide"),
      formation: z.string().optional(),
      division: z.string().optional(),
      version: z.string().optional(),

      // Categorization
      tags: z.array(z.string()).default(["efootball"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),

      // Internal linking
      relatedSlugs: z.array(z.string()).optional(),
      slug: z.string().optional(),
    }),
});

// Export collections
export const collections = {
  blog,
  codm,
  efootball,
};
