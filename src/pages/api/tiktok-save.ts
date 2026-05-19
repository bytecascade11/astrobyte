export const prerender = false;

import type { APIRoute } from "astro";
import { getVideoMeta } from "tiktok-scraper";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: { url?: unknown };

    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON body.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const rawUrl = body.url;

    if (typeof rawUrl !== "string" || !rawUrl.trim()) {
      return new Response(
        JSON.stringify({
          error: "Please provide a valid TikTok URL.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Validate URL
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(rawUrl.trim());
    } catch {
      return new Response(
        JSON.stringify({
          error: "Invalid URL format.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const hostname = parsedUrl.hostname
      .toLowerCase()
      .replace(/^www\./, "");

    if (!hostname.includes("tiktok.com")) {
      return new Response(
        JSON.stringify({
          error: "Please enter a valid TikTok URL.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Fetch TikTok data using tiktok-scraper
    const result = (await getVideoMeta(rawUrl, {})) as any;

    if (!result) {
      return new Response(
        JSON.stringify({
          error: "Could not fetch TikTok video.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        title: result.text || "TikTok Video",
        author: result.authorMeta?.name || "Unknown",
        avatar: result.authorMeta?.avatar || "",
        cover: result.covers?.default || result.imageUrl || "",
        duration: result.videoMeta?.duration || 0,
        videoNoWatermark: result.videoUrl || "",
        videoWatermark: result.videoUrlNoWaterMark || result.videoUrl || "",
        audio: result.musicMeta?.musicUrl || "",
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
  } catch (err) {
    console.error("TikTok downloader error:", err);

    return new Response(
      JSON.stringify({
        error: "Something went wrong. Please try again.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};
            
