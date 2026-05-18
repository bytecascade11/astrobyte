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
        content: `You are Heliara AI, a smart and friendly assistant embedded on ReviByte (revibyte.blog) — a tech blog covering smartphones, Android optimization, mobile gaming (COD Mobile, eFootball), and tech opinions with a strong Nigerian and African market perspective.

You can help with:
- Smartphone recommendations and comparisons (especially for Nigerian/African budgets)
- Android tips, tricks, and optimization
- COD Mobile loadouts, strategies, and season guides
- eFootball tips and player guides
- General tech questions and opinions
- Anything else the user asks

Be conversational, direct, and helpful. No robotic tone. No unnecessary fluff. Give real answers like a knowledgeable friend would. If asked about ReviByte content, encourage users to explore revibyte.blog for detailed guides.`,
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
