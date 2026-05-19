export const prerender = false;

import type { APIRoute } from "astro";
import { getVideoMeta } from "tiktok-scraper";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: { url?: unknown };
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const rawUrl = body.url;
    if (typeof rawUrl !== "string" || !rawUrl.trim()) {
      return new Response(JSON.stringify({ error: "Please provide a valid TikTok URL." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl.trim());
    } catch {
      return new Response(JSON.stringify({ error: "Invalid URL format." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");
    if (!hostname.includes("tiktok.com")) {
      return new Response(JSON.stringify({ error: "Please enter a valid TikTok URL." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // DEBUG: Log attempt
    console.log("Fetching TikTok URL:", rawUrl);

    const result = (await getVideoMeta(rawUrl, {})) as any;

    // DEBUG: Log raw result
    console.log("Raw result:", JSON.stringify(result, null, 2));

    if (!result) {
      return new Response(JSON.stringify({ error: "Could not fetch TikTok video." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        title: result.text || result.desc || "TikTok Video",
        author: result.authorMeta?.name || result.author?.nickname || "Unknown",
        avatar: result.authorMeta?.avatar || result.author?.avatar || "",
        cover: result.covers?.default || result.imageUrl || result.videoMeta?.cover || "",
        duration: result.videoMeta?.duration || result.video?.duration || 0,
        videoNoWatermark: result.videoUrlNoWaterMark || result.video?.playAddr || "",
        videoWatermark: result.videoUrl || result.video?.downloadAddr || "",
        audio: result.musicMeta?.musicUrl || result.music?.playUrl || "",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
          ...corsHeaders,
        },
      }
    );
  } catch (err: any) {
    // DEBUG: Log full error details
    console.error("TikTok downloader error:", err);
    console.error("Error message:", err?.message);
    console.error("Error stack:", err?.stack);

    return new Response(
      JSON.stringify({
        error: "Something went wrong. Please try again.",
        debug: err?.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};
