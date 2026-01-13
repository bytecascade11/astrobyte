// src/utils/getPath.ts

/**
 * Generate a clean URL path for a blog post.
 * - Uses the last part of the content collection ID (filename or slug)
 * - Strips .md/.mdx extension and any YYYY-MM-DD- date prefix
 * - Prefixes with /posts/ by default (configurable)
 * - Handles nested folders by taking only the final slug part
 */
export function getPath(
  id: string,                    // post.id from CollectionEntry (e.g. "2024-01-15-my-post.mdx" or "folder/my-post")
  filePath?: string | undefined, // optional – safe to ignore/remove if unused
  includeBase = true             // false → returns just "/my-slug" without "/posts"
): string {
  // Get the filename/slug part (ignores folders)
  const slugPart = id.split("/").pop() || id;

  // Remove .md or .mdx extension
  let cleanSlug = slugPart.replace(/\.mdx?$/, "");

  // Strip date prefix (handles YYYY-MM-DD-, YYYY-MM-DD_, YYYY.MM.DD-, etc.)
  cleanSlug = cleanSlug.replace(/^\d{4}[-._]\d{2}[-._]\d{2}[-._]?/, "").trim();

  // Optional: if slugs need extra cleaning (rarely needed in your case)
  // cleanSlug = slugifyStr(cleanSlug);

  const base = includeBase ? "/posts" : "";

  // Build the path cleanly
  let path = `\( {base}/ \){cleanSlug}`;

  // Normalize: remove duplicate slashes, remove trailing slash
  path = path.replace(/\/+/g, "/").replace(/\/$/, "");

  // Ensure it starts with exactly one slash
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return path;
}
