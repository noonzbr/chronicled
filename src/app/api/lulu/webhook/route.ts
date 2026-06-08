import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Lulu sends status updates to this endpoint.
// Configure in Lulu Dashboard → Webhooks → Add endpoint:
// https://getchronicled.art/api/lulu/webhook

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { event, print_job_id, status, tracking } = body;
  console.log("Lulu webhook:", { event, print_job_id, status });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ received: true });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  // Map Lulu status → our status
  const statusMap: Record<string, string> = {
    "CREATED":           "processing",
    "ACCEPTED":          "processing",
    "IN_PRODUCTION":     "processing",
    "SHIPPED":           "shipped",
    "COMPLETE":          "complete",
    "REJECTED":          "error",
    "CANCELED":          "error",
  };

  const ourStatus = statusMap[status] || "processing";
  const updates: Record<string, string> = { status: ourStatus };

  // Save tracking number if provided
  if (tracking?.number) {
    updates.tracking_number = tracking.number;
  }

  await supabase
    .from("orders")
    .update(updates)
    .eq("lulu_order_id", String(print_job_id));

  console.log(`Order updated: lulu_job=${print_job_id} → status=${ourStatus}`);
  return NextResponse.json({ received: true });
}
