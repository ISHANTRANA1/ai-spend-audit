import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function fallbackSummary(result: any, useCase: string, teamSize: number): string {
  const { totalMonthlySavings, totalCurrentSpend, recommendations } = result;
  const topRec = recommendations.find((r: any) => r.monthlySavings > 0);
  if (totalMonthlySavings === 0) {
    return `Your ${teamSize}-person team's AI stack is well-optimized for ${useCase} work. You're spending $${totalCurrentSpend}/month across your tools, and our analysis found no significant over-provisioning or cheaper alternatives that fit your workflow. Keep an eye on this as your team scales — plan economics shift at higher seat counts.`;
  }
  return `Your ${teamSize}-person team is spending $${totalCurrentSpend}/month on AI tools, but our audit found $${totalMonthlySavings}/month in potential savings. ${topRec ? topRec.reason : ""} That's $${totalMonthlySavings * 12}/year in recoverable spend — real money based on current vendor pricing and your actual usage pattern.`;
}

export async function POST(req: NextRequest) {
  const { result, useCase, teamSize } = await req.json();
  const prompt = `You are a pragmatic CFO advisor. Write a 100-word personalized summary (no bullets, no headers) for a ${teamSize}-person team focused on ${useCase} whose AI spend audit shows: current spend $${result.totalCurrentSpend}/month, potential savings $${result.totalMonthlySavings}/month. Be specific, honest, actionable. Don't mention Credex.`;
  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });
    const text = response.content[0].type === "text" ? response.content[0].text : fallbackSummary(result, useCase, teamSize);
    return NextResponse.json({ summary: text });
  } catch {
    return NextResponse.json({ summary: fallbackSummary(result, useCase, teamSize) });
  }
}
