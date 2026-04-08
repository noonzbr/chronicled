"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getBook } from "@/lib/books";

type Message = {
  role: "interviewer" | "user";
  content: string;
  id: string;
};

function InterviewRoom() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookSlug = searchParams.get("book") || "the-great-gatsby";
  const sessionId = searchParams.get("session") || "demo";
  const book = getBook(bookSlug);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [showFinishPrompt, setShowFinishPrompt] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const FINISH_THRESHOLD = 28;

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start the interview
  useEffect(() => {
    if (!started && book) {
      setStarted(true);
      startInterview();
    }
  }, [book]);

  async function startInterview() {
    setLoading(true);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookSlug,
          sessionId,
          messages: [],
          isStart: true,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages([{ role: "interviewer", content: data.message, id: "0" }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      id: Date.now().toString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setExchangeCount((c) => c + 1);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookSlug,
          sessionId,
          messages: newMessages,
          isStart: false,
        }),
      });
      const data = await res.json();

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { role: "interviewer", content: data.message, id: Date.now().toString() },
        ]);
      }

      // Show finish prompt after enough exchanges
      if (exchangeCount + 1 >= FINISH_THRESHOLD) {
        setShowFinishPrompt(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  async function finishInterview() {
    setFinishing(true);
    try {
      await fetch("/api/interview/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookSlug, sessionId, messages }),
      });
      router.push(`/generate?book=${bookSlug}&session=${sessionId}`);
    } catch (err) {
      console.error(err);
      setFinishing(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const bookColor = book?.color || "#9A7B2F";

  return (
    <main
      style={{
        backgroundColor: "var(--ink)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          borderBottom: "1px solid rgba(191,160,90,0.2)",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-cinzel-deco)",
            fontSize: "16px",
            color: "var(--gold-light)",
          }}
        >
          Chronicled
        </span>

        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "8px",
              letterSpacing: "4px",
              color: "var(--gold)",
              textTransform: "uppercase",
            }}
          >
            The Interview
          </p>
          {book && (
            <p
              style={{
                fontFamily: "var(--font-garamond)",
                fontStyle: "italic",
                fontSize: "13px",
                color: "var(--parchment)",
                opacity: 0.6,
              }}
            >
              {book.title}
            </p>
          )}
        </div>

        {/* Progress indicator */}
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "8px",
              letterSpacing: "2px",
              color: "var(--gold)",
              opacity: 0.5,
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            {Math.min(exchangeCount, FINISH_THRESHOLD)} / {FINISH_THRESHOLD} exchanges
          </p>
          <div
            style={{
              width: "120px",
              height: "2px",
              backgroundColor: "rgba(191,160,90,0.2)",
              borderRadius: "1px",
            }}
          >
            <div
              style={{
                width: `${Math.min((exchangeCount / FINISH_THRESHOLD) * 100, 100)}%`,
                height: "100%",
                backgroundColor: bookColor,
                borderRadius: "1px",
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Message area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "48px 40px",
          maxWidth: "820px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                marginBottom: "36px",
                display: "flex",
                flexDirection: "column",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {/* Role label */}
              <p
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "9px",
                  letterSpacing: "3px",
                  color: msg.role === "user" ? "var(--gold-light)" : bookColor,
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  opacity: 0.85,
                }}
              >
                {msg.role === "user" ? "You" : "Your Chronicler"}
              </p>

              {/* Bubble */}
              <div
                style={{
                  maxWidth: "84%",
                  padding: msg.role === "user" ? "16px 22px" : "24px 28px",
                  backgroundColor:
                    msg.role === "user"
                      ? "rgba(191,160,90,0.14)"
                      : "var(--ink-card)",
                  border:
                    msg.role === "user"
                      ? "1px solid rgba(191,160,90,0.35)"
                      : `1px solid ${bookColor}55`,
                  borderRadius: "0",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-garamond)",
                    fontStyle: "normal",
                    fontSize: "18px",
                    color: msg.role === "user" ? "rgba(255,255,255,0.75)" : "#ffffff",
                    lineHeight: 2.0,
                    whiteSpace: "pre-wrap",
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                  }}
                >
                  {msg.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ marginBottom: "24px" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "8px",
                  letterSpacing: "3px",
                  color: bookColor,
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  opacity: 0.7,
                }}
              >
                Your Chronicler
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  padding: "16px 20px",
                  border: `1px solid ${bookColor}33`,
                  backgroundColor: "var(--ink-card)",
                  width: "fit-content",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: bookColor,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Finish prompt */}
        <AnimatePresence>
          {showFinishPrompt && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                border: `1px solid ${bookColor}`,
                padding: "28px 32px",
                backgroundColor: `${bookColor}11`,
                marginBottom: "32px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "9px",
                  letterSpacing: "4px",
                  color: "var(--gold)",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Your Story Is Ready
              </p>
              <p
                style={{
                  fontFamily: "var(--font-garamond)",
                  fontStyle: "italic",
                  fontSize: "16px",
                  color: "var(--cream)",
                  lineHeight: 1.75,
                  marginBottom: "24px",
                }}
              >
                You have given us everything we need to write your chronicle.
                <br />
                Continue if you wish, or begin the writing now.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button
                  onClick={() => setShowFinishPrompt(false)}
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "9px",
                    letterSpacing: "3px",
                    color: "var(--gold)",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(191,160,90,0.4)",
                    padding: "12px 24px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  Continue Talking
                </button>
                <button
                  onClick={finishInterview}
                  disabled={finishing}
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    fontSize: "9px",
                    letterSpacing: "3px",
                    color: "var(--ink)",
                    backgroundColor: finishing ? "rgba(191,160,90,0.5)" : "var(--gold-light)",
                    border: "none",
                    padding: "12px 28px",
                    cursor: finishing ? "not-allowed" : "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  {finishing ? "Preparing..." : "Write My Book →"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          borderTop: "1px solid rgba(191,160,90,0.2)",
          padding: "20px 32px",
          maxWidth: "780px",
          width: "100%",
          margin: "0 auto",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Answer freely. The more you share, the richer your book..."
            disabled={loading || finishing}
            rows={3}
            style={{
              flex: 1,
              backgroundColor: "var(--ink-card)",
              border: "1px solid rgba(191,160,90,0.35)",
              padding: "16px 20px",
              fontFamily: "var(--font-garamond)",
              fontStyle: "normal",
              fontSize: "18px",
              color: "#ffffff",
              outline: "none",
              resize: "none",
              lineHeight: 1.75,
              letterSpacing: "0.01em",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || finishing}
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "9px",
              letterSpacing: "2px",
              color: "var(--ink)",
              backgroundColor:
                loading || !input.trim() || finishing
                  ? "rgba(191,160,90,0.35)"
                  : "var(--gold-light)",
              border: "none",
              padding: "14px 22px",
              cursor:
                loading || !input.trim() || finishing ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              transition: "background-color 0.2s",
              flexShrink: 0,
              height: "54px",
            }}
          >
            Send
          </button>
        </div>
        <p
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "8px",
            letterSpacing: "2px",
            color: "var(--gold)",
            opacity: 0.35,
            textTransform: "uppercase",
            marginTop: "8px",
          }}
        >
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </main>
  );
}

export default function InterviewPage() {
  return (
    <Suspense>
      <InterviewRoom />
    </Suspense>
  );
}
