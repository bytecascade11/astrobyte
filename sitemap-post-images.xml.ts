import { getCollection, CollectionEntry } from "astro:content";

export async function get() {
  const posts: CollectionEntry<"posts">[] = await getCollection("posts");

  const sitemap = posts
    .filter((post) => !post.data.draft && post.data.coverImage)
    .map((post) => {
      return `
        <url>
          <loc>https://yourdomain.com/${post.slug}/</loc>
          <image:image>
            <image:loc>${post.data.coverImage}</image:loc>
            <image:caption>${post.data.title}</image:caption>
          </image:image>
          <lastmod>${post.data.updatedAt ?? post.data.date}</lastmod>
        </url>
      `;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
             xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
       ${sitemap}
     </urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
