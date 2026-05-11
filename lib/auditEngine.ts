// Audit Engine — rules-based logic only (no AI for math)
// All pricing verified from official vendor pages (see PRICING_DATA.md)

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolInput {
  toolId: string;
  plan: string;
  monthlySpend: number; // user-entered actual spend
  seats: number;
}

export interface FormData {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
}

export interface ToolRecommendation {
  toolId: string;
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  seats: number;
  recommendedAction: "downgrade" | "switch" | "optimize" | "optimal" | "credits";
  recommendedPlan?: string;
  recommendedTool?: string;
  recommendedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  confidence: "high" | "medium" | "low";
}

export interface AuditResult {
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
  isAlreadyOptimal: boolean;
  savingsTier: "high" | "medium" | "low" | "optimal";
}

// Official pricing data as of May 2026 — see PRICING_DATA.md for sources
export const TOOL_CATALOG: Record<string, {
  name: string;
  plans: Record<string, { pricePerSeat: number; description: string; maxSeats?: number; minSeats?: number }>;
}> = {
  cursor: {
    name: "Cursor",
    plans: {
      hobby: { pricePerSeat: 0, description: "Free tier, limited completions" },
      pro: { pricePerSeat: 20, description: "Unlimited completions, GPT-4, Claude" },
      business: { pricePerSeat: 40, description: "SSO, admin controls, centralized billing", minSeats: 1 },
      enterprise: { pricePerSeat: 60, description: "Custom contracts, SLA, dedicated support", minSeats: 20 },
    },
  },
  github_copilot: {
    name: "GitHub Copilot",
    plans: {
      individual: { pricePerSeat: 10, description: "Code completions + chat" },
      business: { pricePerSeat: 19, description: "Policy controls, audit logs", minSeats: 1 },
      enterprise: { pricePerSeat: 39, description: "Personalization, fine-tuning, Bing search", minSeats: 1 },
    },
  },
  claude: {
    name: "Claude (Anthropic)",
    plans: {
      free: { pricePerSeat: 0, description: "Limited messages, Claude 3.5 Haiku" },
      pro: { pricePerSeat: 20, description: "5x more usage, Claude 3.5 Sonnet + Opus", maxSeats: 1 },
      max: { pricePerSeat: 100, description: "20x more usage, priority access", maxSeats: 1 },
      team: { pricePerSeat: 30, description: "Collaborative features, admin console", minSeats: 2 },
      enterprise: { pricePerSeat: 60, description: "SSO, audit logs, custom context window", minSeats: 10 },
      api: { pricePerSeat: 0, description: "Pay-as-you-go API usage" },
    },
  },
  chatgpt: {
    name: "ChatGPT (OpenAI)",
    plans: {
      free: { pricePerSeat: 0, description: "GPT-4o mini, limited GPT-4o" },
      plus: { pricePerSeat: 20, description: "GPT-4o, DALL-E, browsing, plugins", maxSeats: 1 },
      team: { pricePerSeat: 30, description: "Shared workspace, higher limits", minSeats: 2 },
      enterprise: { pricePerSeat: 60, description: "SSO, unlimited GPT-4, extended context", minSeats: 10 },
      api: { pricePerSeat: 0, description: "Pay-as-you-go API" },
    },
  },
  anthropic_api: {
    name: "Anthropic API",
    plans: {
      payg: { pricePerSeat: 0, description: "Pay-as-you-go tokens" },
      credits: { pricePerSeat: 0, description: "Pre-purchased credits (discounts available)" },
    },
  },
  openai_api: {
    name: "OpenAI API",
    plans: {
      payg: { pricePerSeat: 0, description: "Pay-as-you-go tokens" },
      credits: { pricePerSeat: 0, description: "Pre-purchased credits (discounts available)" },
    },
  },
  gemini: {
    name: "Google Gemini",
    plans: {
      free: { pricePerSeat: 0, description: "Gemini 1.5 Flash, limited Pro" },
      pro: { pricePerSeat: 19.99, description: "Gemini 1.5 Pro, 2M context, Google One AI", maxSeats: 1 },
      ultra: { pricePerSeat: 249.99, description: "Gemini Ultra, highest capability", maxSeats: 1 },
      api: { pricePerSeat: 0, description: "Pay-as-you-go API" },
    },
  },
  windsurf: {
    name: "Windsurf (Codeium)",
    plans: {
      free: { pricePerSeat: 0, description: "Basic completions, limited flows" },
      pro: { pricePerSeat: 15, description: "Unlimited flows, GPT-4o, Claude" },
      teams: { pricePerSeat: 35, description: "Team admin, SSO, analytics", minSeats: 5 },
      enterprise: { pricePerSeat: 60, description: "Custom models, compliance", minSeats: 20 },
    },
  },
};

