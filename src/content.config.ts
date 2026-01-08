// src/content/config.ts  ← Keep it in src/content/ if that's where it is now
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.md",
    base: `./${BLOG_PATH}`,
  }),

  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine((img) => img.width >= 1200 && img.height >= 630, { message: "OG image should be at least 1200×630 pixels!" })
        .optional()
        .or(z.string().url().optional()),
      description: z.string(),
      canonicalURL: z.string().url().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      coverImage: z.string().optional(),
      coverImageAlt: z.string().optional(),
    }),
});

export const collections = {
  blog,
};
