import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("cf-connecting-ip") ||
      "unknown";
    const ua = request.headers.get("user-agent") || "unknown";

    // Simple hash without crypto module
    const raw = `${ip}:${ua}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const visitorHash = Math.abs(hash).toString(36);

    const today = new Date().toISOString().slice(0, 10);

    const { error } = await supabase.from("daily_visitors").upsert(
      { visit_date: today, visitor_hash: visitorHash },
      { onConflict: "visit_date,visitor_hash", ignoreDuplicates: true }
    );

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("track-visit error:", err);
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
};
