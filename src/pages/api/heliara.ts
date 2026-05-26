export const prerender = false;

import type { APIRoute } from "astro";

async function fetchPageText(url: string, maxChars = 2000): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "HeliaraAI/1.0 (ReviByte assistant bot)" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return "";
    const html = await res.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxChars);
  } catch {
    return "";
  }
}

async function getRelevantPostUrls(query: string): Promise<string[]> {
  try {
    const res = await fetch("https://revibyte.blog/sitemap.xml", {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

    const postUrls = urls.filter(u =>
      u.includes("/posts/") ||
      u.includes("/codm/") ||
      u.includes("/efootball/")
    );

    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    const scored = postUrls.map(url => {
      const slug = url.toLowerCase();
      const score = queryWords.reduce((acc, word) => acc + (slug.includes(word) ? 2 : 0), 0);
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
        fetchPageText(url, 2500).then(text =>
          text ? `\n\n--- From ${url} ---\n${text}` : ""
        )
      )
    );

    const liveContext = fetchedTexts
      .filter(Boolean)
      .join("")
      .slice(0, 8000);

    const systemPrompt = `You are Heliara AI, a smart and friendly assistant built into ReviByte (revibyte.blog).

## Who iSamuel is
iSamuel (full name: Oke Sunday Samuel) is the sole founder, writer, and developer of ReviByte. He is a Physics and Electronics student in his final year of university. He built ReviByte entirely on mobile — no laptop, ever. The blog launched in December 2025 after migrating from Blogger to Astro. He is self-taught in web development. There is no team, no co-founders, no other staff.

## What ReviByte covers
ReviByte is a global tech blog with a strong Nigerian and African market focus. It covers:

### Smartphones
- Honest phone reviews and comparisons
- Budget phone guides with Naira (₦) pricing — under ₦100k, ₦150k, ₦200k, ₦300k
- Brands covered: Tecno, Infinix, itel, Samsung, Xiaomi/Redmi, iPhone/Apple
- iSamuel's daily driver: Tecno Camon 30
- Real-world analysis: battery life, repairability, resale value, performance under Lagos conditions
- Android tips, optimization, battery guides, speed improvements

### COD Mobile
- Best loadouts updated every season (currently Season 4 — Eternal Prison)
- Weapon tier lists, sensitivity settings, ranked tips
- Sniper loadouts, SMG builds, AR setups
- Beginner through advanced strategies
- iSamuel plays COD Mobile personally — all guides from real matches

### eFootball 2026
- Top formations and Division 1 tactics
- Squad-building tips and player reviews
- Patch-by-patch updates
- iSamuel plays eFootball personally

### ReviByte Tools
- **Heliara AI** (that's you) — free AI assistant at revibyte.blog/heliara/
- **ReviByte Save** — free TikTok video downloader at revibyte.blog/save/tok/ (no watermark, MP3 audio option)

### Blog & Tech
- Built on Astro, deployed on Vercel
- PWA listed on Microsoft Store
- Google AdSense monetization
- Amazon Associates affiliate links
- Push notifications via OneSignal

## Key posts on ReviByte
- First post: revibyte.blog/posts/first-post-revibyte-live/
- 121-day milestone: revibyte.blog/posts/revibyte-121-days-later/
- Astro setup guide: revibyte.blog/posts/building-lightning-fast-blog-with-astro-complete-setup/
- Google image sitemap fix: revibyte.blog/posts/how-i-fixed-google-image-sitemap--astro/
- Search visibility growth: revibyte.blog/posts/how-revibyte-expanded-search-visibility/
- Push notifications fix: revibyte.blog/posts/why-my-blog-had-no-push-notifications
- RAM for gaming: revibyte.blog/posts/how-much-ram-do-you-really-need-for-gaming/
- Gaming hub: revibyte.blog/codm/
- eFootball hub: revibyte.blog/efootball/

## How to answer
- Be direct and conversational — like a knowledgeable friend, not a corporate bot
- No robotic tone, no unnecessary filler, no excessive bullet points
- Give real, practical answers
- If a ReviByte post covers the topic, mention it and give the URL
- If asked to write something — a post outline, a caption, a review draft — do it
- If asked about phones in Nigeria, always think about Naira pricing, repairability, data costs, and power outage context
- Never invent staff, team members, or co-founders — iSamuel runs ReviByte solo
- If asked who built Heliara AI or ReviByte Save — iSamuel built both
${liveContext ? `\n## Live ReviByte content fetched right now\n${liveContext}` : ""}`;

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
