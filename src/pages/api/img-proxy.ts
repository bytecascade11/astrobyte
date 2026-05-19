export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const imageUrl = url.searchParams.get("url");

  if (!imageUrl) {
    return new Response("Missing url param", { status: 400 });
  }

  // Only allow known TikTok CDN domains
  const allowed = [
    "p16-sign.tiktokcdn.com",
    "p19-sign.tiktokcdn.com",
    "p16-sign-va.tiktokcdn.com",
    "p16-sign-sg.tiktokcdn.com",
    "p77-sign-sg.tiktokcdn.com",
    "p16.tiktokcdn.com",
    "tikwm.com",
    "www.tikwm.com",
  ];

  let hostname = "";
  try {
    hostname = new URL(imageUrl).hostname;
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  if (!allowed.some(d => hostname.endsWith(d))) {
    return new Response("Domain not allowed", { status: 403 });
  }

  try {
    const res = await fetch(imageUrl, {
      headers: {
        "Referer": "https://www.tiktok.com/",
        "User-Agent": "Mozilla/5.0 (compatible; ReviByte/1.0)",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return new Response("Failed to fetch image", { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Image fetch failed", { status: 500 });
  }
};
