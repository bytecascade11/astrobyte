export const prerender = false;

import type { APIRoute } from "astro";

interface AllowedSource {
  match: (hostname: string) => boolean;
  referer?: string;
}

const allowedSources: AllowedSource[] = [
  {
    match: (h) =>
      [
        "p16-sign.tiktokcdn.com",
        "p19-sign.tiktokcdn.com",
        "p16-sign-va.tiktokcdn.com",
        "p16-sign-sg.tiktokcdn.com",
        "p77-sign-sg.tiktokcdn.com",
        "p16.tiktokcdn.com",
        "tikwm.com",
        "www.tikwm.com",
      ].some((d) => h.endsWith(d)),
    referer: "https://www.tiktok.com/",
  },
  {
    match: (h) =>
      h.endsWith(".cdninstagram.com") ||
      (h.endsWith(".fbcdn.net") && h.includes("instagram")),
    referer: "https://www.instagram.com/",
  },
  {
    match: (h) => h.endsWith("akhmadjonov.uz"),
  },
];

const BROWSER_UA =
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";

export const GET: APIRoute = async ({ url }) => {
  const imageUrl = url.searchParams.get("url");

  if (!imageUrl) {
    return new Response("Missing url param", { status: 400 });
  }

  let hostname = "";
  try {
    hostname = new URL(imageUrl).hostname;
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  const source = allowedSources.find((s) => s.match(hostname));

  if (!source) {
    return new Response("Domain not allowed", { status: 403 });
  }

  try {
    const headers: Record<string, string> = {
      "User-Agent": BROWSER_UA,
    };
    if (source.referer) headers["Referer"] = source.referer;

    const res = await fetch(imageUrl, {
      headers,
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
