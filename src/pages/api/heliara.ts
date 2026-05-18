import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();

    const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert messages to Gemini format
    // Gemini requires alternating user/model turns — enforce that
    const geminiContents: { role: string; parts: { text: string }[] }[] = [];

    for (const msg of messages as { role: string; content: string }[]) {
      const role = msg.role === "assistant" ? "model" : "user";
      // Avoid consecutive same roles (Gemini strict requirement)
      if (
        geminiContents.length > 0 &&
        geminiContents[geminiContents.length - 1].role === role
      ) {
        // Merge into previous turn
        geminiContents[geminiContents.length - 1].parts[0].text +=
          "\n" + msg.content;
      } else {
        geminiContents.push({ role, parts: [{ text: msg.content }] });
      }
    }

    const systemInstruction = `You are Heliara AI, a smart and friendly assistant embedded on ReviByte (revibyte.blog) — a tech blog covering smartphones, Android optimization, mobile gaming (COD Mobile, eFootball), and tech opinions with a strong Nigerian and African market perspective.

You can help with:
- Smartphone recommendations and comparisons (especially for Nigerian/African budgets)
- Android tips, tricks, and optimization
- COD Mobile loadouts, strategies, and season guides
- eFootball tips and player guides
- General tech questions and opinions
- Anything else the user asks

Be conversational, direct, and helpful. No robotic tone. No unnecessary fluff. Give real answers like a knowledgeable friend would. If asked about ReviByte content, encourage users to explore revibyte.blog for detailed guides.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("Gemini error:", JSON.stringify(data));
      return new Response(
        JSON.stringify({
          error: data.error?.message || "Gemini API error",
          details: data.error,
        }),
        {
          status: geminiRes.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
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
