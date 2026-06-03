import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

async function trackVisit(request: Request) {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase env vars");
  }

  const supabase = createClient(url, key);

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";

  const ua = request.headers.get("user-agent") || "unknown";
  const raw = `${ip}:${ua}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  const visitorHash = Math.abs(hash).toString(36);
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("daily_visitors")
    .upsert(
      { visit_date: today, visitor_hash: visitorHash },
      { onConflict: "visit_date,visitor_hash" }
    );

  if (error) throw error;
  return { ok: true };
}

// Handle both GET and POST
export const GET: APIRoute = async ({ request }) => {
  try {
    const result = await trackVisit(request);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("GET track-visit error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500 }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const result = await trackVisit(request);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("POST track-visit error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500 }
    );
  }
};
    
