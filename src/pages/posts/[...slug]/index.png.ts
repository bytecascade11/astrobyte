---
import type { APIRoute } from "astro";
import { SITE } from "@/config";

// Disabled dynamic OG image generation
// We now rely on coverImage for social previews (cleaner and what you want)

export async function getStaticPaths() {
  // Return empty — no routes generated
  return [];
}

export const GET: APIRoute = async () => {
  if (SITE.dynamicOgImage) {
    // This won't run because we set dynamicOgImage: false in config
    return new Response(null, { status: 404 });
  }

  // Always return 404 — no dynamic cards
  return new Response(null, {
    status: 404,
    statusText: "Dynamic OG images disabled",
  });
};
