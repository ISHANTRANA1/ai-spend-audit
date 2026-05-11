import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpendLens — Free AI Tool Spend Audit",
  description: "Find out if you're overpaying for AI tools. Get an instant audit of your Cursor, Claude, ChatGPT, and Copilot spend. Free, no login required.",
  openGraph: {
    title: "SpendLens — Are you overpaying for AI tools?",
    description: "Free instant audit. See exactly where you're overspending on AI tools and how much you could save.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens — Free AI Spend Audit",
    description: "Find out if you're overpaying for AI tools in 2 minutes.",
    images: ["/og.png"],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="7" cy="7" r="2" fill="white"/>
              </svg>
            </div>
            <span className="font-semibold tracking-tight">SpendLens</span>
          </div>
          <Link href="/audit" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors">
            Start free audit →
          </Link>
        </div>
      </nav>

      <section className="pt-40 pb-24 px-6 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
          Free — no login required
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl">
          Are you{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">overpaying</span>{" "}
          for AI tools?
        </h1>
        <p className="text-xl text-white/50 max-w-xl mb-10 leading-relaxed">
          Most startups don&apos;t know they&apos;re leaving money on the table. Get a free, instant audit of your AI tool spend — where you&apos;re wasting money and exactly what to do about it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/audit" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
            Audit my AI spend
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <span className="text-sm text-white/30 self-center">Takes 2 minutes. 100% free.</span>
        </div>
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg">
          {[{value:"$847",label:"avg monthly overspend"},{value:"73%",label:"of teams on wrong plan"},{value:"2 min",label:"to complete audit"}].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-emerald-400">{s.value}</div>
              <div className="text-sm text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
        <h2 className="text-3xl font-bold mb-16">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {step:"01",title:"Enter your tools",desc:"Tell us what AI tools your team pays for, which plans, and how many seats."},
            {step:"02",title:"Get your audit",desc:"Our engine compares your spend against current pricing and usage-fit benchmarks."},
            {step:"03",title:"See the savings",desc:"Instant breakdown of where you're overspending and exactly what to switch."},
          ].map((s) => (
            <div key={s.step} className="group">
              <div className="text-5xl font-bold text-white/[0.06] mb-4 group-hover:text-emerald-500/20 transition-colors">{s.step}</div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-white/50 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
        <p className="text-sm text-white/40 uppercase tracking-widest mb-8">Supports all major AI tools</p>
        <div className="flex flex-wrap gap-3">
          {["Cursor","GitHub Copilot","Claude","ChatGPT","Anthropic API","OpenAI API","Gemini","Windsurf"].map((tool) => (
            <span key={tool} className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white/70">{tool}</span>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Find your savings in 2 minutes</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">No account needed. No credit card. Just clear, honest analysis of your AI spend.</p>
          <Link href="/audit" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-lg transition-all hover:scale-[1.02]">
            Start free audit →
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6 text-center text-white/30 text-sm">
        Built by <a href="https://credex.rocks" className="text-emerald-500/70 hover:text-emerald-400">Credex</a> · AI infrastructure credits at a discount
      </footer>
    </main>
  );
}
