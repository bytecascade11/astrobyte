import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";
import { stripDatePrefix } from "@/utils/slugify";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  const baseURL = SITE.website.replace(/\/$/, ""); // remove trailing slash

  const items = sortedPosts.map(({ data, id, filePath }) => {
    let slug = id; // fallback to id
    if (filePath) {
      const fileName = filePath.split("/").pop() ?? id;
      slug = stripDatePrefix(fileName.replace(/\.mdx?$/, ""));
    }

    return {
      link: `${baseURL}/posts/${slug}/`,
      guid: `${baseURL}/posts/${slug}/`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    };
  });

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: baseURL,
    items,
  });
}
