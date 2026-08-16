import type { APIRoute } from "astro";
import { SITE } from "../config";

const getRobotsTxt = (sitemapIndexURL: string, hubsSitemapURL: string) => `
User-agent: *
Allow: /
Disallow: /search/
Disallow: /dashboard/

Sitemap: ${sitemapIndexURL}
Sitemap: ${hubsSitemapURL}
`.trim();

export const GET: APIRoute = () => {
  const sitemapIndexURL = new URL("sitemap-index.xml", SITE.website).href;
  const hubsSitemapURL = new URL("sitemap-hubs.xml", SITE.website).href;
  return new Response(getRobotsTxt(sitemapIndexURL, hubsSitemapURL), {
    headers: { "Content-Type": "text/plain" },
  });
};
