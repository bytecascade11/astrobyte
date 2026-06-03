// src/pages/api/add-comment.ts
import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { slug, author_name, content } = await request.json();

    if (!slug || !author_name || !content) {
      return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), { status: 400 });
    }

    if (author_name.trim().length < 2) {
      return new Response(JSON.stringify({ ok: false, error: "Name too short" }), { status: 400 });
    }

    if (content.trim().length < 3) {
      return new Response(JSON.stringify({ ok: false, error: "Comment too short" }), { status: 400 });
    }

    if (content.length > 1000) {
      return new Response(JSON.stringify({ ok: false, error: "Comment too long" }), { status: 400 });
    }

    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase.from("post_comments").insert({
      post_slug: slug,
      author_name: author_name.trim(),
      content: content.trim(),
    });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};
                        
