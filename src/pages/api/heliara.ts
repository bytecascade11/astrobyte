// Heliara AI — standalone Cloudflare Worker.
// Secret needed: GEMINI_API_KEY (Worker → Settings → Variables and Secrets).

const ALLOWED_ORIGINS = [
  "https://www.revibyte.blog",
  "https://revibyte.blog",
];

// Tried in order. The second is used if the first is busy or over its limit.
const MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite"];

const SITE = "https://www.revibyte.blog";

// ─── Device hub registry ────────────────────────────────────────────────────
const DEVICE_HUBS = {
  samsung:  { path: "/samsung/",  aliases: ["samsung", "galaxy"] },
  xiaomi:   { path: "/xiaomi/",   aliases: ["xiaomi", "redmi", "poco"] },
  tecno:    { path: "/tecno/",    aliases: ["tecno", "camon", "spark", "pova"] },
  motorola: { path: "/motorola/", aliases: ["motorola", "moto "] },
  huawei:   { path: "/huawei/",   aliases: ["huawei"] },
  honor:    { path: "/honor/",    aliases: ["honor"] },
  oneplus:  { path: "/oneplus/",  aliases: ["oneplus", "nord"] },
  nothing:  { path: "/nothing/",  aliases: ["nothing phone", "cmf"] },
  pixel:    { path: "/pixel/",    aliases: ["pixel", "google pixel"] },
  apple:    { path: "/apple/",    aliases: ["apple", "iphone", "ipad", "macbook", "airpods"] },
  oppo:     { path: "/oppo/",     aliases: ["oppo", "reno", "find x"] },
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

// ─── Content fetcher (kept light: the free plan limits CPU time per request) ─
async function fetchPageText(url, maxChars = 3000) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "HeliaraAI/1.0 (ReviByte assistant bot)" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return "";
    let html = await res.text();

    // Only process the part of the page that holds the content
    const mainStart = html.indexOf("<main");
    if (mainStart !== -1) html = html.slice(mainStart);
    html = html.slice(0, 60000);

    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<aside[\s\S]*?<\/aside>/gi, "")
      .replace(/<form[\s\S]*?<\/form>/gi, "")
      .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, "\n## $1\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n- ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return cleaned.slice(0, maxChars);
  } catch {
    return "";
  }
}

// ─── Sitemap (cached in memory for 10 minutes) ──────────────────────────────
let sitemapCache = { urls: [], time: 0 };

async function getAllContentUrls() {
  if (sitemapCache.urls.length && Date.now() - sitemapCache.time < 10 * 60 * 1000) {
    return sitemapCache.urls;
  }

  let xml = "";
  for (const sitemapUrl of [
    `${SITE}/sitemap-index.xml`,
    `${SITE}/sitemap.xml`,
    "https://revibyte.blog/sitemap-index.xml",
  ]) {
    try {
      const res = await fetch(sitemapUrl, { signal: AbortSignal.timeout(5000) });
      if (res.ok) { xml = await res.text(); break; }
    } catch {}
  }
  if (!xml) return sitemapCache.urls;

  const childSitemaps = [...xml.matchAll(/<loc>(.*?sitemap.*?)<\/loc>/gi)].map((m) => m[1]);
  if (childSitemaps.length > 0) {
    const childXmls = await Promise.all(
      childSitemaps.map(async (u) => {
        try {
          const r = await fetch(u, { signal: AbortSignal.timeout(5000) });
          return r.ok ? r.text() : "";
        } catch { return ""; }
      })
    );
    xml = childXmls.join("\n");
  }

  const allUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const hubPaths = Object.values(DEVICE_HUBS).map((h) => h.path);

  const contentUrls = allUrls.filter(
    (u) =>
      u.includes("/posts/") ||
      u.includes("/codm/") ||
      u.includes("/efootball/") ||
      u.includes("/pubgmobile/") ||
      u.includes("/mlbb/") ||
      u.includes("/tools/") ||
      u.includes("/heliara/") ||
      hubPaths.some((p) => u.includes(p))
  );

  sitemapCache = { urls: contentUrls, time: Date.now() };
  return contentUrls;
}

