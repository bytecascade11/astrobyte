
// src/pages/api/add-comment.ts

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

// Get Supabase using Cloudflare's runtime environment.
function getSupabase(locals: App.Locals) {
  const env = (locals as any).runtime?.env;

  if (!env?.PUBLIC_SUPABASE_URL || !env?.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(
    env.PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// GET: Load comments for an article.
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug")?.trim();

    if (!slug) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing slug" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const supabase = getSupabase(locals);

    const { data, error } = await supabase
      .from("post_comments")
      .select("id, author_name, content, created_at")
      .eq("post_slug", slug)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return new Response(
      JSON.stringify({
        ok: true,
        comments: data ?? [],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("Comment loading error:", err);

    return new Response(
      JSON.stringify({
        ok: false,
        error: "Could not load comments.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// POST: Submit a new comment.
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();

    const { slug, author_name, content } = body as {
      slug?: string;
      author_name?: string;
      content?: string;
    };

    if (
      typeof slug !== "string" ||
      typeof author_name !== "string" ||
      typeof content !== "string"
    ) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing or invalid fields." }),
        { status: 400 }
      );
    }

    const cleanSlug = slug.trim();
    const cleanName = author_name.trim();
    const cleanContent = content.trim();

    if (!cleanSlug || !cleanName || !cleanContent) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing fields." }),
        { status: 400 }
      );
    }

    if (cleanName.length < 2) {
      return new Response(
        JSON.stringify({ ok: false, error: "Name too short." }),
        { status: 400 }
      );
    }

    if (cleanName.length > 80) {
      return new Response(
        JSON.stringify({ ok: false, error: "Name too long." }),
        { status: 400 }
      );
    }

    if (cleanContent.length < 3) {
      return new Response(
        JSON.stringify({ ok: false, error: "Comment too short." }),
        { status: 400 }
      );
    }

    if (cleanContent.length > 1000) {
      return new Response(
        JSON.stringify({ ok: false, error: "Comment too long." }),
        { status: 400 }
      );
    }

    const supabase = getSupabase(locals);

    const { error } = await supabase
      .from("post_comments")
      .insert({
        post_slug: cleanSlug,
        author_name: cleanName,
        content: cleanContent,
      });

    if (error) throw error;

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Comment submission error:", err);

    return new Response(
      JSON.stringify({
        ok: false,
        error: "Could not submit your comment. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
