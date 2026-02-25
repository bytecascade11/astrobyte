import { getCollection } from "astro:content";
import { SITE } from "@/config";

export async function GET() {
  const posts = await getCollection("blog");

  const urls = posts.map(post => {
    const postUrl = new URL(`/posts/${post.slug}/`, SITE.website).toString();
    const imageUrl = post.data.coverImage
      ? new URL(post.data.coverImage, SITE.website).toString()
      : "";

    return `
      <url>
        <loc>${postUrl}</loc>
        ${imageUrl ? `<image:image><image:loc>${imageUrl}</image:loc></image:image>` : ""}
      </url>`;
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${urls.join("")}
    </urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
