export const prerender = false;

import type { APIRoute } from "astro";

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
      return new Response(
        JSON.stringify({ error: "Invalid JSON body." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const rawUrl = body.url;
    if (typeof rawUrl !== "string" || !rawUrl.trim()) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid TikTok URL." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl.trim());
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid URL format." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");
    if (!hostname.endsWith("tiktok.com")) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid TikTok URL." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Clean the URL — remove tracking params that break tikwm
    const cleanUrl = rawUrl.trim().split("?")[0];

    // Build form data properly
    const formData = new URLSearchParams();
    formData.append("url", cleanUrl);
    formData.append("count", "12");
    formData.append("cursor", "0");
    formData.append("web", "1");
    formData.append("hd", "1");

    const apiRes = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": "https://www.tikwm.com",
        "Referer": "https://www.tikwm.com/",
      },
      body: formData.toString(),
      signal: AbortSignal.timeout(15000),
    });

    if (!apiRes.ok) {
      return new Response(
        JSON.stringify({ error: "Could not contact video server. Try again later." }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data = await apiRes.json();

    if (data.code !== 0 || !data.data) {
      return new Response(
        JSON.stringify({
          error: data.msg || "Could not fetch video. Make sure the link is public and valid.",
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const video = data.data;

    return new Response(
      JSON.stringify({
        success: true,
        title: video.title || "TikTok Video",
        author: video.author?.nickname || video.author?.unique_id || "Unknown",
        avatar: video.author?.avatar || "",
        cover: video.cover || "",
        duration: video.duration || 0,
        plays: video.play_count || 0,
        likes: video.digg_count || 0,
        comments: video.comment_count || 0,
        shares: video.share_count || 0,
        videoNoWatermark: video.hdplay || video.play || "",
        videoSD: video.play || "",
        audio: video.music_info?.play || video.music || "",
        audioTitle: video.music_info?.title || "TikTok Audio",
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
      JSON.stringify({ error: "Something went wrong. Please try again in a moment." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};
