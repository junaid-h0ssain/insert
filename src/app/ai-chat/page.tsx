"use client";

import { Fragment, useState } from "react";
import { Thread } from "@/components/assistant-ui/thread";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";

const MODEL_PROVIDERS = [
  {
    id: "cerebras",
    label: "Cerebras",
    dotColor: "bg-orange-400",
    glowColor: "shadow-orange-500/20",
    models: [{ value: "zai-glm-4.7", label: "GLM-4.7" }],
  },
  {
    id: "google",
    label: "Google",
    dotColor: "bg-blue-400",
    glowColor: "shadow-blue-500/20",
    models: [{ value: "gemini-3-flash-preview", label: "Gemini 3 Flash" }],
  },
  {
    id: "groq",
    label: "Groq",
    dotColor: "bg-violet-400",
    glowColor: "shadow-violet-500/20",
    models: [
      { value: "moonshotai/kimi-k2-instruct-0905", label: "Kimi K2 Instruct" },
      { value: "deepseek-r1-distill-llama-70b", label: "DeepSeek R1 70B" },
    ],
  },
];

function getModelInfo(value: string) {
  for (const provider of MODEL_PROVIDERS) {
    const model = provider.models.find((m) => m.value === value);
    if (model) return { provider, model };
  }
  return null;
}

export default function AiChatPage() {
  const [model, setModel] = useState("gemini-3-flash-preview");
  const info = getModelInfo(model);

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
      body: { data: { model } },
    }),
  });

  return (
    <div className="relative h-screen overflow-hidden bg-background">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-56 -right-32 size-125 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-56 -left-32 size-125 rounded-full bg-violet-700/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex h-full max-w-4xl flex-col gap-3 px-4 py-4">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between px-1">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-600/30">
              <Sparkles className="size-4 text-white drop-shadow" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-snug text-foreground">
                AI Chat
              </p>
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>

          {/* Model selector */}
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-9 min-w-56 rounded-xl border-border bg-card px-3 text-sm shadow-sm transition-colors hover:bg-accent/50 focus-visible:ring-ring/50">
              {/* Required by Radix UI for selection/a11y to function correctly */}
              <SelectValue className="sr-only" />
              {info ? (
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    className={`size-2 shrink-0 rounded-full ${info.provider.dotColor}`}
                  />
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {info.provider.label}
                  </span>
                  <span className="truncate font-medium text-foreground">
                    {info.model.label}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">Select model</span>
              )}
            </SelectTrigger>

            <SelectContent className="min-w-56">
              {MODEL_PROVIDERS.map((provider, i) => (
                <Fragment key={provider.id}>
                  {i > 0 && <SelectSeparator />}
                  <SelectGroup>
                    <SelectLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      <span
                        className={`size-1.5 rounded-full ${provider.dotColor}`}
                      />
                      {provider.label}
                    </SelectLabel>
                    {provider.models.map((m) => (
                      <SelectItem
                        key={m.value}
                        value={m.value}
                        className="pl-6 text-sm"
                      >
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </Fragment>
              ))}
            </SelectContent>
          </Select>
        </header>

        {/* Chat thread */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/8 bg-card shadow-2xl shadow-black/40 ring-1 ring-inset ring-white/4">
          <AssistantRuntimeProvider runtime={runtime}>
            <Thread />
          </AssistantRuntimeProvider>
        </div>
      </div>
    </div>
  );
}
