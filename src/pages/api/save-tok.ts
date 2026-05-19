export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { url } = await request.json();

    if (!url || !url.includes("tiktok.com")) {
      return new Response(JSON.stringify({ error: "Please enter a valid TikTok URL." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Use tikwm.com API — free, no key needed, reliable
    const apiRes = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (compatible; ReviByte/1.0)",
      },
      body: new URLSearchParams({
        url: url.trim(),
        count: "12",
        cursor: "0",
        web: "1",
        hd: "1",
      }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await apiRes.json();

    if (!apiRes.ok || data.code !== 0) {
      return new Response(
        JSON.stringify({ error: data.msg || "Could not fetch video. Make sure the TikTok link is valid and public." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
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
        // No watermark video (HD)
        videoNoWatermark: video.hdplay || video.play || "",
        // Standard no-watermark
        videoSD: video.play || "",
        // Audio only (MP3)
        audio: video.music_info?.play || video.music || "",
        audioTitle: video.music_info?.title || "Audio",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("TikTok saver error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
