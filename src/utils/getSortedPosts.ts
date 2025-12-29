// src/utils/getSortedPosts.ts
import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

/**
 * Filters and sorts blog posts by date (modified first, then published)
 * 
 * - Excludes drafts and any other posts filtered out by postFilter
 * - Uses modDatetime if available, falls back to pubDatetime
 * - Sorts descending (newest first)
 */
const getSortedPosts = (posts: CollectionEntry<"blog">[]): CollectionEntry<"blog">[] => {
  return posts
    .filter(postFilter) // Remove drafts, hidden posts, etc.
    .sort((a, b) => {
      const dateA = a.data.modDatetime ?? a.data.pubDatetime;
      const dateB = b.data.modDatetime ?? b.data.pubDatetime;

      // Convert to timestamp (in seconds or milliseconds — both work for comparison)
      return dateB.getTime() - dateA.getTime();
    });
};

export default getSortedPosts;
