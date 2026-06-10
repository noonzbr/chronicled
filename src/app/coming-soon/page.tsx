export const metadata = {
  title: "Chronicled — Arriving Soon",
  description: "Your life, written as a literary masterpiece. Arriving soon.",
};

export default function ComingSoonPage() {
  return (
    <main
      style={{
        backgroundColor: "var(--ink)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=900&fit=crop&auto=format&q=60')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: 0.14,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(13,17,23,0.4) 0%, rgba(13,17,23,0.97) 100%)",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "620px" }}>
        <p
          style={{
            fontFamily: "var(--font-cinzel-deco), serif",
            fontSize: "clamp(22px, 4vw, 30px)",
            letterSpacing: "8px",
            color: "var(--gold-light)",
            marginBottom: "48px",
          }}
        >
          CHRONICLED
        </p>

        <div
          style={{
            color: "var(--gold)",
            fontSize: "18px",
            letterSpacing: "14px",
            marginBottom: "28px",
          }}
        >
          ✦
        </div>

        <h1
          style={{
            fontFamily: "var(--font-cinzel-deco), serif",
            fontSize: "clamp(34px, 6vw, 56px)",
            color: "var(--cream)",
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: "28px",
          }}
        >
          Arriving Soon
        </h1>

        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent, var(--gold), transparent)",
            maxWidth: "220px",
            margin: "0 auto 32px",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-garamond), Georgia, serif",
            fontStyle: "italic",
            fontSize: "19px",
            color: "var(--parchment)",
            lineHeight: 1.9,
            opacity: 0.85,
            marginBottom: "44px",
          }}
        >
          Your life, written as a literary masterpiece.
          <br />
          We&rsquo;re putting the final touches on something
          <br />
          worthy of your story.
        </p>

        <p
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "10px",
            letterSpacing: "4px",
            color: "var(--gold)",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          getchronicled.art
        </p>
      </div>
    </main>
  );
}
