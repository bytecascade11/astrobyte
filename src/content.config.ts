// src/content/config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";

// --------------- Blog Collection ---------------
const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default(SITE.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      timezone: z.string().optional(),
      ogImage: image().optional().or(z.string().url().optional()),
      canonicalURL: z.string().url().optional(),
      tags: z.array(z.string()).default(["others"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      slug: z.string().optional(),
      coverImage: z.string().optional(),
      coverImageAlt: z.string().optional(),
      hideEditPost: z.boolean().optional().default(false),
    }),
});
// --------------- itel Collection ---------------
const itel = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/itel" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default(SITE.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      lastUpdated: z.string().optional(),
      ogImage: image().optional().or(z.string().url().optional()),
      canonicalURL: z.string().url().optional(),
      coverImage: z.string().optional(),
      coverImageAlt: z.string().optional(),
      type: z.enum(["review", "comparison", "buying-guide", "news"]).default("review"),
      model: z.string().optional(),        // e.g. "itel S24"
      priceNGN: z.number().optional(),
      rating: z.number().min(0).max(5).optional(),
      tags: z.array(z.string()).default(["itel"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      relatedSlugs: z.array(z.string()).optional(),
      slug: z.string().optional(),
    }),
});
// --------------- CODM Collection ---------------
const codm = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/codm" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default(SITE.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      lastUpdated: z.string().optional(),
      ogImage: image().optional().or(z.string().url().optional()),
      canonicalURL: z.string().url().optional(),
      coverImage: z.string().optional(),
      coverImageAlt: z.string().optional(),
      type: z.enum(["loadout", "tier-list", "guide", "settings", "news"]).default("guide"),
      gameMode: z.enum(["Multiplayer", "Battle Royale", "Ranked", "All Modes"]).optional(),
      season: z.string().optional(),
      tags: z.array(z.string()).default(["codm"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      relatedSlugs: z.array(z.string()).optional(),
      slug: z.string().optional(),
    }),
});

// --------------- eFootball Collection ---------------
const efootball = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/efootball" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default(SITE.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      lastUpdated: z.string().optional(),
      ogImage: image().optional().or(z.string().url().optional()),
      canonicalURL: z.string().url().optional(),
      coverImage: z.string().optional(),
      coverImageAlt: z.string().optional(),
      type: z.enum(["formation", "guide", "tier-list", "player-review", "news"]).default("guide"),
      formation: z.string().optional(),
      division: z.string().optional(),
      version: z.string().optional(),
      tags: z.array(z.string()).default(["efootball"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      relatedSlugs: z.array(z.string()).optional(),
      slug: z.string().optional(),
    }),
});

// --------------- PUBG Mobile Collection ---------------
const pubgmobile = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/pubgmobile" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default(SITE.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      lastUpdated: z.string().optional(),
      ogImage: image().optional().or(z.string().url().optional()),
      canonicalURL: z.string().url().optional(),
      coverImage: z.string().optional(),
      coverImageAlt: z.string().optional(),
      type: z.enum(["loadout", "tier-list", "guide", "settings", "news"]).default("guide"),
      gameMode: z.enum(["Classic", "Arena", "Ranked", "All Modes"]).optional(),
      season: z.string().optional(),
      tags: z.array(z.string()).default(["pubgmobile"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      relatedSlugs: z.array(z.string()).optional(),
      slug: z.string().optional(),
    }),
});

// --------------- Mobile Legends Collection ---------------
const mlbb = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/mlbb" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default(SITE.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      lastUpdated: z.string().optional(),
      ogImage: image().optional().or(z.string().url().optional()),
      canonicalURL: z.string().url().optional(),
      coverImage: z.string().optional(),
      coverImageAlt: z.string().optional(),
      type: z.enum(["hero-guide", "tier-list", "guide", "settings", "news"]).default("guide"),
      role: z.enum(["Tank", "Fighter", "Assassin", "Mage", "Marksman", "Support", "All Roles"]).optional(),
      season: z.string().optional(),
      tags: z.array(z.string()).default(["mlbb"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      relatedSlugs: z.array(z.string()).optional(),
      slug: z.string().optional(),
    }),
});

export const collections = {
  blog,
  itel,
  codm,
  efootball,
  pubgmobile,
  mlbb,
};
