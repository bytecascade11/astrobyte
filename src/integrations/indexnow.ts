export default function indexnow() {
  return {
    name: 'indexnow-sitemap-submission',
    hooks: {
      'astro:build:done': async () => {
        const apiKey = '2580c87a6ebf4a5eb1118ae94b26f7bd';
        const host = 'www.revibyte.blog';
        const sitemapUrl = `https://${host}/sitemap-index.xml`;
        const keyLocation = `https://\( {host}/ \){apiKey}.txt`;

        const endpoint = `https://api.indexnow.org/indexnow?url=\( {encodeURIComponent(sitemapUrl)}&key= \){apiKey}&keyLocation=${encodeURIComponent(keyLocation)}`;

        try {
          const response = await fetch(endpoint);
          const data = await response.json();
          console.log('✅ IndexNow sitemap submitted:', data);
        } catch (err) {
          console.error('❌ IndexNow submission failed:', err);
        }
      },
    },
  };
}
