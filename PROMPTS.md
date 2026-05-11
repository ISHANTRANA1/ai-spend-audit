# PROMPTS.md — LLM Prompts Used in SpendLens

## AI Summary Generation (`/api/summary`)

### Final Prompt (in production)

```
You are a pragmatic CFO advisor. Write a 100-word personalized summary (no bullets, no headers) for a {teamSize}-person team focused on {useCase} whose AI spend audit shows: current spend ${totalCurrentSpend}/month, potential savings ${totalMonthlySavings}/month. Be specific, honest, actionable. Don't mention Credex.
```

**Model:** `claude-haiku-4-5`  
**Max tokens:** 200  
**Why Haiku:** 100-word summaries don't need Sonnet-level reasoning. Haiku is ~10x cheaper and fast enough that the delay is imperceptible.

### Why I wrote it this way

- "CFO advisor" persona grounds the tone — pragmatic, not cheerleader
- Explicit "no bullets, no headers" prevents markdown leaking into UI
- "Don't mention Credex" keeps the tool trustworthy; credex promotion happens in the UI layer, not the AI output
- Injecting specific numbers forces the model to use the actual data rather than generating generic advice
- "Be honest" is necessary — without it, early versions manufactured savings praise even when savings were zero

### What I tried that didn't work

1. **Longer prompt with tool-by-tool detail** — The model would sometimes list the tools back instead of synthesizing. Stripping detail from the prompt and letting the model generalize produced better summaries.
2. **"Write like Paul Graham"** — Too opinionated and informal for a B2B finance tool. Removed.
3. **System prompt + user message split** — Didn't meaningfully improve output vs single user message for this task; added complexity.
4. **Asking for JSON output with a `summary` key** — Unnecessary for a single-field response; plain text is cleaner.
