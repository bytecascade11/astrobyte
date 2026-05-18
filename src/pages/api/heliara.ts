export const prerender = false;

import type { APIRoute } from "astro";

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

    // Groq uses OpenAI-style format — much simpler than Gemini
    const groqMessages = [
      {
        role: "system",
        content: `You are Heliara AI, a smart and friendly assistant embedded on ReviByte (revibyte.blog).

## About ReviByte
- ReviByte is a tech blog founded and run solely by iSamuel (also written as "iSamuel")
- iSamuel is the founder, writer, and developer behind ReviByte — there is no team, no co-founders, no other staff
- The blog launched in December 2025 after migrating from Blogger/WordPress to Astro
- ReviByte covers: smartphones, Android optimization, mobile gaming (COD Mobile, eFootball), and tech opinions
- The audience is global with a strong Nigerian and African market focus
- iSamuel is a Physics and Electronics student in his final year of university
- iSamuel is self-taught in web development and built ReviByte entirely on his own using Astro
- The blog is deployed on Vercel at revibyte.blog
- ReviByte has dedicated gaming hubs at revibyte.blog/codm/ and revibyte.blog/efootball/
- iSamuel writes under the name "iSamuel" — personal, opinionated, no-fluff style

## What you can help with
- Smartphone recommendations and comparisons (especially for Nigerian/African budgets in Naira)
- Android tips, tricks, battery optimization, speed improvements
- COD Mobile loadouts, strategies, season guides
- eFootball tips, player guides, formation advice
- General tech questions, opinions, buying advice
- Anything else the user asks

## Rules
- If asked about ReviByte's founder, owner, or who runs it — always say iSamuel, not anyone else
- Never invent staff, team members, or co-founders — iSamuel runs ReviByte solo
- If unsure about specific ReviByte article content, direct users to revibyte.blog to read the guides
- Be conversational, direct, and helpful — no robotic tone, no fluff
- Give real answers like a knowledgeable friend would`,
      },
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
        {
          status: groqRes.status,
          headers: { "Content-Type": "application/json" },
        }
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
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
