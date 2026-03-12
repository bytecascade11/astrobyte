// src/utils/getPath.ts

/**
 * Generate a clean URL path for a blog post.
 * Trailing slash is always included to match astro.config.ts trailingSlash: "always"
 */
export function getPath(
  id: string,
  filePath?: string,
  includeBase = true
): string {
  // Get the filename/slug part (ignores folders)
  const slugPart = id.split("/").pop() || id;

  // Remove .md or .mdx extension
  let cleanSlug = slugPart.replace(/\.mdx?$/, "");

  // Strip date prefix (YYYY-MM-DD-)
  cleanSlug = cleanSlug
    .replace(/^\d{4}[-._]\d{2}[-._]\d{2}[-._]?/, "")
    .trim();

  const base = includeBase ? "/posts" : "";

  // Build path
  let path = `${base}/${cleanSlug}`;

  // Normalize duplicate slashes
  path = path.replace(/\/+/g, "/");

  // Always add trailing slash to match trailingSlash: "always" in astro.config.ts
  // This prevents redirect + canonical mismatch that blocks Google indexing
  if (!path.endsWith("/")) path = path + "/";

  // Ensure leading slash
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return path;
}
