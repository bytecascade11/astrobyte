import { slugifyStr } from "./slugify"; // Keep if you need it later, but not used here

/**
 * Generate a clean URL path for a blog post.
 * - Uses the last part of the content collection ID (filename or slug)
 * - Strips .md/.mdx extension and any YYYY-MM-DD- date prefix
 * - Prefixes with /posts/ by default (configurable)
 * - Handles nested folders gracefully by taking only the final slug part
 */
export function getPath(
  id: string,                    // post.id from CollectionEntry (e.g. "2024-01-15-my-post.mdx" or "folder/my-post")
  filePath?: string | undefined, // optional, can be removed if never used
  includeBase = true             // set to false if you want just the slug without /posts/
): string {
  // Extract the actual slug part (last segment after any folders)
  const slugPart = id.split("/").pop() || id;

  // Remove file extension (.md or .mdx)
  let cleanSlug = slugPart.replace(/\.mdx?$/, "");

  // Remove optional date prefix (YYYY-MM-DD- or YYYY-MM-DD_)
  cleanSlug = stripDatePrefix(cleanSlug);

  // Optional: apply slugify if your slugs contain special characters
  // (usually not needed since Astro already gives clean slugs)
  // cleanSlug = slugifyStr(cleanSlug);

  // Build final path
  const base = includeBase ? "/posts" : "";
  const path = `\( {base}/ \){cleanSlug}`.replace(/\/+/g, "/"); // normalize multiple slashes

  // Ensure it starts with exactly one slash and has no trailing slash (Astro convention)
  return path.replace(/^\/+/, "/").replace(/\/+$/, "");
}

/**
 * Remove common date prefixes from slugs (YYYY-MM-DD-)
 * More robust: handles variations like YYYY-MM-DD_, YYYY.MM.DD-, etc.
 */
function stripDatePrefix(slug: string): string {
  // Matches common date formats at start: 2024-01-15-, 2024-01-15_, 2024.01.15-
  return slug.replace(/^\d{4}[-._]\d{2}[-._]\d{2}[-._]?/, "").trim();
}
