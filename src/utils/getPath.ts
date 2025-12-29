// src/utils/getPath.ts
import { BLOG_PATH } from "@/content/config"; // Fixed import path
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
 * @param filePath - The full file path (provided by Astro, e.g., "/path/to/project/src/data/blog/projects/astro-guide.md")
 * @param includeBase - Whether to include "/posts" at the root (default: true)
 * @returns Clean URL path like "/posts/projects/my-post"
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
): string {
  // Safety: if no filePath, fall back to just using the id
  if (!filePath || !id) {
    const slug = stripDatePrefix(id);
    const base = includeBase ? "/posts" : "";
    return `\( {base}/ \){slug}`.replace(/\/+/g, "/"); // avoid double slashes
  }

  // Normalize and extract directory segments inside BLOG_PATH
  const relativePath = filePath
    .replace(BLOG_PATH, "")        // Remove the base blog folder
    .replace(/^\//, "")            // Remove leading slash
    .split("/")                    // Split into segments
    .filter(Boolean);              // Remove empty strings

  // Remove the filename (last segment)
  const dirSegments = relativePath.slice(0, -1);

  // Filter out any directories starting with _ (private/drafts)
  const cleanDirSegments = dirSegments
    .filter((segment) => !segment.startsWith("_"))
    .map((segment) => slugifyStr(segment));

  // Extract clean slug from id (remove date prefix if present)
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
