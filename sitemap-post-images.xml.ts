// src/pages/sitemap-images.xml.ts
//
// Google Image Sitemap — tells Google which post page owns each cover image.
// This fixes the issue where clicking an image in Google Lens / Google Images
// lands on the homepage instead of the actual post that contains the image.
//
// Reference: https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps

import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import { SITE } from "@/config";

export async function GET() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  const websiteBase = SITE.website.endsWith("/")
    ? SITE.website
    : `${SITE.website}/`;

  // Build one <url> entry per post that has a coverImage
  const urlEntries = posts
    .filter((post) => post.data.coverImage)
    .map((post) => {
      const postPath = getPath(post.id, post.filePath);
      const postUrl = new URL(
        postPath.startsWith("/") ? postPath.slice(1) : postPath,
        websiteBase
      ).toString();

      const coverImage = post.data.coverImage as string;
      const cleanPath = coverImage.startsWith("/")
        ? coverImage.slice(1)
        : coverImage;
      const imageUrl = new URL(cleanPath, websiteBase).toString();
      // e.g. https://www.revibyte.blog/assets/posts/cover-image-xiaomi-17-pro-max.jpg

      const imageTitle = post.data.coverImageAlt || post.data.title;

      return `
  <url>
    <loc>${postUrl}</loc>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${escapeXml(imageTitle)}</image:title>
    </image:image>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
