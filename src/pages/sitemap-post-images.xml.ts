import { getCollection } from "astro:content";
import { SITE } from "@/config";

export async function GET() {
  const posts = await getCollection("blog");

  const urls = posts.map((post) => {
    const postPath = `/posts/${post.slug}/`;
    const postUrl = new URL(postPath, SITE.website).toString();

    const image = post.data.coverImage
      ? new URL(post.data.coverImage, SITE.website).toString()
      : null;

    return `
      <url>
        <loc>${postUrl}</loc>
        ${
          image
            ? `
        <image:image>
          <image:loc>${image}</image:loc>
        </image:image>
        `
            : ""
        }
      </url>
    `;
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    >
      ${urls.join("")}
    </urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    }
  );
      }
