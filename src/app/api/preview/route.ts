import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session");

  if (!sessionId || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ book: null });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  return NextResponse.json({ book: data });
}
