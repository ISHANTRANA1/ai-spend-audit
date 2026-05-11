# SpendLens — Free AI Tool Spend Audit

SpendLens is a free web app for startup founders and engineering managers to audit their AI tool spend across Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, and API usage — and get an instant, actionable breakdown of where they're overspending and what to switch.

**Live:** https://spendlens.vercel.app

---

## Screenshots

> See `/public/screenshots/` or the [30-second demo](https://loom.com/share/placeholder)

## Quick Start

```bash
git clone https://github.com/your-username/spendlens
cd spendlens
npm install
cp .env.example .env.local
# Add ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy to Vercel

```bash
npx vercel --prod
```

Set env vars: `ANTHROPIC_API_KEY`

---

## Decisions

1. **Next.js App Router over plain React** — Server components let us keep API keys out of the client bundle. Route handlers colocate the audit API cleanly. The app router's metadata API handles OG tags automatically.

2. **Rules-based audit engine, not AI** — The assignment explicitly tests "knowing when not to use AI." Hardcoded pricing logic is deterministic, auditable, and fast. AI is used only for the narrative summary where variance is a feature not a bug.

3. **In-memory store over a database** — For a 7-day MVP, spinning up Supabase adds infra complexity with no UX benefit. The store is architected as a Map with a clear swap-in interface. In production, replace with a single `db.insert()` call.

4. **Zustand + localStorage for form persistence** — Zustand's `persist` middleware gives us form state that survives page reloads with 3 lines of code. No server round-trips for a form the user is actively editing.

5. **Email gate after value, never before** — We show the full audit result first, then offer email capture. Conversion data from similar tools (e.g., Similarweb, HubSpot's free tools) shows 2–3x higher email capture rates when value is demonstrated first.
