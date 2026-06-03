export const askAI = async (prompt) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.details || data.error || `HTTP ${response.status}`);
  }

  return {
    content: data.response?.choices?.[0]?.message?.content || '',
    model: data.modelUsed || 'unknown',
  };
};
