"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/lib/store";
import { TOOL_CATALOG } from "@/lib/auditEngine";
import { runAudit } from "@/lib/auditEngine";

const USE_CASES = [
  { id: "coding", label: "Coding", icon: "⌨️" },
  { id: "writing", label: "Writing", icon: "✍️" },
  { id: "data", label: "Data / Analysis", icon: "📊" },
  { id: "research", label: "Research", icon: "🔍" },
  { id: "mixed", label: "Mixed", icon: "🔀" },
];

export default function AuditPage() {
  const { tools, teamSize, useCase, setTool, setTeamSize, setUseCase } = useFormStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeCount = tools.filter(t => t.plan && t.monthlySpend > 0).length;

  async function handleSubmit() {
    if (activeCount === 0) { setError("Add at least one tool with a plan and monthly spend."); return; }
    setLoading(true);
    setError("");
    try {
      const formData = { tools: tools.filter(t => t.plan && t.monthlySpend > 0), teamSize, useCase };
      const result = runAudit(formData);
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, result }),
      });
      const data = await res.json();
      router.push(`/results/${data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <a href="/" className="text-white/40 hover:text-white/70 text-sm mb-6 inline-flex items-center gap-2">
            ← SpendLens
          </a>
          <h1 className="text-4xl font-bold mt-4 mb-2">Audit your AI spend</h1>
          <p className="text-white/50">Fill in the tools your team pays for. We'll find where you're overspending.</p>
        </div>

        {/* Team context */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/50">Team Context</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-white/60 mb-2">Team size</label>
              <input
                type="number"
                min={1}
                max={10000}
                value={teamSize}
                onChange={e => setTeamSize(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Primary use case</label>
              <select
                value={useCase}
                onChange={e => setUseCase(e.target.value as any)}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
              >
                {USE_CASES.map(u => (
                  <option key={u.id} value={u.id}>{u.icon} {u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="space-y-4 mb-8">
          {Object.entries(TOOL_CATALOG).map(([toolId, toolDef]) => {
            const tool = tools.find(t => t.toolId === toolId)!;
            const isActive = tool.plan !== "" && tool.monthlySpend > 0;
            return (
              <div key={toolId} className={`border rounded-2xl p-6 transition-all ${isActive ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-white/5"}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{toolDef.name}</h3>
                  {isActive && <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">Active</span>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Plan</label>
                    <select
                      value={tool.plan}
                      onChange={e => setTool(toolId, "plan", e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="">Not using</option>
                      {Object.entries(toolDef.plans).map(([planId, planDef]) => (
                        <option key={planId} value={planId}>
                          {planId.charAt(0).toUpperCase() + planId.slice(1)} {planDef.pricePerSeat > 0 ? `($${planDef.pricePerSeat}/seat)` : "(free/usage)"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Monthly spend ($)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={tool.monthlySpend || ""}
                      onChange={e => setTool(toolId, "monthlySpend", Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Seats</label>
                    <input
                      type="number"
                      min={1}
                      value={tool.seats}
                      onChange={e => setTool(toolId, "seats", Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {error && <div className="mb-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</div>}

        <button
          onClick={handleSubmit}
          disabled={loading || activeCount === 0}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold rounded-xl text-lg transition-all hover:scale-[1.01]"
        >
          {loading ? "Generating audit..." : `Audit ${activeCount} tool${activeCount !== 1 ? "s" : ""} →`}
        </button>
        <p className="text-center text-white/30 text-sm mt-4">Your data is saved locally. Results shown instantly.</p>
      </div>
    </main>
  );
}
