import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    const { bookSlug, sessionId, messages } = await req.json();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.log(`[Demo] Saving ${messages.length} messages for session ${sessionId}`);
      return NextResponse.json({ success: true, sessionId });
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    // Save all messages
    const rows = messages.map((m: { role: string; content: string }, i: number) => ({
      session_id: sessionId,
      role: m.role,
      content: m.content,
      position: i,
    }));

    await supabase.from("messages").delete().eq("session_id", sessionId);
    await supabase.from("messages").insert(rows);

    // Update session status
    await supabase
      .from("sessions")
      .update({ status: "generating", book_slug: bookSlug })
      .eq("id", sessionId);

    return NextResponse.json({ success: true, sessionId });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
