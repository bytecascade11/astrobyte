import type { APIRoute } from "astro";
import { SITE } from "../config"; // Adjust path if needed

const getRobotsTxt = (sitemapURL: string) => `
User-agent: *
Allow: /
Disallow: /search/

Sitemap: ${sitemapURL}
`.trim();

export const GET: APIRoute = () => {
  // Use the website URL from your config
  const sitemapURL = new URL("sitemap-index.xml", SITE.website).href;
  return new Response(getRobotsTxt(sitemapURL), {
    headers: { "Content-Type": "text/plain" },
  });
};
