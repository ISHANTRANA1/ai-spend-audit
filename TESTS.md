# TESTS.md

All tests live in `__tests__/auditEngine.test.ts`. Run with:

```bash
npm test
```

## Test Coverage

| # | File | What it covers | Command |
|---|------|----------------|---------|
| 1 | `__tests__/auditEngine.test.ts` | Cursor Business + 2 seats → recommends Pro downgrade | `npm test` |
| 2 | `__tests__/auditEngine.test.ts` | Claude Team + 1 seat → recommends Pro (team requires min 2) | `npm test` |
| 3 | `__tests__/auditEngine.test.ts` | ChatGPT Team + 1 seat → recommends Plus downgrade | `npm test` |
| 4 | `__tests__/auditEngine.test.ts` | Cursor Pro + coding use case → optimal (no recommendation) | `npm test` |
| 5 | `__tests__/auditEngine.test.ts` | Anthropic API $300/mo → recommends credit purchase | `npm test` |
| 6 | `__tests__/auditEngine.test.ts` | Total savings = sum of individual tool savings + annual = 12× | `npm test` |
| 7 | `__tests__/auditEngine.test.ts` | Savings tier = "high" when monthly savings ≥ $500 | `npm test` |
| 8 | `__tests__/auditEngine.test.ts` | Empty tool list → zero savings, empty recommendations | `npm test` |

All 8 tests pass. Output:
```
PASS __tests__/auditEngine.test.ts
  ✓ Cursor Business with 2 seats recommends Pro downgrade
  ✓ Claude Team with 1 seat recommends Pro downgrade
  ✓ ChatGPT Team with 1 seat recommends Plus downgrade
  ✓ Cursor Pro with coding use case is optimal
  ✓ Anthropic API with $300/month spend recommends credits
  ✓ Total savings equals sum of individual tool savings
  ✓ Savings tier is high when monthly savings exceed $500
  ✓ No active tools returns zero savings

Tests: 8 passed, 8 total
```
