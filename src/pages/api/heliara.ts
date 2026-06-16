export const prerender = false;

import type { APIRoute } from "astro";

// ─── Content fetcher ────────────────────────────────────────────────────────
async function fetchPageText(url: string, maxChars = 4000): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "HeliaraAI/1.0 (ReviByte assistant bot)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return "";
    const html = await res.text();

    // Remove non-content blocks
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<aside[\s\S]*?<\/aside>/gi, "")
      .replace(/<form[\s\S]*?<\/form>/gi, "")
      // Preserve heading text with a newline prefix
      .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, "\n## $1\n")
      // Preserve paragraph breaks
      .replace(/<\/p>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n- ")
      // Strip remaining tags
      .replace(/<[^>]+>/g, " ")
      // Decode entities
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Collapse whitespace but keep newlines
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return cleaned.slice(0, maxChars);
  } catch {
    return "";
  }
}

// ─── Sitemap URL scorer ──────────────────────────────────────────────────────
async function getRelevantPostUrls(query: string): Promise<string[]> {
  try {
    // Try sitemap-index first, fallback to sitemap.xml
    let xml = "";
    for (const sitemapUrl of [
      "https://revibyte.blog/sitemap-index.xml",
      "https://revibyte.blog/sitemap.xml",
    ]) {
      const res = await fetch(sitemapUrl, { signal: AbortSignal.timeout(8000) });
      if (res.ok) { xml = await res.text(); break; }
    }
    if (!xml) return [];

    // If it's a sitemap index, fetch child sitemaps and merge
    const childSitemaps = [...xml.matchAll(/<loc>(.*?sitemap.*?)<\/loc>/gi)].map(m => m[1]);
    if (childSitemaps.length > 0) {
      const childXmls = await Promise.all(
        childSitemaps.map(async u => {
          try {
            const r = await fetch(u, { signal: AbortSignal.timeout(6000) });
            return r.ok ? r.text() : "";
          } catch { return ""; }
        })
      );
      xml = childXmls.join("\n");
    }

    const allUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

    // All content hubs + posts
    const contentUrls = allUrls.filter(u =>
      u.includes("/posts/") ||
      u.includes("/codm/") ||
      u.includes("/efootball/") ||
      u.includes("/pubgmobile/") ||
      u.includes("/mlbb/") ||
      u.includes("/save/") ||
      u.includes("/heliara/")
    );

    const queryLower = query.toLowerCase();

    // ── "Latest / recent / new" intent ──────────────────────────────────────
    const isLatestQuery = /\b(latest|recent|new|last|update|just published|newest)\b/.test(queryLower);
    if (isLatestQuery) {
      // Sitemap lists URLs in document order — last entries tend to be newest.
      // Return the last 4 post/hub URLs.
      const reversed = [...contentUrls].reverse();
      return reversed.slice(0, 4);
    }

    // ── Keyword scoring for specific queries ─────────────────────────────────
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

    const scored = contentUrls.map(url => {
      const slug = url.toLowerCase();
      let score = 0;

      for (const word of queryWords) {
        if (slug.includes(word)) score += 2;
      }

      if ((queryLower.includes("cod") || queryLower.includes("call of duty") || queryLower.includes("warzone")) && slug.includes("/codm/")) score += 3;
      if ((queryLower.includes("efootball") || queryLower.includes("pes") || queryLower.includes("efoot")) && slug.includes("/efootball/")) score += 3;
      if ((queryLower.includes("pubg") || queryLower.includes("battlegrounds")) && slug.includes("/pubgmobile/")) score += 3;
      if ((queryLower.includes("mlbb") || queryLower.includes("mobile legends") || queryLower.includes("bang bang")) && slug.includes("/mlbb/")) score += 3;
      if ((queryLower.includes("tiktok") || queryLower.includes("download") || queryLower.includes("save")) && slug.includes("/save/")) score += 3;
      if ((queryLower.includes("heliara") || queryLower.includes("ai assistant")) && slug.includes("/heliara/")) score += 3;

      return { url, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(s => s.url);
  } catch {
    return [];
  }
}

// ─── API Route ───────────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const latestUserMessage = [...(messages as { role: string; content: string }[])]
      .reverse()
      .find(m => m.role === "user")?.content || "";

    // Fetch relevant posts in parallel
    const relevantUrls = await getRelevantPostUrls(latestUserMessage);

    const fetchedTexts = await Promise.all(
      relevantUrls.map(url =>
        fetchPageText(url, 4000).then(text =>
          text ? `\n\n--- From ${url} ---\n${text}` : ""
        )
      )
    );

    const liveContext = fetchedTexts
      .filter(Boolean)
      .join("")
      .slice(0, 12000);

    const systemPrompt = `You are Heliara AI, a smart and friendly assistant built into ReviByte (revibyte.blog). You have access to live content fetched directly from ReviByte posts and hubs — use it to give accurate, up-to-date answers.

## Who iSamuel is
iSamuel (full name: Oke Sunday Samuel) is the sole founder, writer, and developer of ReviByte. He is a Physics and Electronics student in his final year of university. He built ReviByte entirely on mobile — no laptop, ever. The blog launched December 15, 2025 after migrating from Blogger to Astro. He is self-taught in web development. There is no team, no co-founders, no other staff.

## What ReviByte covers

### Smartphones
- Honest phone reviews and comparisons
- Budget phone guides with Naira (₦) pricing — under ₦100k, ₦150k, ₦200k, ₦300k
- Brands covered: Tecno, Infinix, itel, Samsung, Xiaomi/Redmi, iPhone/Apple
- iSamuel's daily driver: Tecno Camon 30
- Real-world analysis: battery life, repairability, resale value, performance in Nigerian conditions
- Android tips, optimization, battery guides, speed improvements

### COD Mobile Hub — revibyte.blog/codm/
- Best loadouts updated every season
- Weapon tier lists, sensitivity settings, ranked tips
- Sniper loadouts, SMG builds, AR setups
- Beginner through advanced strategies
- iSamuel plays COD Mobile personally

### eFootball Hub — revibyte.blog/efootball/
- Top formations and Division 1 tactics
- Squad-building tips and player reviews
- Patch-by-patch updates
- iSamuel plays eFootball personally

### PUBG Mobile Hub — revibyte.blog/pubgmobile/
- Gyroscope settings and sensitivity guides
- Best landing spots, weapon guides, survival tips
- Settings optimization for mid-range Android phones

### Mobile Legends Bang Bang (MLBB) Hub — revibyte.blog/mlbb/
- Hero guides, best builds, counters
- Rank push tips, meta updates
- Beginner and advanced MLBB strategies

### ReviByte Tools
- **Heliara AI** — free AI assistant at revibyte.blog/heliara/
- **ReviByte Save** — free TikTok video downloader at revibyte.blog/save/tok/ (no watermark, MP3 audio option)

### Blog & Tech
- Built on Astro, deployed on Vercel, DNS via Cloudflare
- PWA listed on Microsoft Store
- Google AdSense monetization (pub-4896561037705299)
- Amazon Associates affiliate links
- Push notifications via OneSignal
- Anonymous comment system powered by Supabase
- Visitor tracking dashboard (private)

## Key posts
- First post: revibyte.blog/posts/first-post-revibyte-live/
- 121-day milestone: revibyte.blog/posts/revibyte-121-days-later/
- Astro setup guide: revibyte.blog/posts/building-lightning-fast-blog-with-astro-complete-setup/
- Google image sitemap fix: revibyte.blog/posts/how-i-fixed-google-image-sitemap--astro/
- Search visibility growth: revibyte.blog/posts/how-revibyte-expanded-search-visibility/
- Push notifications fix: revibyte.blog/posts/why-my-blog-had-no-push-notifications
- RAM for gaming: revibyte.blog/posts/how-much-ram-do-you-really-need-for-gaming/

## How to answer
- Be direct and conversational — like a knowledgeable friend, not a corporate bot
- No robotic tone, no unnecessary filler, no excessive bullet points
- When live content is available below, use it — it reflects the actual post
- If a ReviByte post or hub covers the topic, mention it and give the full URL
- If asked to write something — a post outline, a caption, a review draft — do it
- If asked about phones in Nigeria, always factor in Naira pricing, repairability, data costs, and power outage context
- Never invent staff, team members, or co-founders — iSamuel runs ReviByte solo
- If asked who built Heliara AI or ReviByte Save — iSamuel built both
${liveContext ? `\n## Live ReviByte content fetched for this query\n${liveContext}` : ""}`;

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...(messages as { role: string; content: string }[]),
    ];

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      console.error("Groq error:", JSON.stringify(data));
      const errorMessage = groqRes.status === 429
        ? "Heliara AI is a bit busy right now. Wait a moment and try again."
        : data.error?.message || "Groq API error";
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: groqRes.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Heliara API exception:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
