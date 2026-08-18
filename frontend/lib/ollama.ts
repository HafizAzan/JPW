import type { User } from "@/types";

export const DISCONNECTED_REPLY = "AI is not connected. Please connect AI?";

export type OllamaConfig = {
  baseUrl: string;
  model: string;
};

function stripThink(text: string) {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```(?:json)?/gi, "")
    .trim();
}

export function normalizeOllamaUrl(url = "") {
  return url.trim().replace(/\/$/, "").replace("://localhost", "://127.0.0.1");
}

export function ollamaConfig(user?: User | null): OllamaConfig | null {
  const baseUrl = normalizeOllamaUrl(user?.ollamaBaseUrl);
  const model = user?.ollamaModel?.trim();
  if (!baseUrl || !model) return null;
  return { baseUrl, model };
}

export async function probeOllama(baseUrl: string) {
  const url = normalizeOllamaUrl(baseUrl);
  const response = await fetch(`${url}/api/tags`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Ollama did not respond");
  const payload = (await response.json()) as { models?: Array<{ name?: string }> };
  return (payload.models ?? []).map((item) => item.name).filter(Boolean) as string[];
}

export async function ollamaChat(config: OllamaConfig, messages: Array<{ role: string; content: string }>) {
  const response = await fetch(`${config.baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.model,
      stream: false,
      messages,
    }),
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error("Ollama request failed");
  const payload = (await response.json()) as { message?: { content?: string } };
  const text = stripThink(payload.message?.content ?? "");
  if (!text) throw new Error("Empty Ollama response");
  return text;
}

export function parseJsonObject(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as Record<string, unknown>;
  } catch {
    return null;
  }
}
