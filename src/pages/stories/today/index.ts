import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const allCollections = ['blog', 'codm', 'efootball', 'pubgmobile', 'mlbb', 'samsung', 'xiaomi', 'tecno', 'motorola', 'huawei', 'honor', 'oneplus', 'pixel'];
  const allPosts = (await Promise.all(allCollections.map((c) => getCollection(c)))).flat();

  const windowStart = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const recentPosts = allPosts
    .filter((post) => new Date(post.data.pubDatetime) >= windowStart)
    .sort((a, b) => new Date(b.data.pubDatetime).getTime() - new Date(a.data.pubDatetime).getTime());

  const routeFor = (post: any) =>
    `https://revibyte.blog/${post.collection === 'blog' ? 'posts' : post.collection}/${post.id}/`;

  const escape = (str: string) =>
    String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const portraitCrop = (src: string) => {
  return src.startsWith('http') ? src : `https://revibyte.blog${src}`;
};

  const publishDate = recentPosts[0]?.data.pubDatetime?.toISOString() ?? new Date().toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://revibyte.blog/stories/today/" },
    "headline": "ReviByte Top Stories",
    "image": recentPosts.map((p) => portraitCrop(p.data.coverImage)),
    "datePublished": publishDate,
    "dateModified": new Date().toISOString(),
    "author": { "@type": "Organization", "name": "ReviByte" },
    "publisher": {
      "@type": "Organization",
      "name": "ReviByte",
      "logo": { "@type": "ImageObject", "url": "https://revibyte.blog/logo.png" }
    }
  };

  const pages = recentPosts.map((post, i) => `
    <amp-story-page id="page-${i}">
      <amp-story-grid-layer template="fill">
        <amp-img src="${portraitCrop(post.data.coverImage)}" width="720" height="1280" layout="responsive"></amp-img>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical">
        <h1>${escape(post.data.title)}</h1>
        <p>${escape(post.data.description)}</p>
        <a class="cta" href="${routeFor(post)}">Read full story →</a>
      </amp-story-grid-layer>
    </amp-story-page>`).join('');

  const posterImage = recentPosts[0]?.data.coverImage
    ? portraitCrop(recentPosts[0].data.coverImage)
    : 'https://revibyte.blog/logo.png';

  const html = `<!doctype html>
<html amp lang="en">
<head>
<meta charset="utf-8">
<script async src="https://cdn.ampproject.org/v0.js"></script>
<script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
<title>ReviByte Top Stories</title>
<link rel="canonical" href="https://revibyte.blog/stories/today/">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style amp-custom>
h1 { font-size: 2rem; color: #fff; margin: 0 0 12px; }
p { font-size: 1.1rem; color: #eee; line-height: 1.4; }
a.cta { color: #fff; text-decoration: underline; font-weight: bold; }
</style>
</head>
<body>
<amp-story standalone title="ReviByte Top Stories" publisher="ReviByte" publisher-logo-src="https://revibyte.blog/logo.png" poster-portrait-src="${posterImage}">
${pages}
</amp-story>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
};
