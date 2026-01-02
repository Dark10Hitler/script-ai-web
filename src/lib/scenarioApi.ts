const API_BASE = 'https://scenaries.onrender.com';

export interface GenerateResponse {
  result?: string;
  scenario?: string;
  content?: string;
  error?: string;
}

export const generateScenario = async (
  userId: string,
  prompt: string
): Promise<GenerateResponse> => {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      prompt: prompt,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Generation failed');
  }

  return response.json();
};
