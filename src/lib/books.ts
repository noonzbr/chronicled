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
  {
    slug: "jane-eyre",
    title: "Jane Eyre",
    theme: "A Life on Her Own Terms",
    tone: "Fierce · Intimate · Triumphant",
    description:
      "For the woman who refused to settle. Your story told with moral courage, quiet strength, and the dignity of someone who always knew her own worth.",
    roman: "VII",
    color: "#6B4A5A",
    portraitStyle: "Victorian portrait painting, muted warm tones, candlelit atmospheric lighting, governess-era dress, thoughtful and resolute gaze",
    narrativeVoice:
      "Charlotte Brontë's voice — first-person and intimately confessional, yet with the clarity of someone who sees the world without illusion. There is fire beneath the stillness. Morally grounded but never preachy. Written with the voice of a woman who demanded to be treated as an equal long before the world agreed.",
    openingInstruction:
      "Open with quiet admiration and genuine warmth — a Jane Eyre story belongs to someone who built their life on their own terms, and you feel honored to write it. Be thoughtful and encouraging, with a steady undertone of conviction. Tell them that Jane Eyre is literature's great love letter to self-respect, and that their story is about to become one too. Ask their name and where this story begins.",
  },
  {
    slug: "little-women",
    title: "Little Women",
    theme: "Family, Dreams & the People Who Made You",
    tone: "Warm · Nostalgic · Life-Affirming",
    description:
      "For the family story — the sisters, the sacrifices, the love that shaped everything. Your story told with warmth, humor, and the full beauty of a life extraordinarily lived.",
    roman: "VIII",
    color: "#A07840",
    portraitStyle: "American Victorian illustration style, warm sepia and amber tones, soft natural light, domestic New England atmosphere, gentle group portraiture",
    narrativeVoice:
      "Louisa May Alcott's voice — warm, wise, gently humorous, and deeply human. The narrator loves the people in this story the way a family member does: seeing every flaw clearly and loving them anyway. The ordinary is elevated to the profound. Every small moment is treated as worthy of remembering.",
    openingInstruction:
      "Open with warmth and genuine tenderness — a Little Women story is the most human kind of all, because it's about the people who made you who you are. Be cozy, curious, and full of real care. Tell them that the most extraordinary stories are often the ones lived in ordinary rooms, and you believe this is one of them. Ask their name and who the most important people in their story are.",
  },
  {
    slug: "wuthering-heights",
    title: "Wuthering Heights",
    theme: "The Love That Never Let Go",
    tone: "Wild · Haunting · Unforgettable",
    description:
      "For the love that defied everything — time, circumstance, reason itself. Your story told with the raw intensity of a feeling that simply could not be contained.",
    roman: "IX",
    color: "#3A4550",
    portraitStyle: "Victorian Gothic portrait, stormy Yorkshire moors atmosphere, dark dramatic sky, windswept romantic style, deep chiaroscuro, brooding and elemental",
    narrativeVoice:
      "Emily Brontë's voice — raw, wild, elemental. Love here is not polite or reasonable. It is a force of nature, indifferent to social niceties. Written with Gothic atmosphere, psychological intensity, and the understanding that some feelings resist ordinary language. There is beauty in the darkness.",
    openingInstruction:
      "Open with quiet, respectful intensity — a Wuthering Heights story belongs to someone who knows what it means to carry something that can never be fully explained or fully released, and you recognize how rare that is. Be still, not dramatic — the story will supply its own storms. Ask their name and when they first understood that this love was unlike anything else they had known.",
  },
];

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}
