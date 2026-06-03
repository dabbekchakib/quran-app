export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  const FREE_MODELS = [
    "openai/gpt-oss-120b:free",
    "nvidia/llama-3.1-nemotron-3-super:free",
    "z-ai/glm-4.5-air:free",
    "poolside/laguna-m.1:free",
    "poolside/laguna-xs.2:free",
    "meta-llama/llama-4-scout:free",
    "meta-llama/llama-4-maverick:free",
    "moonshotai/kimi-vl-a3b-thinking:free",
    "openrouter/free"
  ];

  let lastError = null;

  for (const model of FREE_MODELS) {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://quran-app.vercel.app",
            "X-Title": "Quran App"
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "user",
                content: message
              }
            ]
          })
        }
      );

      const data = await response.json();

      if (response.ok && data?.choices?.[0]) {
        return res.status(200).json({
          modelUsed: model,
          response: data
        });
      }

      lastError = data;

    } catch (err) {
      lastError = err.message;
    }
  }

  return res.status(500).json({
    error: "All models failed",
    details: lastError
  });
}
