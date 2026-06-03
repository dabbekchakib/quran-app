export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  const FREE_MODELS = [
    "openrouter/free",
    "meta-llama/llama-4-scout:free",
    "openai/gpt-oss-120b:free",
    "nvidia/llama-3.1-nemotron-3-super:free",
    "z-ai/glm-4.5-air:free"
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const requests = FREE_MODELS.map((model) =>
      fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
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
          ],
          // 🔥 speed optimizations
          temperature: 0.3,
          max_tokens: 300
        })
      })
        .then(async (r) => {
          const data = await r.json();
          if (r.ok && data?.choices?.[0]) {
            controller.abort(); // cancel others instantly
            return {
              model,
              data
            };
          }
          return null;
        })
        .catch(() => null)
    );

    const result = await Promise.any(requests);

    clearTimeout(timeout);

    return res.status(200).json({
      modelUsed: result.model,
      response: result.data
    });
  } catch (err) {
    clearTimeout(timeout);

    return res.status(500).json({
      error: "All models failed or timeout",
      details: err.message
    });
  }
}