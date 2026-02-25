import { getCollection } from "astro:content";

export async function GET() {
  const posts = await getCollection("posts");

  // Filter out draft posts
  const publishedPosts = posts.filter((post) => !post.data.draft);

  // Build XML entries for images
  const sitemapEntries = publishedPosts
    .map((post) => {
      // Only include images if they exist
      if (!post.data.image) return "";

      const lastmod = (post.data.updatedAt ?? post.data.date).toISOString();

      return `
  <url>
    <loc>https://www.revibyte.blog/posts/${post.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <image:image>
      <image:loc>${post.data.image}</image:loc>
      <image:caption>${post.data.title}</image:caption>
    </image:image>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
  ${sitemapEntries}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
