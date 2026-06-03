import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request }) => {
  try {
    const url = import.meta.env.PUBLIC_SUPABASE_URL;
    const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return new Response(JSON.stringify({ ok: false, error: "Missing env vars", url: !!url, key: !!key }), { status: 500 });
    }

    const supabase = createClient(url, key);

    const { error } = await supabase.from("daily_visitors").upsert(
      { visit_date: new Date().toISOString().slice(0, 10), visitor_hash: "test123" },
      { onConflict: "visit_date,visitor_hash", ignoreDuplicates: true }
    );

    if (error) return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};
