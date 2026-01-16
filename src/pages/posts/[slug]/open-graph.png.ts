import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "@/utils/generateOgImages";
import { SITE } from "@/config";

export async function getStaticPaths() {
  if (!SITE.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("blog").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: post.id.replace(/\.mdx?$/, "") },  // Clean slug from filename
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  if (!SITE.dynamicOgImage) {
    return new Response(null, { status: 404 });
  }

  try {
    const post = props as CollectionEntry<"blog">;
    const pngBuffer = await generateOgImageForPost(post);

    // Convert Buffer<ArrayBufferLike> → Uint8Array for Response body compatibility
    const body = new Uint8Array(pngBuffer);

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable", // Optional: good for static OG images
      },
    });
  } catch (error) {
    console.error("OG image generation failed:", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
};
