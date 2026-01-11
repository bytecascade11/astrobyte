import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";
import { stripDatePrefix } from "@/utils/slugify"; // optional if you have this

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(({ data, id, filePath }) => {
      // generate a clean slug
      let slug = id; // fallback to id
      if (filePath) {
        // remove date prefix from filename if exists, e.g., "2026-01-11-my-post.md" -> "my-post"
        const fileName = filePath.split("/").pop() ?? id;
        slug = stripDatePrefix(fileName.replace(/\.mdx?$/, ""));
      }

      return {
        link: `${SITE.website}/posts/${slug}/`,
        guid: `${SITE.website}/posts/${slug}/`,
        title: data.title,
        description: data.description,
        pubDate: new Date(data.modDatetime ?? data.pubDatetime),
      };
    }),
  });
}
