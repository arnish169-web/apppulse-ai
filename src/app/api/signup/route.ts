import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

export const runtime = "nodejs";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await turso.execute({
      sql: "INSERT INTO signups (email, created_at) VALUES (?, datetime('now'))",
      args: [email],
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Signup error:", error);
    
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    
    return NextResponse.json({ error: "Failed to signup" }, { status: 500 });
  }
}
