import { getCollection } from "astro:content";
import { SITE } from "@/config";

export async function get() {
  const posts = await getCollection("blog");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts
  .map((post) => {
    // Compute slug from post.id (removes 'blog/' prefix)
    const slug = post.id.replace(/^blog\//, "");
    const url = `${SITE.website}posts/${slug}/`;
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${post.data.modDatetime?.toISOString() || post.data.pubDatetime.toISOString()}</lastmod>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
