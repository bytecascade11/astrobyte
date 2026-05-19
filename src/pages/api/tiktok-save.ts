export const prerender = false;

import type { APIRoute } from "astro";

// CORS headers for browser requests
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
    // Parse and validate request body
    let body: { url?: unknown };
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const rawUrl = body.url;

    // Validate URL type
    if (typeof rawUrl !== "string" || !rawUrl.trim()) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid TikTok URL." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Parse and validate URL format + domain
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl.trim());
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid URL format." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate TikTok domain
    const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");
    const allowedDomains = ["tiktok.com", "vt.tiktok.com"];
    
    if (!allowedDomains.includes(hostname) && !hostname.endsWith(".tiktok.com")) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid TikTok URL." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Fetch video info from tikwm API
    const apiRes = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (compatible; ReviByte/1.0)",
      },
      body: new URLSearchParams({
        url: rawUrl.trim(),
        count: "12",
        cursor: "0",
        web: "1",
        hd: "1",
      }),
      signal: AbortSignal.timeout(15000),
    });

    // Handle invalid API response
    if (!apiRes.ok) {
      return new Response(
        JSON.stringify({
          error: "Could not contact video server. Try again later.",
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const data = await apiRes.json();

    // Handle TikWM API errors
    if (data.code !== 0 || !data.data) {
      return new Response(
        JSON.stringify({
          error:
            data.msg ||
            "Could not fetch video. Make sure the TikTok link is public and valid.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const video = data.data;

    // Success response
    return new Response(
      JSON.stringify({
        success: true,

        // Basic info
        title: video.title || "TikTok Video",
        author:
          video.author?.nickname ||
          video.author?.unique_id ||
          "Unknown",

        avatar: video.author?.avatar || "",
        cover: video.cover || "",

        // Stats
        duration: video.duration || 0,
        plays: video.play_count || 0,
        likes: video.digg_count || 0,
        comments: video.comment_count || 0,
        shares: video.share_count || 0,

        // Video links — HD first, fallback to SD
        videoNoWatermark: video.hdplay || video.play || "",
        videoSD: video.play || "",

        // Audio
        audio:
          video.music_info?.play ||
          video.music ||
          "",

        audioTitle:
          video.music_info?.title ||
          "TikTok Audio",
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
    console.error("TikTok saver error:", err);

    return new Response(
      JSON.stringify({
        error:
          "Something went wrong. Please try again in a moment.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};
