import type { APIRoute } from "astro";  
import { createClient } from "@supabase/supabase-js";  
  
export const prerender = false;  
  
/**  
 * Optional: handle GET so it doesn't crash when hit directly  
 */  
export const GET: APIRoute = async () => {  
  return new Response(  
    JSON.stringify({  
      ok: true,  
      message: "track-visit endpoint is alive (use POST)",  
    }),  
    { status: 200 }  
  );  
};  
  
export const POST: APIRoute = async ({ request }) => {  
  try {  
    const url = import.meta.env.PUBLIC_SUPABASE_URL;  
    const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;  
  
    if (!url || !key) {  
      console.error("Missing Supabase env vars");  
      return new Response(  
        JSON.stringify({ ok: false, error: "Missing env vars" }),  
        { status: 500 }  
      );  
    }  
  
    const supabase = createClient(url, key);  
  
    // Get IP safely  
    const ip =  
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||  
      request.headers.get("cf-connecting-ip") ||  
      "unknown";  
  
    const ua = request.headers.get("user-agent") || "unknown";  
  
    // Create simple fingerprint hash  
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
        {  
          visit_date: today,  
          visitor_hash: visitorHash,  
        },  
        {  
          onConflict: "visit_date,visitor_hash",  
        }  
      );  
  
    if (error) {  
      console.error("Supabase error:", error);  
      return new Response(  
        JSON.stringify({ ok: false, error: error.message }),  
        { status: 500 }  
      );  
    }  
  
    return new Response(JSON.stringify({ ok: true }), {  
      status: 200,  
      headers: {  
        "Content-Type": "application/json",  
      },  
    });  
  } catch (err: any) {  
    console.error("API crash:", err);  
  
    return new Response(  
      JSON.stringify({  
        ok: false,  
        error: err?.message || "Unknown error",  
      }),  
      { status: 500 }  
    );  
  }  
};  
