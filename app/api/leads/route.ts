import { NextRequest, NextResponse } from "next/server";

const leads: unknown[] = [];
const ipHits = new Map<string, number>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const hits = (ipHits.get(ip) ?? 0) + 1;
  ipHits.set(ip, hits);
  if (hits > 5) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const body = await req.json();

  // Honeypot: if 'website' field is filled, it's a bot
  if (body.website) return NextResponse.json({ ok: true }); // silent discard

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  leads.push({ ...body, ip, createdAt: new Date().toISOString() });
  console.log("Lead captured:", body.email);

  // Transactional email would fire here via Resend/Postmark
  // await sendConfirmationEmail(body.email, body.auditId);

  return NextResponse.json({ ok: true });
}
