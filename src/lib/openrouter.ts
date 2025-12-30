interface Message {
  role: "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = "sk-or-v1-YOUR_API_KEY_HERE"; // Replace with your API key

export async function sendMessage(messages: Message[]): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "AuraChat",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o",
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `API request failed with status ${response.status}`
    );
  }

  const data: OpenRouterResponse = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  if (!data.choices?.[0]?.message?.content) {
    throw new Error("No response content received from AI");
  }

  return data.choices[0].message.content;
}

export type { Message };
