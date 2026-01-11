import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";
import { stripDatePrefix } from "@/utils/slugify";

export async function GET() {
  // get all posts
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  // generate RSS items
  const items = sortedPosts.map(({ data, id, filePath }) => {
    // generate clean slug
    let slug = id; // fallback to id
    if (filePath) {
      const fileName = filePath.split("/").pop() ?? id; // get filename
      slug = stripDatePrefix(fileName.replace(/\.mdx?$/, "")); // remove date and extension
    }

    return {
      link: `${SITE.website}/posts/${slug}/`, // absolute URL
      guid: `${SITE.website}/posts/${slug}/`, // same as link
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    };
  });

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items,
  });
}
