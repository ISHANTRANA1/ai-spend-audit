import { runAudit, TOOL_CATALOG } from "../lib/auditEngine";

// Test 1: Cursor Business with small team should recommend Pro downgrade
test("Cursor Business with 2 seats recommends Pro downgrade", () => {
  const result = runAudit({
    tools: [{ toolId: "cursor", plan: "business", monthlySpend: 80, seats: 2 }],
    teamSize: 2,
    useCase: "coding",
  });
  const rec = result.recommendations[0];
  expect(rec.recommendedAction).toBe("downgrade");
  expect(rec.recommendedPlan).toBe("pro");
  expect(rec.monthlySavings).toBeGreaterThan(0);
});

// Test 2: Claude Team with 1 seat should recommend Pro (team requires min 2)
test("Claude Team with 1 seat recommends Pro downgrade", () => {
  const result = runAudit({
    tools: [{ toolId: "claude", plan: "team", monthlySpend: 30, seats: 1 }],
    teamSize: 1,
    useCase: "writing",
  });
  const rec = result.recommendations[0];
  expect(rec.recommendedAction).toBe("downgrade");
  expect(rec.recommendedPlan).toBe("pro");
});

// Test 3: ChatGPT Team with 1 seat should recommend Plus
test("ChatGPT Team with 1 seat recommends Plus downgrade", () => {
  const result = runAudit({
    tools: [{ toolId: "chatgpt", plan: "team", monthlySpend: 30, seats: 1 }],
    teamSize: 1,
    useCase: "mixed",
  });
  const rec = result.recommendations[0];
  expect(rec.recommendedAction).toBe("downgrade");
  expect(rec.monthlySavings).toBeGreaterThan(0);
});

// Test 4: Well-matched plan produces optimal recommendation
test("Cursor Pro with coding use case is optimal", () => {
  const result = runAudit({
    tools: [{ toolId: "cursor", plan: "pro", monthlySpend: 20, seats: 1 }],
    teamSize: 1,
    useCase: "coding",
  });
  const rec = result.recommendations[0];
  expect(rec.recommendedAction).toBe("optimal");
  expect(rec.monthlySavings).toBe(0);
});

// Test 5: API user with high spend should recommend credits
test("Anthropic API with $300/month spend recommends credits", () => {
  const result = runAudit({
    tools: [{ toolId: "anthropic_api", plan: "payg", monthlySpend: 300, seats: 1 }],
    teamSize: 5,
    useCase: "mixed",
  });
  const rec = result.recommendations[0];
  expect(rec.recommendedAction).toBe("credits");
  expect(rec.monthlySavings).toBeGreaterThan(0);
});

// Test 6: Total savings calculation is correct
test("Total savings equals sum of individual tool savings", () => {
  const result = runAudit({
    tools: [
      { toolId: "cursor", plan: "business", monthlySpend: 80, seats: 2 },
      { toolId: "claude", plan: "team", monthlySpend: 30, seats: 1 },
    ],
    teamSize: 2,
    useCase: "coding",
  });
  const summedSavings = result.recommendations.reduce((s, r) => s + r.monthlySavings, 0);
  expect(result.totalMonthlySavings).toBe(summedSavings);
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
});

// Test 7: Savings tier is "high" when savings > $500
test("Savings tier is high when monthly savings exceed $500", () => {
  const result = runAudit({
    tools: [
      { toolId: "cursor", plan: "enterprise", monthlySpend: 1200, seats: 20 },
    ],
    teamSize: 20,
    useCase: "coding",
  });
  if (result.totalMonthlySavings >= 500) {
    expect(result.savingsTier).toBe("high");
  }
});

// Test 8: Empty active tools returns zero savings
test("No active tools returns zero savings", () => {
  const result = runAudit({
    tools: [],
    teamSize: 5,
    useCase: "mixed",
  });
  expect(result.totalMonthlySavings).toBe(0);
  expect(result.recommendations).toHaveLength(0);
});
