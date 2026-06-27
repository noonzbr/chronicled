import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unique Gift Ideas — Personalized Memoir Books | Chronicled",
  description:
    "The most meaningful gift for birthdays, anniversaries, memorials, Mother's Day, Father's Day, retirements, and holidays. We turn real memories into a beautifully written digital book styled like a classic novel. From $14.99.",
  keywords: [
    "unique birthday gift for mom",
    "unique birthday gift for dad",
    "meaningful anniversary gift",
    "personalized memoir book gift",
    "unique gift for grandma",
    "unique gift for grandpa",
    "memorial book for loved one",
    "tribute book gift",
    "legacy book for family",
    "Mother's Day gift ideas",
    "Father's Day gift ideas",
    "unique retirement gift",
    "meaningful graduation gift",
    "personalized Christmas gift",
    "custom life story book",
    "literary memoir gift",
    "personalized book gift for parents",
    "digital memoir book",
    "milestone birthday gift 50th 60th 70th",
    "unique anniversary gift for parents",
  ],
  openGraph: {
    title: "The Most Meaningful Gift — Personalized Memoir Books | Chronicled",
    description:
      "Turn real memories into a beautifully written digital book styled like Romeo & Juliet, The Great Gatsby, or Pride & Prejudice. Perfect for birthdays, anniversaries, memorials, and every milestone. From $14.99.",
    url: "https://getchronicled.art/gifts",
    siteName: "Chronicled",
    type: "website",
    images: [{ url: "/outro.png", width: 1200, height: 630, alt: "Chronicled — Personalized Memoir Books" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Most Meaningful Gift — Personalized Memoir Books",
    description: "Turn real memories into a beautifully written digital book. Perfect for every occasion. From $14.99.",
    images: ["/outro.png"],
  },
  alternates: {
    canonical: "https://getchronicled.art/gifts",
  },
};

export default function GiftsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