// Cheaper alternatives per use case
const ALTERNATIVES: Record<string, Record<UseCase, { toolId: string; plan: string; reason: string } | null>> = {
  cursor: {
    coding: null, // cursor IS the coding tool
    writing: { toolId: "claude", plan: "pro", reason: "Claude Pro is better for writing tasks than Cursor" },
    data: { toolId: "chatgpt", plan: "plus", reason: "ChatGPT Plus with Code Interpreter is purpose-built for data work" },
    research: { toolId: "gemini", plan: "pro", reason: "Gemini Pro has 2M context window ideal for research" },
    mixed: null,
  },
  github_copilot: {
    coding: { toolId: "windsurf", plan: "pro", reason: "Windsurf Pro at $15/seat offers comparable completions vs Copilot Business at $19" },
    writing: { toolId: "claude", plan: "pro", reason: "Claude Pro is superior for writing; Copilot adds no value here" },
    data: { toolId: "chatgpt", plan: "plus", reason: "ChatGPT Code Interpreter outperforms Copilot for data tasks" },
    research: { toolId: "claude", plan: "pro", reason: "Claude Pro's extended context is better for research than Copilot" },
    mixed: { toolId: "windsurf", plan: "pro", reason: "Windsurf Pro covers coding at $5/seat less with better UX" },
  },
  chatgpt: {
    coding: { toolId: "cursor", plan: "pro", reason: "Cursor Pro gives IDE-native coding with same models, better DX" },
    writing: { toolId: "claude", plan: "pro", reason: "Claude Sonnet consistently outperforms GPT-4o on writing benchmarks" },
    data: null,
    research: { toolId: "gemini", plan: "pro", reason: "Gemini Pro's 2M context window outperforms ChatGPT for long-document research" },
    mixed: null,
  },
  claude: {
    coding: { toolId: "cursor", plan: "pro", reason: "Cursor Pro uses Claude models but adds IDE integration for coding workflows" },
    writing: null,
    data: { toolId: "chatgpt", plan: "plus", reason: "ChatGPT's Code Interpreter is more purpose-built for data analysis" },
    research: null,
    mixed: null,
  },
  gemini: {
    coding: { toolId: "cursor", plan: "pro", reason: "Cursor Pro is the industry standard for AI coding, outperforms Gemini in IDE context" },
    writing: { toolId: "claude", plan: "pro", reason: "Claude Pro consistently outperforms Gemini on writing quality" },
    data: null,
    research: null,
    mixed: null,
  },
  windsurf: {
    coding: null,
    writing: { toolId: "claude", plan: "pro", reason: "Claude Pro is far more capable for writing tasks" },
    data: { toolId: "chatgpt", plan: "plus", reason: "ChatGPT Code Interpreter is superior for data tasks" },
    research: { toolId: "gemini", plan: "pro", reason: "Gemini's long context is better suited for research" },
    mixed: null,
  },
};

