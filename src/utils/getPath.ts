import { slugifyStr } from "./slugify";

/**
 * Generate a clean, flat URL path for a blog post.
 * Ignores any folder nesting and uses only the final slug.
 * Works with content collections where post.id = "optional/folder/slug.mdx"
 */
export function getPath(
  id: string,
  filePath?: string | undefined,       // optional - we don't need it anymore
  includeBase = true
): string {
  const basePath = includeBase ? "/posts" : "";

  // Take the last part of id (the actual slug file)
  const slugPart = id.split("/").pop() || id;

  // Remove extension and any date prefix (YYYY-MM-DD-)
  const cleanSlug = stripDatePrefix(slugPart.replace(/\.mdx?$/, ""));

  // Optional: you can still slugify if needed, but usually not necessary
  // const finalSlug = slugifyStr(cleanSlug);

  return `\( {basePath}/ \){cleanSlug}`.replace(/\/+/g, "/");
}

/**
 * Remove YYYY-MM-DD- prefix from slugs
 */
function stripDatePrefix(slug: string): string {
  return slug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}
