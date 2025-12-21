import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

// Ensure this path matches where your .md files are located
export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      // Use coerce.date to prevent crashes with ISO strings
      pubDatetime: z.coerce.date(), 
      modDatetime: z.coerce.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      // Allow both local images and external URL strings
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),

      // Support for Hero/Cover images in the post body
      coverImage: image().or(z.string()).optional(),
      coverImageAlt: z.string().optional(),
    }),
});

export const collections = { blog };
