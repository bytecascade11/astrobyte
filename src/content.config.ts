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
// --------------- Samsung Collection ---------------
const samsung = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/samsung" }),
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
      model: z.string().optional(),        // e.g. "Galaxy S25 Ultra"
      priceNGN: z.number().optional(),
      rating: z.number().min(0).max(5).optional(),
      ram: z.string().optional(),          // e.g. "12GB"
      storage: z.string().optional(),      // e.g. "256GB"
      battery: z.string().optional(),      // e.g. "5000mAh"
      display: z.string().optional(),      // e.g. "6.8in Dynamic AMOLED"
      tags: z.array(z.string()).default(["samsung"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      relatedSlugs: z.array(z.string()).optional(),
      slug: z.string().optional(),
    }),
});
// --------------- Xiaomi Collection ---------------
const xiaomi = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/xiaomi" }),
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
      model: z.string().optional(),        // e.g. "Redmi Note 14 Pro"
      subBrand: z.enum(["xiaomi", "redmi", "poco"]).optional(),
      software: z.string().optional(),     // e.g. "HyperOS 2.0"
      priceNGN: z.number().optional(),
      rating: z.number().min(0).max(5).optional(),
      tags: z.array(z.string()).default(["xiaomi"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      relatedSlugs: z.array(z.string()).optional(),
      slug: z.string().optional(),
    }),
});
// --------------- Tecno Collection ---------------
const tecno = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/tecno" }),
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
      model: z.string().optional(),        // e.g. "Camon 40 Pro"
      software: z.string().optional(),     // e.g. "HiOS 15"
      priceNGN: z.number().optional(),
      rating: z.number().min(0).max(5).optional(),
      ram: z.string().optional(),          // e.g. "8GB"
      storage: z.string().optional(),      // e.g. "256GB"
      battery: z.string().optional(),      // e.g. "5000mAh"
      display: z.string().optional(),      // e.g. "6.78in AMOLED"
      comparedTo: z.string().optional(),        // e.g. "itel S25"
      comparedToSlug: z.string().optional(),    // slug of the comparison post
      tags: z.array(z.string()).default(["tecno"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      relatedSlugs: z.array(z.string()).optional(),
      slug: z.string().optional(),
    }),
});
// --------------- Motorola Collection ---------------
const motorola = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/motorola" }),
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
      model: z.string().optional(),        // e.g. "Edge 60 Pro"
      chargingSpeed: z.string().optional(), // e.g. "125W TurboPower"
      software: z.string().optional(),     // e.g. "Android 15, Hello UX"
      priceNGN: z.number().optional(),
      rating: z.number().min(0).max(5).optional(),
      tags: z.array(z.string()).default(["motorola"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      relatedSlugs: z.array(z.string()).optional(),
      slug: z.string().optional(),
    }),
});
// --------------- Huawei Collection ---------------
const huawei = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/huawei" }),
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
      model: z.string().optional(),          // e.g. "Pura 70 Pro"
      gmsStatus: z.enum(["full", "appgallery", "partial"]).optional(), // Google Play Store availability
      cameraHighlight: z.string().optional(), // e.g. "50MP Leica-tuned triple camera"
      ram: z.string().optional(),
      storage: z.string().optional(),
      battery: z.string().optional(),
      display: z.string().optional(),
      priceNGN: z.number().optional(),
      rating: z.number().min(0).max(5).optional(),
      tags: z.array(z.string()).default(["huawei"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      relatedSlugs: z.array(z.string()).optional(),
      comparedTo: z.string().optional(),
      comparedToSlug: z.string().optional(),
      slug: z.string().optional(),
    }),
});
// --------------- Honor Collection ---------------
const honor = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/honor" }),
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
      model: z.string().optional(),          // e.g. "Magic 7 Pro"
      curvedDisplay: z.boolean().optional(), // Honor's brand differentiator spec
      ram: z.string().optional(),
      storage: z.string().optional(),
      battery: z.string().optional(),
      display: z.string().optional(),
      priceNGN: z.number().optional(),
      rating: z.number().min(0).max(5).optional(),
      tags: z.array(z.string()).default(["honor"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      relatedSlugs: z.array(z.string()).optional(),
      comparedTo: z.string().optional(),
      comparedToSlug: z.string().optional(),
      slug: z.string().optional(),
    }),
});
// --------------- OnePlus Collection ---------------
const oneplus = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/data/oneplus" }),
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
      model: z.string().optional(),        // e.g. "13", "Nord 5", "13R"
      series: z.enum(["Nord", "Numbered", "R"]).default("Numbered"),
      fastCharging: z.string().optional(), // e.g. "100W SuperVOOC"
      hasselblad: z.boolean().optional(),  // Hasselblad camera partnership, OnePlus's brand differentiator
      oxygenOS: z.string().optional(),     // e.g. "OxygenOS 15"
      ram: z.string().optional(),
      storage: z.string().optional(),
      battery: z.string().optional(),
      display: z.string().optional(),
      priceNGN: z.number().optional(),
      rating: z.number().min(0).max(5).optional(),
      tags: z.array(z.string()).default(["oneplus"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),
      relatedSlugs: z.array(z.string()).optional(),
      comparedTo: z.string().optional(),
      comparedToSlug: z.string().optional(),
      slug: z.string().optional(),
    }),
});

export const collections = {
  blog,
  codm,
  efootball,
  pubgmobile,
  mlbb,
  samsung,
  xiaomi,
  tecno,
  motorola,
  huawei,
  honor,
  oneplus,
};
