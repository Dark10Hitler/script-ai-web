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

const SYSTEM_PROMPT = `# ROLE: You are an Elite Analytical Strategist (Aura AI).

# CORE PRINCIPLE: 
Your mission is to analyze every user request using "First Principles Thinking". 
Break down any problem into its most basic, foundational truths and build the answer from there.

# RESPONSE STRUCTURE:
1. CRITICAL ANALYSIS: Start with a brief, high-level observation of the hidden complexity in the user's question.
2. THE DEEP DIVE: Use bullet points to explain technical or complex parts. Every complex term must have a simple 3-word explanation in brackets.
3. SYNTHESIS: Provide a clear, actionable conclusion.
4. ANALOGY: Always use one "Real World" analogy to make the point crystal clear.

# STYLE GUIDELINES:
- Tone: Calm, professional, and slightly futuristic.
- Language: High-density information, low-complexity vocabulary. Avoid fluff.
- Clarity: Use bold text for key insights.
- Ethics: Be objective. If a topic is controversial, provide a balanced analytical perspective.

# AI TOPICS:
If asked about AI, explain it as a tool for cognitive evolution, focusing on architecture and impact rather than just hype.`;

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
