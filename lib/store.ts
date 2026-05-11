import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FormData, UseCase, ToolInput } from "./auditEngine";

const DEFAULT_TOOLS: ToolInput[] = [
  { toolId: "cursor", plan: "", monthlySpend: 0, seats: 1 },
  { toolId: "github_copilot", plan: "", monthlySpend: 0, seats: 1 },
  { toolId: "claude", plan: "", monthlySpend: 0, seats: 1 },
  { toolId: "chatgpt", plan: "", monthlySpend: 0, seats: 1 },
  { toolId: "anthropic_api", plan: "", monthlySpend: 0, seats: 1 },
  { toolId: "openai_api", plan: "", monthlySpend: 0, seats: 1 },
  { toolId: "gemini", plan: "", monthlySpend: 0, seats: 1 },
  { toolId: "windsurf", plan: "", monthlySpend: 0, seats: 1 },
];

interface FormStore {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
  setTool: (toolId: string, field: keyof ToolInput, value: string | number) => void;
  setTeamSize: (size: number) => void;
  setUseCase: (useCase: UseCase) => void;
  getActiveTools: () => ToolInput[];
  reset: () => void;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      tools: DEFAULT_TOOLS,
      teamSize: 1,
      useCase: "mixed",
      setTool: (toolId, field, value) =>
        set((state) => ({
          tools: state.tools.map((t) =>
            t.toolId === toolId ? { ...t, [field]: value } : t
          ),
        })),
      setTeamSize: (size) => set({ teamSize: size }),
      setUseCase: (useCase) => set({ useCase }),
      getActiveTools: () => get().tools.filter((t) => t.plan !== "" && t.monthlySpend > 0),
      reset: () => set({ tools: DEFAULT_TOOLS, teamSize: 1, useCase: "mixed" }),
    }),
    { name: "ai-spend-audit-form" }
  )
);
