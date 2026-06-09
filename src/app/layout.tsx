import type { Metadata } from "next";
import { EB_Garamond, Cinzel, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import SocialProof from "@/components/SocialProof";

const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-deco",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chronicled — Your Life. A Legendary Narrative.",
  description:
    "Choose a classic book. Answer our questions. Receive a beautifully crafted literary chronicle of your life — part memoir, part masterpiece.",
  keywords: ["personalized book", "life story", "memoir", "literary gift", "custom book"],
  openGraph: {
    title: "Chronicled",
    description: "Your life. A legendary narrative.",
    url: "https://getchronicled.art",
    siteName: "Chronicled",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${cinzel.variable} ${cinzelDecorative.variable}`}
    >
      <body
        style={{
          fontFamily: "var(--font-garamond), Georgia, serif",
          backgroundColor: "var(--ink)",
          minHeight: "100vh",
        }}
      >
        {/* Intro Launch Banner */}
        <div style={{
          backgroundColor: "var(--gold)",
          padding: "10px 20px",
          textAlign: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}>
          <p style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "11px",
            letterSpacing: "3px",
            color: "var(--ink)",
            textTransform: "uppercase",
            margin: 0,
          }}>
            ✦ &nbsp; Founding Member Rate — $14.99 &nbsp;·&nbsp; First 100 Chronicles Only &nbsp;·&nbsp; Price Rises Soon &nbsp; ✦
          </p>
        </div>
        {children}
        <SocialProof />
      </body>
    </html>
  );
}
