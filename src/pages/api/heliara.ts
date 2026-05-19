export const prerender = false;

import type { APIRoute } from "astro";

// Fetch and extract plain text from a URL
async function fetchPageText(url: string, maxChars = 3000): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "HeliaraAI/1.0 (ReviByte assistant bot)" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return "";
    const html = await res.text();

    // Strip HTML tags and collapse whitespace
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();

    return text.slice(0, maxChars);
  } catch {
    return "";
  }
}

// Fetch ReviByte sitemap and extract post URLs
async function getRelevantPostUrls(query: string): Promise<string[]> {
  try {
    const res = await fetch("https://revibyte.blog/sitemap.xml", {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    // Extract all URLs from sitemap
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

    // Filter to post URLs only
    const postUrls = urls.filter(u =>
      u.includes("/posts/") ||
      u.includes("/codm/") ||
      u.includes("/efootball/")
    );

    // Score URLs by relevance to the query
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const scored = postUrls.map(url => {
      const slug = url.toLowerCase();
      const score = queryWords.reduce((acc, word) => acc + (slug.includes(word) ? 1 : 0), 0);
      return { url, score };
    });

    // Return top 2 most relevant URLs
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
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

    // Get the latest user message to determine what to fetch
    const latestUserMessage = [...(messages as { role: string; content: string }[])]
      .reverse()
      .find(m => m.role === "user")?.content || "";

    // Fetch relevant ReviByte content in parallel
    const [homepageText, ...postTexts] = await Promise.all([
      fetchPageText("https://revibyte.blog", 1500),
      ...(await getRelevantPostUrls(latestUserMessage)).map(url =>
        fetchPageText(url, 2000).then(text => `\n\n--- From ${url} ---\n${text}`)
      ),
    ]);

    const liveContext = [
      homepageText ? `\n\n--- ReviByte Homepage ---\n${homepageText}` : "",
      ...postTexts,
    ]
      .filter(Boolean)
      .join("")
      .slice(0, 6000); // Keep total context under 6000 chars

    const systemPrompt = `You are Heliara AI, a smart and friendly assistant embedded on ReviByte (revibyte.blog).

## About ReviByte
- ReviByte is a tech blog founded and run solely by iSamuel
- iSamuel is the founder, sole writer, and developer — there is no team, no co-founders, no other staff
- The blog launched in December 2025 after migrating to Astro, deployed on Vercel
- ReviByte covers: smartphones, Android optimization, mobile gaming (COD Mobile, eFootball), tech opinions
- Strong Nigerian and African market focus — pricing in Naira (₦), Lagos references
- iSamuel is a Physics and Electronics student, self-taught web developer
- Gaming hubs: revibyte.blog/codm/ and revibyte.blog/efootball/

## Rules
- If asked about ReviByte's founder or owner — always say iSamuel
- Never invent team members or co-founders — iSamuel runs ReviByte solo
- Use the live ReviByte content below to answer questions accurately
- If a topic is covered on ReviByte, reference the relevant post and encourage the user to read it
- Be conversational, direct, no fluff — like a knowledgeable friend
${liveContext ? `\n## Live ReviByte Content (fetched right now)\n${liveContext}` : ""}`;

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
        max_tokens: 1024,
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
