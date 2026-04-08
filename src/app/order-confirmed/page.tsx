"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") || "digital";
  const isDemo = searchParams.get("demo") === "true";

  const messages = {
    digital:   { title: "Your Chronicle Is On Its Way", sub: "Check your inbox — your PDF will arrive within minutes.", icon: "✉" },
    softcover: { title: "Your Chronicle Is Being Prepared", sub: "Your book is being typeset and sent to print. Allow 7–14 business days for delivery.", icon: "📖" },
    hardcover: { title: "Your Chronicle & Portrait Are Being Prepared", sub: "Your hardcover and Royal Portrait are being crafted. Allow 7–14 business days.", icon: "✦" },
  };

  const msg = messages[tier as keyof typeof messages] || messages.digital;

  return (
    <main style={{ backgroundColor: "var(--ink)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ maxWidth: "520px" }}>
        <Link href="/" style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "20px", color: "var(--gold-light)", textDecoration: "none", display: "block", marginBottom: "60px" }}>
          Chronicled
        </Link>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ fontSize: "52px", marginBottom: "32px" }}
        >
          {msg.icon}
        </motion.div>

        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "6px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px" }}>
          {isDemo ? "Demo Complete" : "Order Confirmed"}
        </p>

        <h1 style={{ fontFamily: "var(--font-cinzel-deco)", fontSize: "clamp(22px, 4vw, 32px)", color: "var(--cream)", fontWeight: 400, marginBottom: "20px", lineHeight: 1.3 }}>
          {msg.title}
        </h1>

        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, var(--gold), transparent)", margin: "0 auto 24px", maxWidth: "200px" }} />

        <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "17px", color: "var(--parchment)", lineHeight: 1.8, opacity: 0.8, marginBottom: "48px" }}>
          {isDemo ? "This was a demo checkout. In production, payment would be processed and your chronicle delivered." : msg.sub}
        </p>

        <div style={{ border: "1px solid rgba(191,160,90,0.25)", padding: "28px 32px", backgroundColor: "rgba(191,160,90,0.04)", marginBottom: "40px" }}>
          <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "16px", color: "var(--parchment)", lineHeight: 1.8, opacity: 0.75 }}>
            "Your life. A legendary narrative."<br />
            <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "9px", letterSpacing: "3px", color: "var(--gold)", textTransform: "uppercase", fontStyle: "normal", opacity: 0.6 }}>
              — Chronicled
            </span>
          </p>
        </div>

        <Link
          href="/"
          style={{ fontFamily: "var(--font-cinzel)", fontSize: "10px", letterSpacing: "3px", color: "var(--gold)", border: "1px solid rgba(191,160,90,0.4)", padding: "14px 32px", textDecoration: "none", textTransform: "uppercase", display: "inline-block" }}
        >
          Back to Chronicled
        </Link>
      </motion.div>
    </main>
  );
}

export default function OrderConfirmedPage() {
  return <Suspense><OrderConfirmedContent /></Suspense>;
}
