export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  const { message, model } = req.body;

  if (!message) {
    return res.status(400).json({
      error: 'Message required'
    });
  }

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://quran-app.vercel.app',
          'X-Title': 'Quran App',
        },
        body: JSON.stringify({
          model: model || 'deepseek/deepseek-chat-v3:free',
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter error:', data);

      return res.status(response.status).json({
        error: data.error || 'OpenRouter request failed',
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}