"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { AuditResult, ToolRecommendation } from "@/lib/auditEngine";

function ActionBadge({ action }: { action: string }) {
  const map: Record<string, { label: string; color: string }> = {
    downgrade: { label: "Downgrade", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    switch: { label: "Switch tool", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    optimize: { label: "Optimize", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    optimal: { label: "✓ Optimal", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    credits: { label: "Buy credits", color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
  };
  const m = map[action] ?? { label: action, color: "text-white/50 bg-white/5 border-white/10" };
  return <span className={`text-xs px-2 py-1 rounded-full border font-medium ${m.color}`}>{m.label}</span>;
}

function LeadCapture({ auditId, savingsTier }: { auditId: string; savingsTier: string }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, company, role, website, auditId }),
    });
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
        <div className="text-3xl mb-3">✓</div>
        <h3 className="font-semibold text-emerald-400 mb-1">Report saved to your inbox</h3>
        <p className="text-white/50 text-sm">We'll reach out if we spot new optimization opportunities for your stack.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
      <h3 className="font-semibold text-lg mb-1">Get your full report</h3>
      <p className="text-white/50 text-sm mb-6">We'll email you this audit and notify you when new savings apply to your stack.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot - hidden from real users */}
        <input type="text" name="website" value={website} onChange={e => setWebsite(e.target.value)} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
        <input required type="email" placeholder="Work email *" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Company (optional)" value={company} onChange={e => setCompany(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
          <input type="text" placeholder="Role (optional)" value={role} onChange={e => setRole(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all disabled:opacity-40">
          {loading ? "Sending..." : "Send me the report"}
        </button>
      </form>
      {savingsTier === "high" && (
        <div className="mt-6 p-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 rounded-xl">
          <p className="text-sm font-semibold text-teal-400 mb-1">💡 High savings detected</p>
          <p className="text-xs text-white/50">Your team qualifies for a free Credex consultation. We source AI credits at 15–40% below retail from companies that overforecast. <a href="https://credex.rocks" className="text-teal-400 hover:underline">Learn more →</a></p>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [summary, setSummary] = useState<string>("");
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/audit?id=${id}`)
      .then(r => r.json())
      .then(data => {
        setResult(data.result);
        setFormData(data.formData);
        setLoading(false);
        // Fetch AI summary
        fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result: data.result, useCase: data.formData.useCase, teamSize: data.formData.teamSize }),
        }).then(r => r.json()).then(d => { setSummary(d.summary); setSummaryLoading(false); })
          .catch(() => setSummaryLoading(false));
      })
      .catch(() => setLoading(false));
  }, [id]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/50">
      Loading your audit...
    </div>
  );

  if (!result) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/50">
      Audit not found. <a href="/audit" className="text-emerald-400 ml-2">Start a new one →</a>
    </div>
  );

  const isOptimal = result.savingsTier === "optimal";

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <a href="/" className="text-white/40 hover:text-white/70 text-sm inline-flex items-center gap-2">← SpendLens</a>
          <button onClick={copyLink} className="text-sm text-white/50 hover:text-white border border-white/10 px-4 py-2 rounded-lg transition-colors">
            {copied ? "✓ Copied!" : "Share link"}
          </button>
        </div>

        {/* Hero savings */}
        <div className={`rounded-2xl p-10 mb-8 text-center ${isOptimal ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20"}`}>
          {isOptimal ? (
            <>
              <div className="text-5xl mb-4">✨</div>
              <h1 className="text-3xl font-bold text-emerald-400 mb-2">You're spending well</h1>
              <p className="text-white/50">No significant savings found. Your AI stack is well-matched to your team's needs.</p>
            </>
          ) : (
            <>
              <p className="text-white/50 text-sm mb-3 uppercase tracking-wider">Potential savings found</p>
              <div className="text-6xl font-bold text-emerald-400 mb-1">${result.totalMonthlySavings.toLocaleString()}<span className="text-2xl text-white/30">/mo</span></div>
              <div className="text-2xl text-white/50 mb-4">${result.totalAnnualSavings.toLocaleString()} per year</div>
              <div className="flex justify-center gap-8 text-sm">
                <div><span className="text-white/40">Current: </span><span className="font-semibold">${result.totalCurrentSpend}/mo</span></div>
                <div><span className="text-white/40">Optimized: </span><span className="font-semibold text-emerald-400">${result.totalOptimizedSpend}/mo</span></div>
              </div>
            </>
          )}
        </div>

        {/* AI Summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-white/40">AI-generated analysis</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
          </div>
          {summaryLoading ? (
            <div className="h-16 flex items-center text-white/30 text-sm">Generating personalized analysis...</div>
          ) : (
            <p className="text-white/80 leading-relaxed">{summary}</p>
          )}
        </div>

        {/* Per-tool breakdown */}
        <h2 className="text-xl font-semibold mb-4">Tool-by-tool breakdown</h2>
        <div className="space-y-4 mb-10">
          {result.recommendations.map((rec: ToolRecommendation) => (
            <div key={rec.toolId} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{rec.toolName}</h3>
                    <ActionBadge action={rec.recommendedAction} />
                  </div>
                  <p className="text-sm text-white/40">{rec.currentPlan} · {rec.seats} seat{rec.seats !== 1 ? "s" : ""} · ${rec.currentSpend}/mo</p>
                </div>
                {rec.monthlySavings > 0 && (
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-400">-${rec.monthlySavings}/mo</div>
                    <div className="text-xs text-white/40">-${rec.annualSavings}/yr</div>
                  </div>
                )}
              </div>
              <p className="text-sm text-white/60 bg-white/5 rounded-lg px-4 py-3">{rec.reason}</p>
              {rec.recommendedPlan && rec.recommendedAction !== "optimal" && (
                <div className="mt-3 text-sm text-white/50">
                  Recommended: <span className="text-white font-medium">{rec.recommendedTool ?? rec.toolName} {rec.recommendedPlan}</span>
                  {" "}→ <span className="text-emerald-400">${rec.recommendedSpend}/mo</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lead capture */}
        <LeadCapture auditId={id} savingsTier={result.savingsTier} />

        <div className="mt-8 text-center">
          <a href="/audit" className="text-white/40 hover:text-white/60 text-sm">← Run a new audit</a>
        </div>
      </div>
    </main>
  );
}
