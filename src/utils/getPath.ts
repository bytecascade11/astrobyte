// src/utils/getPath.ts
import { BLOG_PATH } from "@/content/config.ts"; // ← Added .ts extension
import { slugifyStr } from "./slugify";

/**
 * Generate a clean, nested URL path for a blog post
 * 
 * Examples:
 * - File: src/data/blog/hello-world.md                  → /posts/hello-world
 * - File: src/data/blog/2024-01-01-my-post.md           → /posts/my-post
 * - File: src/data/blog/projects/astro-guide.md        → /posts/projects/astro-guide
 * - File: src/data/blog/_drafts/unfinished.md          → ignored (filtered by glob)
 * 
 * @param id - The entry.id from getCollection() (e.g., "2024-01-01-my-post" or "projects/astro-guide")
 * @param filePath - The full file path (provided by Astro)
 * @param includeBase - Whether to include "/posts" at the root (default: true)
 * @returns Clean URL path like "/posts/projects/my-post"
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
): string {
  // Safety fallback if no filePath or id
  if (!filePath || !id) {
    const cleanSlug = stripDatePrefix(id);
    const base = includeBase ? "/posts" : "";
    return `\( {base}/ \){cleanSlug}`.replace(/\/+/g, "/");
  }

  // Extract relative path inside BLOG_PATH
  const relativePath = filePath
    .replace(BLOG_PATH, "")
    .replace(/^\//, "")
    .split("/")
    .filter(Boolean); // remove empty segments

  // Drop the filename (last segment)
  const dirSegments = relativePath.slice(0, -1);

  // Clean directory segments: skip _prefixed folders and slugify
  const cleanDirSegments = dirSegments
    .filter((segment) => !segment.startsWith("_"))
    .map((segment) => slugifyStr(segment));

  // Clean slug: take the last part of id and strip date prefix
  const cleanSlug = stripDatePrefix(id.split("/").pop() || id);

  // Build final path
  const basePath = includeBase ? "/posts" : "";
  const pathParts = [basePath, ...cleanDirSegments, cleanSlug].filter(Boolean);

  return pathParts.join("/");
}

/**
 * Helper: Remove YYYY-MM-DD- prefix from filename-based slugs
 */
function stripDatePrefix(slug: string): string {
  return slug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}
