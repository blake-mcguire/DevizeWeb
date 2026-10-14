import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { isoCompact, putJSON } from "@/lib/blob-store";

type LeadPayload = {
  name?: string;
  company?: string;
  email?: string;
  trade?: string;
  callVolume?: string;
  message?: string;
};

const FIELDS = ["name", "company", "email", "trade", "callVolume", "message"] as const;

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, company, email } = body;
  if (!name || !company || !email) {
    return Response.json(
      { error: "Name, company, and email are required." },
      { status: 400 }
    );
  }
  if (!validEmail(email)) {
    return Response.json({ error: "Please provide a valid email." }, { status: 400 });
  }

  // Only the form's own fields, each a trimmed string of sane length.
  const lead: Record<string, string> = {};
  for (const f of FIELDS) {
    const v = body[f];
    if (typeof v === "string" && v.trim()) lead[f] = v.trim().slice(0, 2000);
  }

  const now = new Date();
  const record = {
    v: 1,
    ...lead,
    received_at: now.toISOString(),
    user_agent: (request.headers.get("user-agent") ?? "").slice(0, 400),
  };

  // leads/<iso>-<random>.json. The store is public and the timestamp alone is
  // guessable to the second, so the random part keeps a lead's details from
  // being found by counting through timestamps.
  const pathname = `leads/${isoCompact(now)}-${randomBytes(8).toString("hex")}.json`;
  try {
    await putJSON(pathname, record);
    console.log("[lead] stored", pathname);
  } catch (err) {
    // No Blob store connected yet (or it is down): keep the old behaviour, the
    // lead in the server log, so nothing is lost while storage is being set up.
    console.error("[lead] store failed", err instanceof Error ? err.message : err);
    console.log("[lead]", record);
  }

  return Response.json({ ok: true });
}
