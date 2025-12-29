// src/content/config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

// Define the base path for your blog posts
// Adjust this if your posts are in a different folder
export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  // Use glob loader to load all .md files (excluding those starting with _)
  loader: glob({
    pattern: "**/[^_]*.md",        // Matches all .md files, ignores _filename.md
    base: `./${BLOG_PATH}`,       // Relative to project root
  }),

  // Schema with proper image() usage and safe defaults
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      
      // Use coerce.date() for safe parsing of ISO date strings
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),

      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),

      tags: z.array(z.string()).default(["others"]),

      // ogImage: can be a local image (via import) or external URL
      ogImage: image()
        .refine((img) => img.width >= 1200 && img.height >= 630, {
          message: "OG image should be at least 1200×630 pixels for best social sharing",
        })
        .optional()
        .or(z.string().url().optional()),

      description: z.string(),

      canonicalURL: z.string().url().optional(),

      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),

      // Optional cover/hero image in post content
      coverImage: image().optional().or(z.string().url().optional()),
      coverImageAlt: z.string().optional(),
    }),
});

export const collections = {
  blog,
};
