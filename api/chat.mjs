export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, model, apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: 'API key required' });
  }
  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://quran-app.vercel.app',
        'X-Title': 'Quran App',
      },
      body: JSON.stringify({
        model: model || 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
