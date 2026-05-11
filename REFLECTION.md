# REFLECTION.md

## 1. Hardest bug — and how I debugged it

The hardest bug was the audit results page returning a 404 for any result ID immediately after redirect. The `/api/audit` POST would return a valid `id`, the browser would redirect to `/results/[id]`, but the GET to `/api/audit?id=...` would come back 404.

My first hypothesis: the nanoid was being URL-encoded and then mis-decoded server-side. I logged the raw ID at POST time and GET time — they matched exactly. Not that.

Second hypothesis: the in-memory Map wasn't persisting between requests in Next.js dev mode. I confirmed this by adding a `console.log(auditStore.size)` — it was always 0 on the GET request. The issue: Next.js hot-reload in dev was re-instantiating the module on every request, resetting the Map. In production this wouldn't happen (the module is only loaded once), but in dev it meant the store was always empty.

Fix: moved the store to a module-level singleton with an explicit guard (`global.__auditStore`), which survives hot-reloads. Long term the right fix is a real database; the in-memory approach is intentionally temporary and documented in ARCHITECTURE.md.

## 2. A decision I reversed mid-week

I initially built the audit form as a multi-step wizard — one tool per screen, progress bar at top. The logic was that a long single-page form would feel overwhelming.

I reversed it on Day 3 after showing it to a friend (informal user test, not the formal interviews). His reaction: "Why can't I just see everything at once? I want to scan which tools I use and skip the rest." The wizard forced him through 8 screens for the 2 tools he actually used.

Switched to a single-page form where unused tools collapse to a minimal row. This also made the "tools I use" mental model clearer — seeing all 8 at once and activating only the ones you pay for is closer to how people actually think about their stack.

## 3. What I'd build in Week 2

**Priority 1 — Real database.** The in-memory store means audits vanish on server restart and can't survive Vercel's serverless cold starts. Supabase with a single `audits` table is a one-afternoon swap.

**Priority 2 — Transactional email.** The lead capture form stores emails but doesn't send a confirmation. Resend has a generous free tier and a Next.js SDK. The email itself is the product — it's what gets forwarded to the CFO.

**Priority 3 — Benchmark mode.** The most surprising insight from user interviews: people want to know if their spend is *normal* for their stage. "Your team spends $X/developer vs $Y average for Series A startups" is a feature worth paying for. Requires aggregating anonymized audit data.

**Priority 4 — OG image generation.** A dynamic `/api/og?savings=847&tools=cursor,claude` image that renders as the link preview would significantly increase click-through on shared results.

## 4. How I used AI tools

**Used Claude (Sonnet):**
- Drafting initial structure for ECONOMICS.md and GTM.md — I wrote the frameworks, Claude filled in the prose which I then edited heavily
- Debugging the module singleton pattern for the in-memory store (explained the hot-reload behavior I didn't fully understand)
- Writing the fallback summary function — gave it my logic, it wrote clean TypeScript

**Used Claude for code generation, but not for:**
- The audit engine logic — I wrote every rule by hand. The risk of AI hallucinating pricing numbers or recommendation logic is too high; this is the product's core value and needs to be verifiable
- User interview questions — I wanted genuine curiosity, not AI-optimized interview scripts
- Economics math — I built the spreadsheet myself so I could trust the numbers

**One time AI was wrong:** I asked Claude to write the rate-limiting logic for `/api/leads`. It generated a Redis-based solution using `ioredis`. I didn't have Redis running and didn't want the dependency. The suggestion was technically correct but wrong for the context. I replaced it with the simple Map-based approach in the file, which is good enough for MVP scale.

## 5. Self-ratings

- **Discipline: 7/10** — Committed work across all 7 days, but Day 4 was short and I could have done more.
- **Code quality: 7/10** — TypeScript throughout, sensible abstractions, but the in-memory store is a known shortcut I'd never ship to production.
- **Design sense: 8/10** — The dark theme, savings hero, and per-tool breakdown cards look genuinely polished; I'm happy with the results page.
- **Problem-solving: 8/10** — The hot-reload bug took time but I diagnosed it systematically; the form redesign from wizard to single-page was the right call.
- **Entrepreneurial thinking: 7/10** — The GTM and economics docs are real and specific; the user interviews were genuinely informative and changed the product.
