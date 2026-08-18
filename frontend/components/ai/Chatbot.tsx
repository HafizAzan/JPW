"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { aiService, type ChatMessage } from "@/services/ai.service";
import { useAuth } from "@/hooks/useAuth";
import { DISCONNECTED_REPLY, ollamaChat, ollamaConfig } from "@/lib/ollama";
import { popTransition } from "@/lib/motion";
import { cn } from "@/lib/cn";

const WELCOME =
  "Hi — I’m the HireHub assistant. Ask me how to apply, post a job, verify email, or use your dashboard.";

const SUGGESTIONS = ["How do I apply for a job?", "How do I post a job?", "How do I verify my email?"];

export function Chatbot() {
  const reduce = useReducedMotion();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [source, setSource] = useState<"local" | "server" | "offline">("offline");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: WELCOME }]);
  const scroller = useRef<HTMLDivElement>(null);
  const systemPrompt = useRef("");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await aiService.status();
        if (cancelled) return;
        setConnected(res.data.connected);
        setSource(res.data.connected && user?.ollamaBaseUrl ? "local" : res.data.connected ? "server" : "offline");
      } catch {
        if (!cancelled) {
          setConnected(false);
          setSource("offline");
        }
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [user?.ollamaBaseUrl, user?.ollamaModel]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, sending]);

  async function send(text = input) {
    const content = text.trim();
    if (!content || sending) return;
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setSending(true);
    const history = next.filter((item) => item.content !== WELCOME);

    try {
      try {
        const res = await aiService.chat(history);
        if (res.data.connected) {
          setConnected(true);
          setSource(user?.ollamaBaseUrl ? "local" : "server");
          setMessages([...next, { role: "assistant", content: res.data.reply }]);
          return;
        }
      } catch {
        // try the browser next — needed when the live API cannot see this PC
      }

      const local = ollamaConfig(user);
      if (local) {
        if (!systemPrompt.current) {
          const ctx = await aiService.context();
          systemPrompt.current = ctx.data.systemPrompt;
        }
        const reply = await ollamaChat(local, [{ role: "system", content: systemPrompt.current }, ...history]);
        setConnected(true);
        setSource("local");
        setMessages([...next, { role: "assistant", content: reply }]);
        return;
      }
      setConnected(false);
      setSource("offline");
      setMessages([...next, { role: "assistant", content: DISCONNECTED_REPLY }]);
    } catch {
      setConnected(false);
      setSource("offline");
      setMessages([...next, { role: "assistant", content: DISCONNECTED_REPLY }]);
    } finally {
      setSending(false);
    }
  }

  const statusLabel =
    source === "local"
      ? `Local Ollama · ${user?.ollamaModel}`
      : source === "server"
        ? "Answers about this platform only"
        : connected === false
          ? "AI is offline"
          : "Answers about this platform only";

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open ? (
          <motion.section
            key="hirehub-chat"
            className="pointer-events-auto flex h-[min(32rem,calc(100svh-7.5rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lift"
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={reduce ? { duration: 0 } : popTransition}
          >
            <header className="flex items-start justify-between gap-3 border-b border-border bg-primary/8 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <Sparkles size={18} />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-lg leading-tight">HireHub assistant</p>
                  <p className="truncate text-xs text-muted-foreground">{statusLabel}</p>
                </div>
              </div>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </header>

            <div ref={scroller} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((item, index) => (
                <div key={`${item.role}-${index}`} className={cn("flex", item.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      item.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                    )}
                  >
                    {item.content}
                  </div>
                </div>
              ))}
              {sending ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">Thinking…</div>
                </div>
              ) : null}
              {messages.length <= 1 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/35 hover:text-foreground"
                      onClick={() => send(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <form
              className="flex gap-2 border-t border-border p-3"
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about HireHub…"
                maxLength={800}
                className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring/15"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        className="pointer-events-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift hover:-translate-y-0.5"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close HireHub assistant" : "Open HireHub assistant"}
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>
    </div>
  );
}
