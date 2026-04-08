import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, bookSlug } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // If no Supabase credentials yet, run in demo mode
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const sessionId = `demo_${Date.now()}`;
      return NextResponse.json({ success: true, sessionId, bookSlug });
    }

    const response = NextResponse.json({ success: true });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Signup failed." }, { status: 500 });
    }

    // Create profile
    await supabase.from("profiles").insert({ id: userId, name, email });

    // Create session
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .insert({ user_id: userId, book_slug: bookSlug, status: "interviewing" })
      .select("id")
      .single();

    if (sessionError) {
      return NextResponse.json({ error: "Failed to create session." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      sessionId: sessionData.id,
      bookSlug,
    });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Signup failed." }, { status: 500 });
  }
}
