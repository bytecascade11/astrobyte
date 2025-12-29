// src/utils/getPath.ts
import { BLOG_PATH } from "../content/config";
import { slugifyStr } from "./slugify";

/**
 * Generate a clean, nested URL path for a blog post
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
): string {
  const basePath = includeBase ? "/posts" : "";

  // Safety fallback
  if (!filePath || !id) {
    const cleanSlug = stripDatePrefix(id);
    return `${basePath}/${cleanSlug}`.replace(/\/+/g, "/");
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
  const pathParts = [basePath, ...cleanDirSegments, cleanSlug].filter(Boolean);

  return pathParts.join("/");
}

/**
 * Remove YYYY-MM-DD- prefix from slugs
 */
function stripDatePrefix(slug: string): string {
  return slug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}