function getPlanPrice(toolId: string, plan: string, seats: number): number {
  const tool = TOOL_CATALOG[toolId];
  if (!tool) return 0;
  const planData = tool.plans[plan];
  if (!planData) return 0;
  return planData.pricePerSeat * Math.max(seats, 1);
}

function evaluateTool(input: ToolInput, teamSize: number, useCase: UseCase): ToolRecommendation {
  const { toolId, plan, monthlySpend, seats } = input;
  const tool = TOOL_CATALOG[toolId];
  const toolName = tool?.name ?? toolId;
  const officialPrice = getPlanPrice(toolId, plan, seats);

  // Base recommended spend starts at current
  let recommendedSpend = monthlySpend;
  let recommendedAction: ToolRecommendation["recommendedAction"] = "optimal";
  let recommendedPlan: string | undefined;
  let recommendedTool: string | undefined;
  let reason = "Your current plan is well-matched to your team size and usage.";
  let confidence: ToolRecommendation["confidence"] = "high";

  // 1. Check for plan-team-size mismatch (over-provisioned)
  if (toolId === "claude") {
    if (plan === "team" && seats <= 1) {
      recommendedPlan = "pro";
      recommendedSpend = getPlanPrice("claude", "pro", 1);
      recommendedAction = "downgrade";
      reason = "Claude Team requires minimum 2 seats but you have 1 — Pro plan at $20/seat gives you identical access without the team overhead.";
      confidence = "high";
    } else if (plan === "enterprise" && seats < 10) {
      recommendedPlan = "team";
      recommendedSpend = getPlanPrice("claude", "team", seats);
      recommendedAction = "downgrade";
      reason = `Claude Enterprise is designed for 10+ seat deployments. At ${seats} seats, Team plan provides 95% of the same features at $30/seat vs ~$60/seat.`;
      confidence = "high";
    } else if (plan === "max" && seats > 1) {
      // Max is single-user only; they should be on team
      recommendedPlan = "team";
      recommendedSpend = getPlanPrice("claude", "team", seats);
      recommendedAction = "downgrade";
      reason = `Claude Max is a single-user plan — you can't share it across ${seats} seats. Claude Team at $30/seat gives each person their own account.`;
      confidence = "high";
    }
  }

  if (toolId === "chatgpt") {
    if (plan === "team" && seats === 1) {
      recommendedPlan = "plus";
      recommendedSpend = getPlanPrice("chatgpt", "plus", 1);
      recommendedAction = "downgrade";
      reason = "ChatGPT Team for 1 user is $10/month more than Plus with no benefit — both give you GPT-4o access.";
      confidence = "high";
    } else if (plan === "enterprise" && seats < 10) {
      recommendedPlan = "team";
      recommendedSpend = getPlanPrice("chatgpt", "team", seats);
      recommendedAction = "downgrade";
      reason = `ChatGPT Enterprise is cost-effective at scale (20+ seats). At ${seats} seats, Team plan saves $30/seat/month with minimal feature reduction.`;
      confidence = "high";
    }
  }

  if (toolId === "cursor") {
    if (plan === "business" && seats <= 3) {
      recommendedPlan = "pro";
      recommendedSpend = getPlanPrice("cursor", "pro", seats);
      recommendedAction = "downgrade";
      reason = `Cursor Business adds SSO and admin controls. For ${seats} devs, Cursor Pro at $20/seat delivers the same AI features — save $${(40 - 20) * seats}/month.`;
      confidence = "high";
    } else if (plan === "enterprise" && seats < 20) {
      recommendedPlan = "business";
      recommendedSpend = getPlanPrice("cursor", "business", seats);
      recommendedAction = "downgrade";
      reason = `Cursor Enterprise is structured for 20+ dev teams. At ${seats} seats, Business plan gives you all essential controls at $20/seat less.`;
      confidence = "high";
    }
  }

  if (toolId === "github_copilot") {
    if (plan === "enterprise" && seats < 15) {
      recommendedPlan = "business";
      recommendedSpend = getPlanPrice("github_copilot", "business", seats);
      recommendedAction = "downgrade";
      reason = `Copilot Enterprise adds Bing search and fine-tuning, features that benefit large teams. At ${seats} devs, Business plan saves $20/seat/month with full code completion parity.`;
      confidence = "medium";
    }
  }

  if (toolId === "gemini") {
    if (plan === "ultra" && useCase !== "research" && useCase !== "data") {
      recommendedPlan = "pro";
      recommendedSpend = getPlanPrice("gemini", "pro", seats) * seats;
      recommendedAction = "downgrade";
      reason = `Gemini Ultra at $250/month is built for frontier research/multimodal tasks. For ${useCase} use cases, Gemini Pro at $20/month delivers 90%+ of that value.`;
      confidence = "medium";
    }
  }

  // 2. Check if user is overpaying vs official price (possible seat miscalculation)
  if (recommendedAction === "optimal" && officialPrice > 0 && monthlySpend > officialPrice * 1.1) {
    recommendedAction = "optimize";
    recommendedSpend = officialPrice;
    reason = `Your reported spend ($${monthlySpend}/mo) is above the official plan price ($${officialPrice}/mo for ${seats} seats). Check for unused add-ons or legacy pricing.`;
    confidence = "medium";
  }

  // 3. Check for cheaper alternative tools by use case
  if (recommendedAction === "optimal" && monthlySpend > 20) {
    const alt = ALTERNATIVES[toolId]?.[useCase];
    if (alt) {
      const altTool = TOOL_CATALOG[alt.toolId];
      const altPrice = getPlanPrice(alt.toolId, alt.plan, seats);
      if (altPrice < monthlySpend * 0.75) {
        // Only suggest if >25% cheaper
        recommendedAction = "switch";
        recommendedTool = alt.toolId;
        recommendedPlan = alt.plan;
        recommendedSpend = altPrice;
        reason = alt.reason;
        confidence = "medium";
      }
    }
  }

  // 4. API users — suggest credits for significant spend
  if ((toolId === "anthropic_api" || toolId === "openai_api") && monthlySpend > 200) {
    recommendedAction = "credits";
    recommendedSpend = monthlySpend * 0.8; // ~20% discount on pre-purchased credits
    reason = `At $${monthlySpend}/month on ${toolName}, pre-purchased credits through resellers like Credex typically save 15–25% vs retail pay-as-you-go. Your usage volume makes this worthwhile.`;
    confidence = "medium";
  }

  const monthlySavings = Math.max(0, monthlySpend - recommendedSpend);

  return {
    toolId,
    toolName,
    currentPlan: plan,
    currentSpend: monthlySpend,
    seats,
    recommendedAction,
    recommendedPlan,
    recommendedTool: recommendedTool ? TOOL_CATALOG[recommendedTool]?.name : undefined,
    recommendedSpend,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason,
    confidence,
  };
}

export function runAudit(formData: FormData): AuditResult {
  const recommendations = formData.tools
    .filter((t) => t.monthlySpend > 0 || t.plan !== "")
    .map((t) => evaluateTool(t, formData.teamSize, formData.useCase));

  const totalCurrentSpend = recommendations.reduce((sum, r) => sum + r.currentSpend, 0);
  const totalOptimizedSpend = recommendations.reduce((sum, r) => sum + r.recommendedSpend, 0);
  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  const isAlreadyOptimal = recommendations.every((r) => r.recommendedAction === "optimal");

  let savingsTier: AuditResult["savingsTier"];
  if (totalMonthlySavings >= 500) savingsTier = "high";
  else if (totalMonthlySavings >= 100) savingsTier = "medium";
  else if (totalMonthlySavings > 0) savingsTier = "low";
  else savingsTier = "optimal";

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    totalCurrentSpend,
    totalOptimizedSpend,
    isAlreadyOptimal,
    savingsTier,
  };
}
