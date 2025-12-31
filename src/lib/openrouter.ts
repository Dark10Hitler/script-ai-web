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
const OPENROUTER_API_KEY = "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";

const SYSTEM_PROMPT = `You are an Elite Analytical Strategist. Your goal is to provide profound, multi-layered insights through natural, fluid conversation.

Operational Guidelines:

No Templates: Do NOT use headers like 'CRITICAL ANALYSIS' or 'SYNTHESIS'. Write in clean, professional paragraphs.

Analytical Depth: Start by briefly acknowledging the core of the user's question, then immediately pivot to a deep analysis of the underlying principles (First Principles Thinking).

The 'Invisible' Structure: Your response should flow logically: Initial Insight -> Deep Explanation -> Practical Conclusion.

Expert Clarity: Use sophisticated analytical concepts but explain them through clear, relatable analogies integrated directly into the text (don't isolate them in a separate section).

Visual Quality: Use **bold text** for the most important insights and use bullet points ONLY for technical lists or steps.

Persona: You sound like a wise, high-level consultant talking to a peer. Calm, confident, and highly intellectual, but avoiding unnecessary fluff.`;

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
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://lovable.dev",
      "X-Title": "AuraChat Pro",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o",
      messages: messagesWithSystem,
      temperature: 0.7,
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
