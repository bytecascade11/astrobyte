import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request }) => {
  console.log("[track-visit] POST hit");
  
  try {
    const url = import.meta.env.PUBLIC_SUPABASE_URL;
    const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log("[track-visit] URL exists:", !!url);
    console.log("[track-visit] KEY exists:", !!key);

    if (!url || !key) {
      console.error("[track-visit] Missing env vars — URL:", url, "KEY:", key ? "set" : "missing");
      return new Response(
        JSON.stringify({ ok: false, error: "Missing env vars" }),
        { status: 500 }
      );
    }

    const supabase = createClient(url, key);
    console.log("[track-visit] Supabase client created");

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("cf-connecting-ip") || "unknown";
    const ua = request.headers.get("user-agent") || "unknown";
    
    console.log("[track-visit] IP:", ip, "UA:", ua.substring(0, 50));

    // ... rest of logic with more console.logs ...

    const { error } = await supabase.from("daily_visitors").upsert(...);
    
    if (error) {
      console.error("[track-visit] Supabase error:", error);
      return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
    }

    console.log("[track-visit] Success");
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
    
  } catch (err: any) {
    console.error("[track-visit] CRASH:", err.message, err.stack);
    return new Response(
      JSON.stringify({ ok: false, error: err.message, stack: err.stack }),
      { status: 500 }
    );
  }
};
