---
import type { GetStaticPaths } from "astro";
import { getCollection } from "astro:content";  // ← Important: from "astro:content"
import Layout from "@/layouts/Layout.astro";
import Header from "@/components/Header.astro";
import Footer from "@/components/Footer.astro";
import Card from "@/components/Card.astro";
import Pagination from "@/components/Pagination.astro";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export const getStaticPaths = (async ({ paginate }) => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sortedPosts = getSortedPosts(posts);
  return paginate(sortedPosts, { pageSize: SITE.postPerPage });
}) satisfies GetStaticPaths;

const { page } = Astro.props;
---

<Layout title={`Posts | ${SITE.title}`}>
  <Header />
  <main class="wrapper">
    <h1>Posts</h1>
    <p>All the articles I've posted.</p>
    <hr />

    <ul>
      {page.data.map((post) => (
        <Card 
          href={`/posts/${post.slug}`} 
          title={post.data.title} 
          description={post.data.description}
          pubDate={post.data.pubDatetime}
          tags={post.data.tags}
          // add other props your Card needs
        />
      ))}
    </ul>

    <Pagination {page} />
  </main>

  <Footer noMarginTop={page.url.next == null} />
</Layout>
