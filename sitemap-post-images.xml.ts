import { getCollection } from "astro:content";
import { SITE } from "@/config";

export async function get() {
  const posts = await getCollection("blog");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${posts
  .map((post) => {
    const slug = post.id.replace(/^blog\//, "");
    const postUrl = `${SITE.website}posts/${slug}/`;
    const coverImage = post.data.coverImage
      ? new URL(post.data.coverImage, SITE.website).toString()
      : undefined;
    if (!coverImage) return ""; // Skip posts without images
    return `  <url>
    <loc>${postUrl}</loc>
    <image:image>
      <image:loc>${coverImage}</image:loc>
    </image:image>
  </url>`;
  })
  .filter(Boolean)
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
}
