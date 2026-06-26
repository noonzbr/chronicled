import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, bookSlug } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // Demo mode when Supabase isn't configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const sessionId = `demo_${Date.now()}`;
      return NextResponse.json({ success: true, sessionId, bookSlug });
    }

    // Service-role client: trusted server-side writes (bypasses RLS).
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Create the auth user, auto-confirmed (no email round-trip needed).
    let userId: string | undefined;
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (createErr) {
      // Already registered → look the user up and continue with their session.
      if (/already|registered|exists/i.test(createErr.message)) {
        const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        userId = list?.users?.find(
          (u) => u.email?.toLowerCase() === email.toLowerCase()
        )?.id;
        if (!userId) {
          return NextResponse.json(
            { error: "An account with this email already exists. Please sign in." },
            { status: 400 }
          );
        }
      } else {
        console.error("createUser error:", createErr);
        return NextResponse.json({ error: createErr.message }, { status: 400 });
      }
    } else {
      userId = created.user?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Could not create account." }, { status: 500 });
    }

    // Upsert profile (idempotent across retries).
    const { error: profileError } = await admin
      .from("profiles")
      .upsert({ id: userId, name, email }, { onConflict: "id" });
    if (profileError) {
      console.error("Profile upsert error:", profileError);
    }

    // Create the session row for this book project.
    const { data: sessionData, error: sessionError } = await admin
      .from("sessions")
      .insert({ user_id: userId, book_slug: bookSlug, status: "interviewing" })
      .select("id")
      .single();

    if (sessionError) {
      console.error("Session insert error:", sessionError);
      return NextResponse.json({ error: "Failed to create session." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      sessionId: sessionData.id,
      userId,
      bookSlug,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Signup failed." }, { status: 500 });
  }
}
