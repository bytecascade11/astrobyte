import { SITE } from "@/config";
import { collection } from "astro:content";

export async function get() {
  const posts = await collection("blog");

  const items = posts
    .filter(post => !post.data.draft && post.data.coverImage)
    .map(post => {
      const slug = post.id.replace(/^blog\//, "");
      const postUrl = `${SITE.website}posts/${slug}/`;
      const lastmod = post.data.modDatetime
        ? post.data.modDatetime.toISOString()
        : post.data.pubDatetime.toISOString();
      const imageUrl = post.data.coverImage.startsWith("http")
        ? post.data.coverImage
        : `${SITE.website}${post.data.coverImage.replace(/^\/+/, "")}`;

      return `
  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
    </image:image>
  </url>`;
    }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${items}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
