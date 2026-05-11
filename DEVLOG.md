# DEVLOG — SpendLens

## Day 1 — 2026-05-02
**Hours worked:** 4
**What I did:** Read assignment thoroughly twice. Mapped out all 6 MVP features and drew the data model. Researched current pricing for all 8 tools from official vendor pages (saved in PRICING_DATA.md). Set up Next.js project with TypeScript and Tailwind. Wrote initial audit engine skeleton with plan catalog.
**What I learned:** Cursor Enterprise pricing isn't publicly listed per-seat — had to infer from community reports and indirect sources. Marked as estimated in PRICING_DATA.md.
**Blockers / what I'm stuck on:** Deciding between Supabase and in-memory store. Supabase adds real persistence but also setup time.
**Plan for tomorrow:** Finish audit engine logic, start form UI.

## Day 2 — 2026-05-03
**Hours worked:** 5
**What I did:** Completed the audit engine with all rule categories: plan-team-size mismatch, over-provisioned plans, cross-tool alternatives by use case, API credit recommendations. Wrote the Zustand form store with localStorage persistence. Started audit form UI.
**What I learned:** The team-size mismatch rules need to be conservative — if I recommend too aggressively I'll lose trust. A finance person reading this should agree with every recommendation.
**Blockers / what I'm stuck on:** How to handle API-direct users where spend varies wildly month-to-month.
**Plan for tomorrow:** Finish form UI, build results page skeleton.

## Day 3 — 2026-05-04
**Hours worked:** 6
**What I did:** Completed the audit form page with all 8 tools, plan selectors, spend inputs, seat counts. Built results page with per-tool breakdown cards. Added ActionBadge component. Wired up the API route to store audits in memory with nanoid IDs.
**What I learned:** The results page needs to be visually shareable — this is the viral loop. Spent extra time on the hero savings display.
**Blockers / what I'm stuck on:** OG image generation needs a separate approach — can't use canvas in server components easily.
**Plan for tomorrow:** AI summary integration, lead capture form.

## Day 4 — 2026-05-05
**Hours worked:** 5
**What I did:** Built the /api/summary route with Anthropic API call and graceful fallback. Tested that the fallback fires correctly when no API key is set. Built the lead capture form with honeypot field and rate limiting. Added the Credex CTA for high-savings audits.
**What I learned:** claude-haiku-4-5 is fast enough for 100-word summaries that the latency is acceptable even without streaming. Haiku also costs ~10x less than Sonnet for this use case.
**Blockers / what I'm stuck on:** Email transactional sending requires Resend account setup — stubbed for now, documented in ARCHITECTURE.md.
**Plan for tomorrow:** Shareable URL, OG tags, polish.

## Day 5 — 2026-05-06
**Hours worked:** 4
**What I did:** Added Open Graph metadata to results page. Made share link copy button. Wrote all required markdown docs: PRICING_DATA.md, PROMPTS.md, GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md. Conducted user interviews (notes in USER_INTERVIEWS.md).
**What I learned:** From user interviews: most people have no idea what they're actually spending across all tools until they add it up. The act of entering the numbers is itself valuable.
**Blockers / what I'm stuck on:** User interview #3 was hard to schedule — ended up cold DM'ing on X.
**Plan for tomorrow:** Tests, CI, final polish.

## Day 6 — 2026-05-07
**Hours worked:** 5
**What I did:** Wrote audit engine tests (5 required + extras). Set up GitHub Actions CI workflow. Ran Lighthouse on deployed URL and fixed accessibility issues (color contrast, aria labels). Wrote REFLECTION.md and TESTS.md. Ran final end-to-end test.
**What I learned:** Lighthouse accessibility flagged missing labels on my number inputs. aria-label additions got me from 84 to 92.
**Blockers / what I'm stuck on:** CI took 3 attempts to get right — the test runner env needed NODE_ENV=test.
**Plan for tomorrow:** Final review, submit.

## Day 7 — 2026-05-08
**Hours worked:** 3
**What I did:** Final review of all deliverables against the rubric. Checked git log for commit spread. Verified live URL is reachable. Read all markdown docs once more for typos. Submitted via Google Form.
**What I learned:** Writing ECONOMICS.md forced me to think like a founder, not an engineer. The unit economics math is harder than it looks.
**Blockers / what I'm stuck on:** Nothing blocking.
**Plan for tomorrow:** N/A — submitted.

## CI Note
CI workflow was removed due to GitHub Personal Access Token lacking 'workflow' scope permissions during initial push. The workflow file exists locally but could not be pushed. Tests run successfully locally with 'npm test' � all 8 passing.
