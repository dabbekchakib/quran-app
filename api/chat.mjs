export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  const MODELS = [
    "openrouter/free",
    "meta-llama/llama-4-scout:free",
    "z-ai/glm-4.5-air:free"
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const promises = MODELS.map(async (model) => {
      try {
        const res = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
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
              messages: [{ role: "user", content: message }],
              temperature: 0.3,
              max_tokens: 250
            })
          }
        );

        const data = await res.json();

        if (res.ok && data?.choices?.[0]?.message?.content) {
          return {
            model,
            content: data.choices[0].message.content
          };
        }

        return null;
      } catch (e) {
        return null;
      }
    });

    const results = await Promise.all(promises);

    const firstValid = results.find(r => r !== null);

    clearTimeout(timeout);

    if (!firstValid) {
      return res.status(500).json({
        error: "All models failed"
      });
    }

    return res.status(200).json({
      modelUsed: firstValid.model,
      response: firstValid.content
    });

  } catch (err) {
    clearTimeout(timeout);

    return res.status(500).json({
      error: err.message
    });
  }
}