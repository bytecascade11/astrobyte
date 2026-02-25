// src/pages/sitemap-posts.xml.ts
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export async function GET() {
  // Fetch all posts from the "posts" collection
  const posts: CollectionEntry<"posts">[] = await getCollection("posts");

  const filteredPosts = posts.filter((post) => !post.data.draft);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${filteredPosts
    .map(
      (post) => `<url>
    <loc>https://yourdomain.com/${post.slug}/</loc>
    <lastmod>${(post.data.updatedAt ?? post.data.date).toISOString()}</lastmod>
  </url>`
    )
    .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
