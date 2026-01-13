// src/utils/getPath.ts

/**
 * Generate a clean URL path for a blog post.
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
  cleanSlug = cleanSlug.replace(
    /^\d{4}[-._]\d{2}[-._]\d{2}[-._]?/,
    ""
  ).trim();

  const base = includeBase ? "/posts" : "";

  // ✅ CORRECT template literal
  let path = `${base}/${cleanSlug}`;

  // Normalize slashes
  path = path.replace(/\/+/g, "/").replace(/\/$/, "");

  // Ensure leading slash
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return path;
}
