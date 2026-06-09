"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Prompt {
  id: number;
  hook: string;
  body: string;
  takeaway: string;
}

export default function AdminPromptsPage() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");
  
  const [category, setCategory] = useState("Childhood");
  const [tone, setTone] = useState("Reflective");
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copyType, setCopyType] = useState<string | null>(null);

  const categories = ["Childhood", "Travel & Adventure", "Love & Relationships", "Lessons & Wisdom", "Career & Ambition"];
  const tones = ["Honest & Reflective", "Epic & Heroic", "Romantic & Bittersweet", "Witty & Warm"];

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "chronicled2026") {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Incorrect authorization passcode.");
    }
  };

  const generatePrompts = async () => {
    setLoading(true);
    setPrompts([]);
    try {
      const response = await fetch("/api/admin/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, tone, password: "chronicled2026" }),
      });
      const data = await response.json();
      if (data.success) {
        setPrompts(data.prompts);
      } else {
        alert(data.error || "Failed to generate prompts.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while calling the API.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (prompt: Prompt, type: "tiktok" | "x") => {
    let text = "";
    if (type === "tiktok") {
      text = `${prompt.hook}\n\n${prompt.body}\n\n${prompt.takeaway}`;
    } else {
      text = `"${prompt.hook}"\n\n${prompt.body}\n\n${prompt.takeaway}`;
    }
    
    navigator.clipboard.writeText(text);
    setCopiedId(prompt.id);
    setCopyType(type);
    setTimeout(() => {
      setCopiedId(null);
      setCopyType(null);
    }, 2000);
  };

  return (
    <main
      style={{
        backgroundColor: "var(--ink)",
        minHeight: "100vh",
        color: "var(--cream)",
        padding: "60px 20px",
        fontFamily: "var(--font-garamond), Georgia, serif",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1
            style={{
              fontFamily: "var(--font-cinzel), serif",
              color: "var(--gold)",
              fontSize: "2.5rem",
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            CHRONICLED
          </h1>
          <p style={{ color: "var(--parchment)", fontSize: "1.1rem", fontStyle: "italic" }}>
            Narrative Marketing Engine — TikTok & X Content Studio
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* Auth Box */
            <motion.div
              key="auth-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                backgroundColor: "var(--ink-card)",
                border: "1px solid rgba(191, 160, 90, 0.25)",
                padding: "40px",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-cinzel), serif",
                  color: "var(--cream)",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                }}
              >
                Access Control
              </h2>
              <form onSubmit={handleUnlock}>
                <input
                  type="password"
                  placeholder="Enter passcode (chronicled2026)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    border: "1px solid var(--gold)",
                    borderRadius: "4px",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "1.1rem",
                    marginBottom: "15px",
                    outline: "none",
                  }}
                />
                {error && <p style={{ color: "#E05A47", marginBottom: "15px" }}>{error}</p>}
                <button
                  type="submit"
                  style={{
                    backgroundColor: "var(--gold)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-cinzel), serif",
                    fontWeight: "bold",
                    padding: "12px 30px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--gold-light)")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--gold)")}
                >
                  Authenticate
                </button>
              </form>
            </motion.div>
          ) : (
            /* Main Dashboard */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: "flex", flexDirection: "column", gap: "40px" }}
            >
              
              {/* Controls Box */}
              <div
                style={{
                  backgroundColor: "var(--ink-card)",
                  border: "1px solid rgba(191, 160, 90, 0.2)",
                  padding: "30px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-cinzel), serif",
                    color: "var(--gold)",
                    fontSize: "1.2rem",
                    marginBottom: "20px",
                  }}
                >
                  Configure Prompt Parameters
                </h3>
                
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "25px" }}>
                  {/* Category select */}
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ display: "block", color: "var(--parchment)", marginBottom: "8px" }}>Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        border: "1px solid rgba(191,160,90,0.4)",
                        borderRadius: "4px",
                        color: "var(--cream)",
                        outline: "none",
                      }}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} style={{ backgroundColor: "var(--ink)" }}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tone select */}
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ display: "block", color: "var(--parchment)", marginBottom: "8px" }}>Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        border: "1px solid rgba(191,160,90,0.4)",
                        borderRadius: "4px",
                        color: "var(--cream)",
                        outline: "none",
                      }}
                    >
                      {tones.map((t) => (
                        <option key={t} value={t} style={{ backgroundColor: "var(--ink)" }}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={generatePrompts}
                  disabled={loading}
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    color: "var(--gold)",
                    border: "1px solid var(--gold)",
                    padding: "14px",
                    fontFamily: "var(--font-cinzel), serif",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    borderRadius: "4px",
                    cursor: loading ? "not-allowed" : "pointer",
                    letterSpacing: "1px",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = "var(--gold-faint)";
                      e.currentTarget.style.color = "var(--gold-light)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--gold)";
                    }
                  }}
                >
                  {loading ? "Drafting Narrative Concepts..." : "Generate 5 Writing Prompts"}
                </button>
              </div>

              {/* Prompt Output list */}
              {prompts.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-cinzel), serif",
                      color: "var(--gold)",
                      fontSize: "1.3rem",
                      borderBottom: "1px solid rgba(191, 160, 90, 0.2)",
                      paddingBottom: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    Drafted Prompts
                  </h3>

                  {prompts.map((prompt) => (
                    <motion.div
                      key={prompt.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        backgroundColor: "var(--ink-card)",
                        border: "1px solid rgba(191, 160, 90, 0.2)",
                        borderRadius: "8px",
                        padding: "25px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                        position: "relative",
                      }}
                    >
                      {/* Hook */}
                      <p
                        style={{
                          fontSize: "1.3rem",
                          color: "var(--gold-light)",
                          lineHeight: "1.4",
                          marginBottom: "15px",
                          fontWeight: "500",
                        }}
                      >
                        "{prompt.hook}"
                      </p>

                      {/* Body */}
                      <p
                        style={{
                          color: "var(--cream)",
                          lineHeight: "1.6",
                          fontSize: "1.1rem",
                          marginBottom: "15px",
                          opacity: 0.9,
                        }}
                      >
                        {prompt.body}
                      </p>

                      {/* Takeaway */}
                      <p
                        style={{
                          color: "var(--parchment)",
                          fontStyle: "italic",
                          lineHeight: "1.6",
                          fontSize: "1.05rem",
                          marginBottom: "25px",
                          borderLeft: "2px solid var(--gold)",
                          paddingLeft: "15px",
                        }}
                      >
                        {prompt.takeaway}
                      </p>

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                        <button
                          onClick={() => handleCopy(prompt, "tiktok")}
                          style={{
                            backgroundColor: "rgba(191, 160, 90, 0.1)",
                            border: "1px solid var(--gold)",
                            color: "var(--gold)",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(191, 160, 90, 0.2)")}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(191, 160, 90, 0.1)")}
                        >
                          {copiedId === prompt.id && copyType === "tiktok" ? "✓ Copied!" : "📋 Copy for TikTok"}
                        </button>
                        <button
                          onClick={() => handleCopy(prompt, "x")}
                          style={{
                            backgroundColor: "transparent",
                            border: "1px solid rgba(240, 220, 168, 0.4)",
                            color: "var(--cream)",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--cream)")}
                          onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(240, 220, 168, 0.4)")}
                        >
                          {copiedId === prompt.id && copyType === "x" ? "✓ Copied!" : "📋 Copy for X/Twitter"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
