import { api } from "@/lib/api";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const aiService = {
  status() {
    return api<{ connected: boolean; provider: string | null }>("/ai/status");
  },
  chat(messages: ChatMessage[]) {
    return api<{ reply: string; connected: boolean; provider?: string | null }>("/ai/chat", {
      method: "POST",
      body: { messages },
    });
  },
  draftJob(payload: {
    title: string;
    location?: string;
    workplace?: string;
    jobType?: string;
    experienceLevel?: string;
    category?: string;
    notes?: string;
  }) {
    return api<{
      description: string;
      responsibilities: string[];
      requirements: string[];
      skills: string[];
    }>("/ai/job-draft", { method: "POST", body: payload });
  },
  draftCoverLetter(jobId: string) {
    return api<{ coverLetter: string }>("/ai/cover-letter", { method: "POST", body: { jobId } });
  },
  context() {
    return api<{
      systemPrompt: string;
      jobDraftPrompt: string;
      coverLetterPrompt: string;
      server: { connected: boolean; provider: string | null };
    }>("/ai/context");
  },
  probeOllama(baseUrl: string) {
    return api<{ connected: boolean; models: string[] }>("/ai/ollama/probe", {
      method: "POST",
      body: { baseUrl },
    });
  },
};
