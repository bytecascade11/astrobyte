// src/content/config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import { SITE } from "@/config";

// Recommended: keep this constant for easier maintenance
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
        .refine((img) => img.width >= 1200 && img.height >= 630, {
          message: "OG image must be at least 1200×630 pixels!",
        })
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

// Export collections
export const collections = {
  blog,
};
