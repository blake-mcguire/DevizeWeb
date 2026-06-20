import type { NextRequest } from "next/server";

type LeadPayload = {
  name?: string;
  company?: string;
  email?: string;
  trade?: string;
  callVolume?: string;
  message?: string;
};

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

  // TODO: wire up lead destination (Resend email, HubSpot, Attio, Google Sheets, etc.)
  // For now, log server-side so the form flow is exercised end-to-end.
  console.log("[lead]", {
    receivedAt: new Date().toISOString(),
    ...body,
  });

  return Response.json({ ok: true });
}
