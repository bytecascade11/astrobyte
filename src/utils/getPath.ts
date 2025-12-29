// src/utils/getPath.ts
import { BLOG_PATH } from "@/content/config"; // ← Removed .ts extension
import { slugifyStr } from "./slugify";

/**
 * Generate a clean, nested URL path for a blog post
 * 
 * Examples:
 * - File: src/data/blog/hello-world.md                  → /posts/hello-world
 * - File: src/data/blog/2024-01-01-my-post.md           → /posts/my-post
 * - File: src/data/blog/projects/astro-guide.md        → /posts/projects/astro-guide
 * 
 * @param id - The entry.id from getCollection()
 * @param filePath - The full file path (provided by Astro)
 * @param includeBase - Whether to include "/posts" at the root (default: true)
 * @returns Clean URL path like "/posts/projects/my-post"
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
): string {
  // Safety fallback
  if (!filePath || !id) {
    const cleanSlug = stripDatePrefix(id);
    const basePath = includeBase ? "/posts" : "";
    return `\( {basePath}/ \){cleanSlug}`.replace(/\/+/g, "/");
  }

  // Extract relative path inside BLOG_PATH
  const relativePath = filePath
    .replace(BLOG_PATH, "")
    .replace(/^\//, "")
    .split("/")
    .filter(Boolean);

  // Remove filename (last segment)
  const dirSegments = relativePath.slice(0, -1);

  // Clean directories: skip _ folders and slugify
  const cleanDirSegments = dirSegments
    .filter((segment) => !segment.startsWith("_"))
    .map((segment) => slugifyStr(segment));

  // Clean slug from id
  const cleanSlug = stripDatePrefix(id.split("/").pop() || id);

  // Build final path
  const basePath = includeBase ? "/posts" : "";
  const pathParts = [basePath, ...cleanDirSegments, cleanSlug].filter(Boolean);

  return pathParts.join("/");
}

/**
 * Remove YYYY-MM-DD- prefix from slugs
 */
function stripDatePrefix(slug: string): string {
  return slug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}
