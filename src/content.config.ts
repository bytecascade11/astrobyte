// ============================================================
// ADD THIS TO YOUR EXISTING src/content/config.ts
// Place after your existing `blog` collection definition
// and update the `export const collections` at the bottom
// ============================================================

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
      lastUpdated: z.string().optional(), // e.g. "Season 14 2026"

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
      season: z.string().optional(), // e.g. "Season 14"

      // Categorization
      tags: z.array(z.string()).default(["codm"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),

      // Internal linking
      relatedSlugs: z.array(z.string()).optional(), // slugs of related CODM guides
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
      lastUpdated: z.string().optional(), // e.g. "v4.4.0 2026"

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
      formation: z.string().optional(), // e.g. "4-3-3", "4-2-2-2"
      division: z.string().optional(),  // e.g. "Division 1", "Division 3"
      version: z.string().optional(),   // e.g. "eFootball 2026 v4.4"

      // Categorization
      tags: z.array(z.string()).default(["efootball"]),
      featured: z.boolean().optional(),
      draft: z.boolean().optional().default(false),

      // Internal linking
      relatedSlugs: z.array(z.string()).optional(),
      slug: z.string().optional(),
    }),
});

// ============================================================
// REPLACE your existing export at the bottom of config.ts with:
// ============================================================
export const collections = {
  blog,
  codm,
  efootball,
};
