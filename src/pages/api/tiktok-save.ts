export const prerender = false;

import type { APIRoute } from "astro";
import pkg from "@tobyg74/tiktok-api-dl";

const { TiktokDL } = pkg;

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

    // Fetch TikTok data
    const result = await TiktokDL(rawUrl);

    if (!result || result.status !== "success") {
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

    const data = result.result;

    return new Response(
      JSON.stringify({
        success: true,

        title: data.desc || "TikTok Video",

        author: data.author?.nickname || "Unknown",

        avatar: data.author?.avatar || "",

        cover: data.cover || "",

        duration: data.duration || 0,

        videoNoWatermark: data.video1 || "",

        videoWatermark: data.video2 || "",

        audio: data.music || "",
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
