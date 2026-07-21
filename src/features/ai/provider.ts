export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIProvider {
  generate(messages: AIMessage[]): Promise<string>;
}

export function createOpenAIProvider(apiKey: string, baseUrl: string, model: string): AIProvider {
  return {
    async generate(messages) {
      const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 1024 }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`AI API error ${res.status}: ${text}`);
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? "";
    },
  };
}
