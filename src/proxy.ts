import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────
// MAINTENANCE / HOLDING MODE
// While this file exists, every visitor sees /coming-soon.
// To RELAUNCH the live site: delete this file (src/proxy.ts),
// re-enable <SocialProof /> in layout.tsx, commit, and push.
// ─────────────────────────────────────────────────────────────

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Avoid an infinite rewrite loop on the holding page itself
  if (url.pathname === "/coming-soon") {
    return NextResponse.next();
  }

  url.pathname = "/coming-soon";
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on all page routes; skip API routes and static assets
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
