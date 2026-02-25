import { SITE } from "@/config";
import { collection } from "astro:content";

export async function get() {
  const posts = await collection("blog");
  
  const items = posts
    .filter(post => !post.data.draft) // skip drafts
    .map(post => {
      const slug = post.id.replace(/^blog\//, ""); // remove collection prefix
      const postUrl = `${SITE.website}posts/${slug}/`;
      const lastmod = post.data.modDatetime
        ? post.data.modDatetime.toISOString()
        : post.data.pubDatetime.toISOString();

      return `
  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
