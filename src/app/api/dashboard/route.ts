import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Demo mode — return mock data
    return NextResponse.json({
      user: { id: "demo", name: "Natasha", email: "natasha@example.com" },
      orders: [
        {
          id: "demo-order-1",
          tier: "hardcover",
          amount_cents: 5900,
          status: "complete",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          download_token: "demo-token",
          session_id: "demo-session",
          book: {
            title: "The Chronicle of Natasha",
            word_count: 12847,
          },
          book_slug: "the-great-gatsby",
        },
        {
          id: "demo-order-2",
          tier: "digital",
          amount_cents: 1900,
          status: "processing",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          download_token: "demo-token-2",
          session_id: "demo-session-2",
          book: {
            title: "The Odyssey of James",
            word_count: 13420,
          },
          book_slug: "the-odyssey",
        },
      ],
    });
  }

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, email")
    .eq("id", userId)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch all orders with their associated book data
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      tier,
      amount_cents,
      status,
      created_at,
      download_token,
      session_id,
      tracking_number,
      sessions ( book_slug )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  // Enrich each order with book title + word count
  const enriched = await Promise.all(
    (orders || []).map(async (order) => {
      const { data: book } = await supabase
        .from("books")
        .select("title, word_count")
        .eq("session_id", order.session_id)
        .single();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = order.sessions as any;

      return {
        ...order,
        book_slug: session?.book_slug || "the-great-gatsby",
        book: book || null,
      };
    })
  );

  return NextResponse.json({ user: profile, orders: enriched });
}
