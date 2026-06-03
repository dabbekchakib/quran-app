export const askAI = async (prompt, apiKey) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: prompt,
      model: 'openai/gpt-4o-mini',
      apiKey,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || data.error || `HTTP ${response.status}`);
  }

  return data.choices?.[0]?.message?.content || '';
};
