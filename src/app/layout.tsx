import type { Metadata } from "next";
import { EB_Garamond, Cinzel, Cinzel_Decorative, Inter } from "next/font/google";
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getchronicled.art"),
  title: "Chronicled — Personalized Memoir Books | Unique Birthday & Anniversary Gifts",
  description:
    "Turn real memories into a beautifully written digital book styled like a classic novel. The most meaningful birthday gift, anniversary gift, or legacy keepsake. From $147. Get yours at getchronicled.art.",
  keywords: [
    "personalized memoir book",
    "unique birthday gift for mom",
    "unique birthday gift for dad",
    "meaningful anniversary gift",
    "personalized book gift",
    "custom life story book",
    "memorial tribute book",
    "legacy book gift",
    "literary memoir gift",
    "birthday gift for grandma",
    "birthday gift for grandpa",
    "retirement gift ideas",
    "personalized gift for parents",
    "digital memoir book",
    "custom novel about your life",
    "life story book gift",
    "meaningful gift for milestone birthday",
    "Bridgerton style memoir",
    "Great Gatsby personalized book",
  ],
  openGraph: {
    title: "Chronicled — Your Life, Told Like a Classic Novel",
    description:
      "We turn real memories into a beautifully written digital book — styled like Romeo & Juliet, The Great Gatsby, Pride & Prejudice. The perfect birthday, anniversary, or legacy gift. From $147.",
    url: "https://getchronicled.art",
    siteName: "Chronicled",
    type: "website",
    images: [{ url: "/outro.png", width: 1200, height: 630, alt: "Chronicled — Personalized Memoir Books" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chronicled — Your Life, Told Like a Classic Novel",
    description: "Turn real memories into a beautifully written digital book. The most meaningful gift. From $147.",
    images: ["/outro.png"],
  },
  alternates: {
    canonical: "https://getchronicled.art",
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
      className={`${ebGaramond.variable} ${cinzel.variable} ${cinzelDecorative.variable} ${inter.variable}`}
    >
      <body
        style={{
          fontFamily: "var(--font-garamond), Georgia, serif",
          backgroundColor: "var(--ink)",
          minHeight: "100vh",
        }}
      >
        {children}
        <SocialProof />
      </body>
    </html>
  );
}
