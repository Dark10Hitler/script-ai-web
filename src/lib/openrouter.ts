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

const SYSTEM_PROMPT = "You are a World-Class Analytical Strategist. Analyze deeply, avoid robotic headers like 'CRITICAL ANALYSIS'. Use professional, fluid language and First Principles thinking. Bold key insights. Keep it conversational but expert-level.";

export async function sendMessage(messages: Message[]): Promise<string> {
  const messagesWithSystem = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "HTTP-Referer": "https://lovable.dev",
      "X-Title": "AuraChat Professional",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o",
      messages: messagesWithSystem,
      temperature: 0.7,
    }),
  });

  console.log("OpenRouter Response:", response);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.log("OpenRouter Error Data:", errorData);
    throw new Error(
      errorData.error?.message || `API request failed with status ${response.status}`
    );
  }

  const data: OpenRouterResponse = await response.json();
  console.log("OpenRouter Data:", data);

  if (data.error) {
    throw new Error(data.error.message);
  }

  if (!data.choices?.[0]?.message?.content) {
    throw new Error("No response content received from AI");
  }

  return data.choices[0].message.content;
}

export type { Message };