async function getRelevantPostUrls(query) {
  try {
    const contentUrls = await getAllContentUrls();
    if (!contentUrls.length) return [];

    const queryLower = query.toLowerCase();

    const isLatestQuery = /\b(latest|recent|new|last|update|just published|newest)\b/.test(queryLower);
    if (isLatestQuery) {
      return [...contentUrls].reverse().slice(0, 2);
    }

    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

    const scored = contentUrls.map((url) => {
      const slug = url.toLowerCase();
      let score = 0;

      for (const word of queryWords) {
        if (slug.includes(word)) score += 2;
      }

      if ((queryLower.includes("cod") || queryLower.includes("call of duty") || queryLower.includes("warzone")) && slug.includes("/codm/")) score += 3;
      if ((queryLower.includes("efootball") || queryLower.includes("pes") || queryLower.includes("efoot")) && slug.includes("/efootball/")) score += 3;
      if ((queryLower.includes("pubg") || queryLower.includes("battlegrounds")) && slug.includes("/pubgmobile/")) score += 3;
      if ((queryLower.includes("mlbb") || queryLower.includes("mobile legends") || queryLower.includes("bang bang")) && slug.includes("/mlbb/")) score += 3;
      if ((queryLower.includes("tool") || queryLower.includes("compress") || queryLower.includes("battery") || queryLower.includes("qr code") || queryLower.includes("estimator")) && slug.includes("/tools/")) score += 3;
      if ((queryLower.includes("heliara") || queryLower.includes("ai assistant")) && slug.includes("/heliara/")) score += 3;

      for (const hub of Object.values(DEVICE_HUBS)) {
        if (hub.aliases.some((a) => queryLower.includes(a)) && slug.includes(hub.path)) {
          score += 3;
        }
      }

      return { url, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((s) => s.url);
  } catch {
    return [];
  }
}

// ─── System prompt ──────────────────────────────────────────────────────────
function buildSystemPrompt(liveContext) {
  return `You are Heliara AI, a smart and friendly assistant built into ReviByte (revibyte.blog). You have access to live content fetched directly from ReviByte posts and hubs — use it to give accurate, up-to-date answers.

## Who iSamuel is
iSamuel (full name: Oke Sunday Samuel) is the sole founder, writer, and developer of ReviByte. He is a Physics and Electronics student in his final year of university. He built ReviByte entirely on mobile — no laptop, ever. The blog launched December 15, 2025 after migrating from Blogger to Astro. He is self-taught in web development. There is no team, no co-founders, no other staff.

## What ReviByte covers

### Device hubs
Each phone brand has its own dedicated hub with reviews, comparisons, and buying guides:
- Samsung — revibyte.blog/samsung/
- Xiaomi/Redmi/POCO — revibyte.blog/xiaomi/
- Tecno — revibyte.blog/tecno/
- Motorola — revibyte.blog/motorola/
- Huawei — revibyte.blog/huawei/
- Honor — revibyte.blog/honor/
- OnePlus — revibyte.blog/oneplus/
- Nothing (Phone/CMF) — revibyte.blog/nothing/
- Google Pixel — revibyte.blog/pixel/
- Apple (iPhone/iPad/Mac/Watch/AirPods) — revibyte.blog/apple/
- Oppo — revibyte.blog/oppo/
- General/older phone content not yet in a hub still lives at revibyte.blog/posts/
- Naira (₦) pricing, repairability, battery life, and Nigerian-market context apply across all hubs
- iSamuel's daily driver: Tecno Camon 30

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

### ReviByte Tools — revibyte.blog/tools/
- Image Compressor — revibyte.blog/tools/image-compressor/ (client-side, JPG/WebP/PNG, no uploads required)
- Battery Health / Charging Time Estimator — revibyte.blog/tools/battery-estimator/
- QR Code Generator — revibyte.blog/tools/qr-code-generator/
- Heliara AI — free AI assistant at revibyte.blog/heliara/
- The old TikTok/Instagram video downloaders were retired and are no longer available on the site — never suggest them or link to /save/tok/ or /save/ig/

### Blog & Tech
- Built on Astro, deployed on Cloudflare
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
}

// ─── Worker entry ───────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Open the worker URL in a browser to check that the secret is set.
    // It never shows the key itself.
    if (request.method === "GET") {
      return json({ ok: true, key_configured: !!env.GEMINI_API_KEY }, 200, origin);
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, origin);
    }

    try {
      const GEMINI_API_KEY = env.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        return json({ error: "API key not configured", status: 500 }, 500, origin);
      }

      const body = await request.json().catch(() => null);
      if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
        return json({ error: "Invalid request", status: 400 }, 400, origin);
      }

      // Keep the last 12 messages and cap their length
      const messages = body.messages
        .slice(-12)
        .filter((m) => m && typeof m.content === "string" && m.content.trim())
        .map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content.slice(0, 1000),
        }));

      if (messages.length === 0) {
        return json({ error: "Invalid request", status: 400 }, 400, origin);
      }

      const latestUserMessage =
        [...messages].reverse().find((m) => m.role === "user")?.content || "";

      const relevantUrls = await getRelevantPostUrls(latestUserMessage);
      const fetchedTexts = await Promise.all(
        relevantUrls.map((url) =>
          fetchPageText(url, 3000).then((text) =>
            text ? `\n\n--- From ${url} ---\n${text}` : ""
          )
        )
      );
      const liveContext = fetchedTexts.filter(Boolean).join("").slice(0, 7000);

      const systemPrompt = buildSystemPrompt(liveContext);

      const geminiContents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      let geminiRes;
      let data = {};

      for (const model of MODELS) {
        geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": GEMINI_API_KEY,
            },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: geminiContents,
              generationConfig: { maxOutputTokens: 1500, temperature: 0.7 },
            }),
          }
        );
        data = await geminiRes.json().catch(() => ({}));
        if (geminiRes.ok) break;
        console.error(`Gemini ${model} failed:`, geminiRes.status, JSON.stringify(data));
        if (![404, 429, 500, 503].includes(geminiRes.status)) break;
      }

      if (!geminiRes.ok) {
        return json(
          { error: data?.error?.message || "Gemini API error", status: geminiRes.status },
          502,
          origin
        );
      }

      const candidate = data.candidates?.[0];
      const finishReason = candidate?.finishReason;

      let reply = candidate?.content?.parts?.find((p) => !p.thought && p.text)?.text;

      if (!reply) {
        if (finishReason === "SAFETY") {
          reply = "I can't answer that one — try rephrasing, or ask me something else about ReviByte.";
        } else if (finishReason === "MAX_TOKENS") {
          reply = "That answer got cut off — mind asking a more specific version of that?";
        } else {
          reply = "Sorry, I couldn't generate a response.";
        }
      }

      return json({ reply }, 200, origin);
    } catch (err) {
      console.error("Heliara worker exception:", err);
      return json(
        { error: "Internal server error", details: String(err), status: 500 },
        500,
        origin
      );
    }
  },
};
