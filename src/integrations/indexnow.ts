import fs from 'node:fs';
import path from 'node:path';
import { parseStringPromise } from 'xml2js'; // We'll install this

export default function indexnowIntegration() {
  return {
    name: 'indexnow',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const apiKey = '2580c87a6ebf4a5eb1118ae94b26f7bd';
        const host = 'www.revibyte.blog';
        const sitemapPath = path.join(dir.pathname, 'sitemap-index.xml');

        if (!fs.existsSync(sitemapPath)) {
          console.log('⚠️ No sitemap found – skipping IndexNow');
          return;
        }

        try {
          const xml = fs.readFileSync(sitemapPath, 'utf-8');
          const result = await parseStringPromise(xml);
          const urls = result.sitemapindex.sitemap.map((s: any) => s.loc[0]);

          const allUrls: string[] = [];
          for (const sitemapUrl of urls) {
            const sitemapXml = await fetch(sitemapUrl).then(r => r.text());
            const sitemapResult = await parseStringPromise(sitemapXml);
            sitemapResult.urlset.url.forEach((u: any) => allUrls.push(u.loc[0]));
          }

          // Submit in batches of 10,000 (IndexNow limit)
          for (let i = 0; i < allUrls.length; i += 10000) {
            const batch = allUrls.slice(i, i + 10000);
            const response = await fetch('https://api.indexnow.org/indexnow', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                host,
                key: apiKey,
                keyLocation: `https://\( {host}/ \){apiKey}.txt`,
                urlList: batch,
              }),
            });
            const data = await response.json();
            console.log(`✅ IndexNow batch submitted:`, data);
          }
        } catch (err) {
          console.error('❌ IndexNow submission failed:', err);
        }
      },
    },
  };
}
