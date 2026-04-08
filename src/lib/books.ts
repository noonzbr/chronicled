export type Book = {
  slug: string;
  title: string;
  theme: string;
  tone: string;
  description: string;
  roman: string;
  color: string;
  portraitStyle: string;
  narrativeVoice: string;
  openingInstruction: string;
};

export const BOOKS: Book[] = [
  {
    slug: "romeo-and-juliet",
    title: "Romeo & Juliet",
    theme: "Tragic Love",
    tone: "Fateful · Romantic · Bittersweet",
    description:
      "For the love that burned too bright. Your story told with the weight of fate, the beauty of sacrifice, and the ache of what could not be changed.",
    roman: "I",
    color: "#7B2D3E",
    portraitStyle: "Renaissance oil painting, rich jewel tones, dark dramatic background, period clothing from 16th century Verona",
    narrativeVoice:
      "Shakespearean in spirit — lyrical, fateful, romantic. Written in elegant prose that echoes the drama and poetry of Romeo & Juliet. Every moment carries the weight of destiny. Light satire balances the tragedy.",
    openingInstruction:
      "Open with genuine excitement — a Romeo & Juliet story is the most dramatic kind there is, and you are thrilled. Be warm, slightly theatrical, and immediately personal. Tell them you can feel this is going to be extraordinary. Then ask their name and where this story happened.",
  },
  {
    slug: "pride-and-prejudice",
    title: "Pride & Prejudice",
    theme: "Love That Endured",
    tone: "Witty · Warm · Triumphant",
    description:
      "For the love that almost wasn't. Your story told with sharp wit, gentle irony, and the deep satisfaction of a heart that chose well.",
    roman: "II",
    color: "#3E6B5C",
    portraitStyle: "Regency-era watercolor portrait, soft pastel tones, period dress circa 1813 England, gentle countryside light",
    narrativeVoice:
      "Jane Austen's voice — witty, observational, warm. Narrated with irony and intelligence. Social dynamics are noticed and gently skewered. Love is earned through character, not circumstance.",
    openingInstruction:
      "Open with wit and warmth — a Pride & Prejudice story means someone fought their way to love through every possible social obstacle, and you find that delicious. Be charming and a little playful. Ask their name and where this comedy of manners unfolded.",
  },
  {
    slug: "the-great-gatsby",
    title: "The Great Gatsby",
    theme: "Ambition & Reinvention",
    tone: "Glamorous · Cautionary · Sharp",
    description:
      "For the dreamer who reached across the water. Your story told with the shimmer of possibility and the weight of everything you built.",
    roman: "III",
    color: "#9A7B2F",
    portraitStyle: "Art Deco illustration, gold and emerald tones, 1920s glamour, geometric ornamental border",
    narrativeVoice:
      "F. Scott Fitzgerald's voice — lush, poetic, observational. A narrator witnesses someone extraordinary. Ambition and beauty and cost. The green light. Written with the shimmer of the Jazz Age and the weight of what dreams demand.",
    openingInstruction:
      "Open with energy and admiration — a Gatsby story means someone reached for something extraordinary, and you are already captivated. Be vivid and enthusiastic. Tell them the green light is the most powerful image in American literature and you think their story is going to live up to it. Ask their name and what city this story belongs to.",
  },
  {
    slug: "the-odyssey",
    title: "The Odyssey",
    theme: "A Life of Adventure",
    tone: "Epic · Wandering · Hard-Won",
    description:
      "For the one who went out into the world and didn't come back the same. Your story told as the journey it truly was.",
    roman: "IV",
    color: "#4A6B8A",
    portraitStyle: "Ancient Greek mosaic or fresco, Mediterranean blues and terracottas, classical composition, epic heroic style",
    narrativeVoice:
      "Homeric in spirit — epic, heroic, but grounded in the deeply human. The journey is the story. Gods may meddle, seas may rage, but the hero presses on. Written with gravitas and occasional moments of wry humanity.",
    openingInstruction:
      "Open with awe — an Odyssey story is a life of movement, transformation, and hard-won wisdom, and you are genuinely honored to be the one writing it. Be warm, epic in spirit but conversational in tone. Ask their name and where the journey started.",
  },
  {
    slug: "a-christmas-carol",
    title: "A Christmas Carol",
    theme: "Redemption",
    tone: "Honest · Wry · Hopeful",
    description:
      "For the one who changed. Your story told with honesty about who you were, and generosity about who you became.",
    roman: "V",
    color: "#5C4A7A",
    portraitStyle: "Victorian etching or engraving style, warm candlelight tones, Dickensian atmosphere, detailed cross-hatching",
    narrativeVoice:
      "Dickensian — warm, moralistic in the best sense, humane. A story of transformation. The narrator witnesses someone who changed, and tells that story with both honesty and compassion. Comic where appropriate, moving where necessary.",
    openingInstruction:
      "Open with genuine warmth and a touch of theatre — a Christmas Carol story is one of real change, and those are the most hopeful stories in the world. Tell them that. Be cozy, human, encouraging. Ask their name and when this story starts.",
  },
  {
    slug: "the-count-of-monte-cristo",
    title: "The Count of Monte Cristo",
    theme: "Betrayal & Triumph",
    tone: "Bold · Dramatic · Satisfying",
    description:
      "For the one who was wronged and rose anyway. Your story told with the full drama it deserves and the ending it earned.",
    roman: "VI",
    color: "#7A4A2A",
    portraitStyle: "19th century French portrait painting, rich burgundies and golds, aristocratic bearing, dramatic chiaroscuro lighting",
    narrativeVoice:
      "Alexandre Dumas — bold, dramatic, sweeping. A story of betrayal, endurance, and ultimate triumph. Every villain gets their reckoning. Every sacrifice is acknowledged. Written with the grand theatrical confidence of the greatest adventure storyteller in history.",
    openingInstruction:
      "Open with bold excitement and dramatic flair — a Monte Cristo story means someone was wronged, endured, and rose. That is one of the most satisfying arcs in all of literature and you are absolutely here for it. Be theatrical but real. Ask their name and the world where their drama played out.",
  },
];

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}
