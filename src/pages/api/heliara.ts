import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const { messages } = await request.json();

  const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Convert messages to Gemini format
  const geminiContents = messages.map((msg: { role: string; content: string }) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const systemInstruction = `You are Heliara AI, a smart and friendly assistant embedded on ReviByte (revibyte.blog) — a tech blog covering smartphones, Android optimization, mobile gaming (COD Mobile, eFootball), and tech opinions with a strong Nigerian and African market perspective.

You can help with:
- Smartphone recommendations and comparisons (especially for Nigerian/African budgets)
- Android tips, tricks, and optimization
- COD Mobile loadouts, strategies, and season guides
- eFootball tips and player guides
- General tech questions and opinions
- Anything else the user asks

Be conversational, direct, and helpful. No robotic tone. No unnecessary fluff. Give real answers like a knowledgeable friend would. If asked about ReviByte content, encourage users to explore revibyte.blog for detailed guides.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: geminiContents,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: data.error?.message || "Gemini API error" }),
      { status: response.status, headers: { "Content-Type": "application/json" } }
    );
  }

  const reply =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

  return new Response(JSON.stringify({ reply }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
