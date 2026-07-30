export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { prompt, response_json_schema, messages } = req.body;
  if (!prompt && !messages) return res.status(400).json({ error: "prompt or messages required" });
  const systemPrompt = response_json_schema
    ? "You are an expert sports physiotherapist. Respond with valid JSON only. No markdown, no code blocks, just raw JSON."
    : "You are Strix AI, an expert sports physiotherapist and performance coach. Give clear, evidence-based advice.";
  const userMessages = messages || [{ role: "user", content: prompt }];

  if (process.env.XAI_API_KEY) {
    try {
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.XAI_API_KEY}` },
        body: JSON.stringify({ model: "grok-3-mini", max_tokens: 16000, messages: [{ role: "system", content: systemPrompt }, ...userMessages] }),
      });
      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({ result: parseResult(data.choices[0]?.message?.content || "", response_json_schema), provider: "grok" });
      }
      console.warn("Grok failed:", await response.text());
    } catch (e) { console.warn("Grok error:", e.message); }
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 16000, system: systemPrompt, messages: userMessages }),
      });
      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({ result: parseResult(data.content[0]?.text || "", response_json_schema), provider: "claude" });
      }
      const err = await response.json();
      throw new Error(err.error?.message || "Claude error");
    } catch (e) { return res.status(500).json({ error: "Both Grok and Claude failed: " + e.message }); }
  }
  return res.status(500).json({ error: "No AI API key configured. Add XAI_API_KEY or ANTHROPIC_API_KEY to Vercel." });
}

function parseResult(text, schema) {
  if (!schema) return text;
  let clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const a = clean.indexOf("{"), b = clean.lastIndexOf("}");
  if (a !== -1 && b !== -1) clean = clean.substring(a, b + 1);
  return JSON.parse(clean);
}
