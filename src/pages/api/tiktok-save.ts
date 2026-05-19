export const prerender = false;

import type { APIRoute } from "astro";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
    const body = await request.json();
    const rawUrl = body.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Please provide a valid TikTok URL",
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

    const cleanUrl = rawUrl.trim();

    // Validate URL
    if (!cleanUrl.includes("tiktok.com")) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid TikTok URL",
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

    // RapidAPI endpoint
    const apiUrl =
      `https://tiktok-video-no-watermark2.p.rapidapi.com/?url=${encodeURIComponent(cleanUrl)}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-host":
          "tiktok-video-no-watermark2.p.rapidapi.com",

        "x-rapidapi-key":
          import.meta.env.RAPIDAPI_KEY,

        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Could not contact TikTok server",
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

    const data = await response.json();

    // Debug log
    console.log("TikTok API Response:", data);

    const video =
      data.data ||
      data;

    return new Response(
      JSON.stringify({
        success: true,

        title:
          video.title ||
          "TikTok Video",

        author:
          video.author ||
          "Unknown",

        thumbnail:
          video.cover ||
          video.origin_cover ||
          "",

        videoNoWatermark:
          video.play ||
          video.wmplay ||
          "",

        music:
          video.music ||
          "",
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
    console.error("TikTok API Error:", err);

    return new Response(
      JSON.stringify({
        success: false,
        error:
          err?.message ||
          "Something went wrong",
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
