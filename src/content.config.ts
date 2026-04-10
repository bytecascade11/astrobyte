// src/content/config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";

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

      // Cover / Featured image  ← Updated here
      coverImage: image().optional(),        // ← Now uses image() helper
      coverImageAlt: z.string().optional(),

      // UI/Behavior controls
      hideEditPost: z.boolean().optional().default(false),
    }),
});

// Export collections
export const collections = {
  blog,
};
