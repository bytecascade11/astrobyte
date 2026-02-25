// src/pages/sitemap-post-images.xml.ts
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export async function GET() {
  const posts: CollectionEntry<"posts">[] = await getCollection("posts");

  const filteredPosts = posts.filter((post) => !post.data.draft);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${filteredPosts
    .map((post) => {
      if (!post.data.coverImage) return "";
      return `<url>
    <loc>https://yourdomain.com/${post.slug}/</loc>
    <image:image>
      <image:loc>${post.data.coverImage}</image:loc>
      <image:caption>${post.data.coverImageAlt ?? ""}</image:caption>
    </image:image>
  </url>`;
    })
    .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
