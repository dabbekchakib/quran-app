export const askAI = async (prompt, apiKey) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
    },
    body: JSON.stringify({
      message: prompt,
      model: 'openai/gpt-4o-mini',
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
};
