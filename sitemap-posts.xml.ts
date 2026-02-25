import { getCollection } from "astro:content";

export async function GET() {
  // Get all posts from the "posts" collection
  const posts = await getCollection("posts");

  // Filter out draft posts
  const publishedPosts = posts.filter((post) => !post.data.draft);

  // Build XML entries
  const sitemapEntries = publishedPosts
    .map((post) => {
      const lastmod = (post.data.updatedAt ?? post.data.date).toISOString();
      return `
  <url>
    <loc>https://www.revibyte.blog/posts/${post.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  ${sitemapEntries}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
