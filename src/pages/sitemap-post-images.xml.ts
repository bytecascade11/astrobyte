// src/pages/sitemap-post-images.xml.ts
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import { SITE } from "@/config";

export async function GET() {
  const websiteBase = SITE.website.endsWith("/")
    ? SITE.website
    : `${SITE.website}/`;

  // Fetch all collections
  const [blogPosts, codmPosts, efootballPosts, pubgPosts, freeFirePosts, mlbbPosts] = await Promise.all([
    getCollection("blog", ({ data }) => !data.draft),
    getCollection("codm", ({ data }) => !data.draft),
    getCollection("efootball", ({ data }) => !data.draft),
    getCollection("pubgmobile", ({ data }) => !data.draft),
    getCollection("mlbb", ({ data }) => !data.draft),
  ]);
  // Blog posts — use getPath like before
  const blogEntries = blogPosts
    .filter((post) => post.data.coverImage)
    .map((post) => {
      const postPath = getPath(post.id, post.filePath);
      const postUrl = new URL(
        postPath.startsWith("/") ? postPath.slice(1) : postPath,
        websiteBase
      ).toString();
      const imageUrl = buildImageUrl(post.data.coverImage as string, websiteBase);
      const imageTitle = post.data.coverImageAlt || post.data.title;
      return buildEntry(postUrl, imageUrl, imageTitle);
    });

  // Gaming hub posts — use slug-based URLs
  const codmEntries = codmPosts
    .filter((g) => g.data.coverImage)
    .map((g) => {
      const slug = g.data.slug ?? g.id;
      const postUrl = `${websiteBase}codm/${slug}/`;
      const imageUrl = buildImageUrl(g.data.coverImage as string, websiteBase);
      return buildEntry(postUrl, imageUrl, g.data.coverImageAlt || g.data.title);
    });

  const efootballEntries = efootballPosts
    .filter((g) => g.data.coverImage)
    .map((g) => {
      const slug = g.data.slug ?? g.id;
      const postUrl = `${websiteBase}efootball/${slug}/`;
      const imageUrl = buildImageUrl(g.data.coverImage as string, websiteBase);
      return buildEntry(postUrl, imageUrl, g.data.coverImageAlt || g.data.title);
    });

  const pubgEntries = pubgPosts
    .filter((g) => g.data.coverImage)
    .map((g) => {
      const slug = g.data.slug ?? g.id;
      const postUrl = `${websiteBase}pubgmobile/${slug}/`;
      const imageUrl = buildImageUrl(g.data.coverImage as string, websiteBase);
      return buildEntry(postUrl, imageUrl, g.data.coverImageAlt || g.data.title);
    });

  const mlbbEntries = mlbbPosts
    .filter((g) => g.data.coverImage)
    .map((g) => {
      const slug = g.data.slug ?? g.id;
      const postUrl = `${websiteBase}mlbb/${slug}/`;
      const imageUrl = buildImageUrl(g.data.coverImage as string, websiteBase);
      return buildEntry(postUrl, imageUrl, g.data.coverImageAlt || g.data.title);
    });

  const allEntries = [
    ...blogEntries,
    ...codmEntries,
    ...efootballEntries,
    ...pubgEntries,
    ...mlbbEntries,
  ].join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>${allEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function buildImageUrl(coverImage: string, websiteBase: string): string {
  const cleanPath = coverImage.startsWith("/") ? coverImage.slice(1) : coverImage;
  return new URL(cleanPath, websiteBase).toString();
}

function buildEntry(postUrl: string, imageUrl: string, imageTitle: string): string {
  return `
  <url>
    <loc>${postUrl}</loc>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${escapeXml(imageTitle)}</image:title>
    </image:image>
  </url>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
