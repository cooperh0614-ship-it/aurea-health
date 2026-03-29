import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function addToResend(
  full_name: string,
  email: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    throw new Error("Resend not configured");
  }

  const res = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_name: full_name,
        unsubscribed: false,
      }),
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Resend error: ${res.status}`);
  }
}

function saveToCSV(full_name: string, email: string): void {
  // /tmp is writable in serverless environments; fine for local dev too
  const filePath = path.join("/tmp", "aurea-waitlist.csv");
  const timestamp = new Date().toISOString();
  const row = `${timestamp},"${full_name.replace(/"/g, '""')}","${email.replace(/"/g, '""')}"\n`;

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "timestamp,full_name,email\n");
  }
  fs.appendFileSync(filePath, row);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("full_name" in body) ||
    !("email" in body)
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const { full_name, email } = body as { full_name: unknown; email: unknown };

  if (typeof full_name !== "string" || full_name.trim().length === 0) {
    return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  }

  if (typeof email !== "string" || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const cleanName  = full_name.trim().slice(0, 100);
  const cleanEmail = email.trim().toLowerCase().slice(0, 254);

  const resendConfigured =
    process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID;

  if (resendConfigured) {
    try {
      await addToResend(cleanName, cleanEmail);
    } catch (err) {
      console.error("[waitlist] Resend error:", err);
      return NextResponse.json(
        { error: "Failed to save your submission. Please try again." },
        { status: 500 }
      );
    }
  } else {
    // Fallback: write to CSV (local dev / when Resend isn't configured)
    try {
      saveToCSV(cleanName, cleanEmail);
      console.log(`[waitlist] Saved to CSV: ${cleanName} <${cleanEmail}>`);
    } catch (err) {
      console.error("[waitlist] CSV write error:", err);
      // Don't fail the request if CSV write fails — just log it
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
