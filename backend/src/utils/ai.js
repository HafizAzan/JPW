import { env } from "../config/env.js";

export const DISCONNECTED_REPLY = "AI is not connected. Please connect AI?";

export function normalizeOllamaUrl(url = "") {
  return String(url)
    .trim()
    .replace(/\/$/, "")
    .replace("://localhost", "://127.0.0.1");
}

function stripThink(text) {
  return String(text ?? "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```(?:json)?/gi, "")
    .trim();
}

function ollamaFromUser(user) {
  const baseUrl = normalizeOllamaUrl(user?.ollamaBaseUrl);
  const model = String(user?.ollamaModel ?? "").trim();
  if (!baseUrl || !model) return null;
  return { baseUrl, model };
}

async function openaiChat(messages) {
  const response = await fetch(`${env.ai.openaiBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.ai.openaiKey}`,
    },
    body: JSON.stringify({
      model: env.ai.openaiModel,
      temperature: 0.4,
      messages,
    }),
    signal: AbortSignal.timeout(40000),
  });
  if (!response.ok) {
    throw new Error(`OpenAI ${response.status}`);
  }
  const payload = await response.json();
  const text = stripThink(payload.choices?.[0]?.message?.content);
  if (!text) throw new Error("Empty OpenAI response");
  return { text, provider: "openai" };
}

async function ollamaChat(messages, { baseUrl, model }) {
  const response = await fetch(`${normalizeOllamaUrl(baseUrl)}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages,
    }),
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) {
    throw new Error(`Ollama ${response.status}`);
  }
  const payload = await response.json();
  const text = stripThink(payload.message?.content);
  if (!text) throw new Error("Empty Ollama response");
  return { text, provider: "ollama" };
}

export async function probeOllama(baseUrl) {
  const url = normalizeOllamaUrl(baseUrl);
  if (!url) throw new Error("Enter an Ollama URL");
  const response = await fetch(`${url}/api/tags`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Ollama did not respond");
  const payload = await response.json();
  return (payload.models ?? []).map((item) => item.name).filter(Boolean);
}

export async function probeAi(user) {
  const local = ollamaFromUser(user);
  if (local) {
    try {
      await probeOllama(local.baseUrl);
      return { connected: true, provider: "ollama" };
    } catch {
      // try server defaults next
    }
  }
  if (env.ai.openaiKey) {
    return { connected: true, provider: "openai" };
  }
  if (env.ai.ollamaBaseUrl) {
    try {
      await probeOllama(env.ai.ollamaBaseUrl);
      return { connected: true, provider: "ollama" };
    } catch {
      // offline
    }
  }
  return { connected: false, provider: null };
}

export async function completeChat(messages, user) {
  const local = ollamaFromUser(user);
  if (local) {
    try {
      return { ok: true, ...(await ollamaChat(messages, local)) };
    } catch {
      // fall through
    }
  }
  if (env.ai.openaiKey) {
    try {
      return { ok: true, ...(await openaiChat(messages)) };
    } catch {
      // try env ollama
    }
  }
  if (env.ai.ollamaBaseUrl) {
    try {
      return {
        ok: true,
        ...(await ollamaChat(messages, { baseUrl: env.ai.ollamaBaseUrl, model: env.ai.ollamaModel })),
      };
    } catch {
      // disconnected
    }
  }
  return { ok: false, text: DISCONNECTED_REPLY, provider: null };
}
