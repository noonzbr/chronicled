import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || "chronicled2026";
    if (password === expectedPassword) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Incorrect authorization passcode." }, { status: 401 });
  } catch (err: any) {
    console.error("Error verifying passcode:", err);
    return NextResponse.json({ error: "An error occurred during verification." }, { status: 500 });
  }
}
