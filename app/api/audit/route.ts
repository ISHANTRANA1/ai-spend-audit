import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

// In-memory store (use DB in production - see ARCHITECTURE.md)
export const auditStore = new Map<string, { formData: unknown; result: unknown; createdAt: string }>();

export async function POST(req: NextRequest) {
  // Rate limit check via IP header
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  
  // Honeypot check happens client-side in lead form
  const body = await req.json();
  const { formData, result } = body;
  
  if (!formData || !result) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const id = nanoid(10);
  auditStore.set(id, { formData, result, createdAt: new Date().toISOString() });

  // Auto-cleanup after 7 days
  setTimeout(() => auditStore.delete(id), 7 * 24 * 60 * 60 * 1000);

  return NextResponse.json({ id });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });
  const audit = auditStore.get(id);
  if (!audit) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(audit);
}
