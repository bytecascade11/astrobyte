import { getCollection, CollectionEntry } from "astro:content";

export async function get() {
  const posts: CollectionEntry<"posts">[] = await getCollection("posts");

  const sitemap = posts
    .filter((post) => !post.data.draft)
    .map((post) => {
      return `
        <url>
          <loc>https://yourdomain.com/${post.slug}/</loc>
          <lastmod>${post.data.updatedAt ?? post.data.date}</lastmod>
        </url>
      `;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       ${sitemap}
     </urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
