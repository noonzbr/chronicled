import type { Metadata } from "next";
import { EB_Garamond, Cinzel, Cinzel_Decorative } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
