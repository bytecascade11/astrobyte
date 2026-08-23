// src/pages/sitemap-hubs.xml.ts
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "@/config";

const websiteBase = SITE.website.endsWith("/") ? SITE.website : `${SITE.website}/`;

// Every hub collection, mapped to its URL prefix.
// Add new hubs here and they're picked up automatically.
const HUBS = [
  { collection: "samsung", path: "samsung" },
  { collection: "xiaomi", path: "xiaomi" },
  { collection: "tecno", path: "tecno" },
  { collection: "codm", path: "codm" },
  { collection: "efootball", path: "efootball" },
  { collection: "pubgmobile", path: "pubgmobile" },
  { collection: "mlbb", path: "mlbb" },
  { collection: "motorola", path: "motorola" },
  { collection: "huawei", path: "huawei" },
  { collection: "honor", path: "honor" },
] as const;

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = async () => {
  const entries: string[] = [];
  const now = new Date().toISOString();

  for (const hub of HUBS) {
    // Hub index page — treated as high-priority, frequently-updated "section home"
    entries.push(
      urlEntry(`${websiteBase}${hub.path}/`, now, "daily", "0.8")
    );

    // Every published post in the hub
    const posts = await getCollection(hub.collection as any, ({ data }: any) => !data.draft);
    for (const post of posts) {
      const slug = post.data.slug ?? post.id;
      const lastmod = post.data.lastUpdated
        ? new Date(post.data.pubDatetime).toISOString()
        : new Date(post.data.modDatetime ?? post.data.pubDatetime).toISOString();

      entries.push(
        urlEntry(`${websiteBase}${hub.path}/${slug}/`, lastmod, "weekly", "0.7")
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
