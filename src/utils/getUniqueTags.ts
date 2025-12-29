// src/utils/getUniqueTags.ts
import type { CollectionEntry } from "astro:content";

export default function getUniqueTags(posts: CollectionEntry<"blog">[]) {
  const tagMap = new Map<string, { count: number; tagName: string }>();

  posts.forEach((post) => {
    const postTags = post.data.tags ?? [];
    postTags.forEach((tag) => {
      const lowerTag = tag.toLowerCase().trim();
      if (lowerTag) {
        const current = tagMap.get(lowerTag);
        const displayName = tag; // Preserve original casing
        tagMap.set(lowerTag, {
          count: (current?.count ?? 0) + 1,
          tagName: displayName,
        });
      }
    });
  });

  // Sort by count descending, then alphabetically
  return Array.from(tagMap.entries())
    .map(([tag, info]) => ({
      tag,
      tagName: info.tagName,
      count: info.count,
    }))
    .sort((a, b) => b.count - a.count || a.tagName.localeCompare(b.tagName));
}
