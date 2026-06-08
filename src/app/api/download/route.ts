import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { generateBookHtml } from "@/lib/book-html";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse("Missing token", { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return new NextResponse("Service unavailable", { status: 503 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  // Look up order by download token
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("session_id, tier, status")
    .eq("download_token", token)
    .single();

  if (orderError || !order) {
    return new NextResponse(notFoundPage(), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Fetch the book data
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("*")
    .eq("session_id", order.session_id)
    .single();

  if (bookError || !book) {
    return new NextResponse(notFoundPage(), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Fetch book slug from session
  const { data: session } = await supabase
    .from("sessions")
    .select("book_slug")
    .eq("id", order.session_id)
    .single();

  const bookSlug = session?.book_slug || "the-great-gatsby";

  // Fetch portrait if one exists for this session
  const { data: portrait } = await supabase
    .from("portraits")
    .select("image_url")
    .eq("session_id", order.session_id)
    .single();

  const html = generateBookHtml(book, bookSlug, portrait);

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}

function notFoundPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Chronicle Not Found — Chronicled</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400&family=EB+Garamond:ital,wght@1,400&display=swap" rel="stylesheet"/>
  <style>
    body { background:#0D1117; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; font-family:Georgia,serif; text-align:center; }
    h1 { font-family:'Cinzel',serif; font-size:14px; letter-spacing:6px; color:#BFA05A; text-transform:uppercase; margin-bottom:16px; }
    p { font-family:Georgia,serif; font-style:italic; font-size:16px; color:rgba(240,220,168,0.6); line-height:1.8; }
    a { color:#D4B86A; }
  </style>
</head>
<body>
  <div>
    <h1>Chronicle Not Found</h1>
    <p>This download link has expired or is invalid.<br/>
    Please <a href="https://getchronicled.art">return to Chronicled</a> or contact support.</p>
  </div>
</body>
</html>`;
}
