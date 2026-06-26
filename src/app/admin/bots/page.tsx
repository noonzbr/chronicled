"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type LogEntry = {
  timestamp: string;
  bot: string;
  level: "info" | "warn" | "error";
  message: string;
};

type BotConfig = {
  id: string;
  name: string;
  description: string;
  triggerLabel: string;
  badge: string;
};

const BOTS: BotConfig[] = [
  {
    id: "trend_creator",
    name: "Viral Trend Video Creator",
    description: "Monitors Google Trends and Hacker News, drafts script beats using Claude 3.5, and renders vertical webm videos via Puppeteer.",
    triggerLabel: "Trigger Video Generator 🎬",
    badge: "AI Render Engine",
  },
  {
    id: "article_generator",
    name: "Substack & Reddit Article Promoter",
    description: "Parses stories.json and translates brief video captions into full-length, narrative-driven markdown posts with CTA links.",
    triggerLabel: "Trigger Article Generator ✍️",
    badge: "Prose Writer",
  },
  {
    id: "publisher",
    name: "Multi-Platform Publisher",
    description: "Automates uploading newly rendered videos to your TikTok drafts folder and tweets them out directly to X/Twitter.",
    triggerLabel: "Trigger Social Uploads 🚀",
    badge: "API Distributor",
  },
  {
    id: "comment_bot",
    name: "Comment-to-DM Sales Bot",
    description: "Monitors TikTok video comments for target trigger keyword 'CHRONICLED' and automatically DMs checkout link to leads.",
    triggerLabel: "Scan & DM Leads 💬",
    badge: "DM Sales Funnel",
  },
];

export default function AdminBotsDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [runningBots, setRunningBots] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<string | null>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Load and poll logs every 3 seconds
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scroll console to bottom on new log additions
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  async function fetchLogs() {
    try {
      const res = await fetch("/api/admin/bots/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  }

  async function triggerBot(botId: string, botName: string) {
    if (runningBots[botId]) return;

    setRunningBots((prev) => ({ ...prev, [botId]: true }));
    showNotification(`Triggering ${botName}...`);

    try {
      const res = await fetch("/api/admin/bots/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId }),
      });

      const data = await res.json();

      if (res.ok) {
        showNotification(`✅ Successfully launched ${botName} in background!`);
        fetchLogs();
      } else {
        showNotification(`❌ Error: ${data.error || "Failed to trigger bot"}`);
      }
    } catch (err) {
      showNotification("❌ Network error connecting to API");
    } finally {
      // Keep loading indicator active briefly to show progress
      setTimeout(() => {
        setRunningBots((prev) => ({ ...prev, [botId]: false }));
      }, 2000);
    }
  }

  function showNotification(msg: string) {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  }

  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour12: false }) + `.${String(d.getMilliseconds()).padStart(3, "0")}`;
  }

  return (
    <main
      style={{
        backgroundColor: "#0D1117",
        minHeight: "100vh",
        color: "#E8D49A",
        padding: "40px 24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Navigation & Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(191,160,90,0.2)",
            paddingBottom: "24px",
            marginBottom: "40px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#F0DCA8", letterSpacing: "1px", fontFamily: "serif" }}>
              Chronicled Automation Control
            </h1>
            <p style={{ color: "#BFA05A", fontSize: "14px", marginTop: "4px" }}>
              Admin dashboard for n8n orchestrations & local background services.
            </p>
          </div>
          <Link
            href="/admin/generator"
            style={{
              border: "1px solid #BFA05A",
              color: "#BFA05A",
              padding: "8px 16px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "rgba(191,160,90,0.1)";
            }}
            onMouseOut={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            ← Canvas Generator
          </Link>
        </header>

        {/* Global Notifications */}
        {notification && (
          <div
            style={{
              position: "fixed",
              top: "24px",
              right: "24px",
              backgroundColor: "#141B24",
              border: "1px solid #D4B86A",
              borderRadius: "8px",
              padding: "16px 24px",
              color: "#F0DCA8",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              zIndex: 1000,
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {notification}
          </div>
        )}

        {/* Bot Cards Grid */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          {BOTS.map((bot) => {
            const isRunning = runningBots[bot.id];
            return (
              <div
                key={bot.id}
                style={{
                  backgroundColor: "#141B24",
                  border: "1px solid rgba(232,212,154,0.1)",
                  borderRadius: "12px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  transition: "transform 0.2s",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <span
                      style={{
                        backgroundColor: "rgba(191,160,90,0.12)",
                        color: "#D4B86A",
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {bot.badge}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        color: isRunning ? "#D4B86A" : "#7AB87A",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: isRunning ? "#D4B86A" : "#7AB87A",
                          animation: isRunning ? "pulse 1s infinite alternate" : "none",
                        }}
                      />
                      {isRunning ? "Running..." : "Active"}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#F0DCA8", marginBottom: "8px" }}>
                    {bot.name}
                  </h3>
                  <p style={{ color: "#E8D49A", opacity: 0.7, fontSize: "13px", lineHeight: "1.5", marginBottom: "24px" }}>
                    {bot.description}
                  </p>
                </div>

                <button
                  onClick={() => triggerBot(bot.id, bot.name)}
                  disabled={isRunning}
                  style={{
                    backgroundColor: isRunning ? "#2C1A0E" : "#BFA05A",
                    color: isRunning ? "#6b5e54" : "#0D1117",
                    border: "none",
                    padding: "12px 16px",
                    borderRadius: "6px",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: isRunning ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    width: "100%",
                  }}
                  onMouseOver={(e) => {
                    if (!isRunning) (e.target as HTMLElement).style.backgroundColor = "#D4B86A";
                  }}
                  onMouseOut={(e) => {
                    if (!isRunning) (e.target as HTMLElement).style.backgroundColor = "#BFA05A";
                  }}
                >
                  {isRunning ? "Running Script..." : bot.triggerLabel}
                </button>
              </div>
            );
          })}
        </section>

        {/* Real-time Console Log Terminal */}
        <section
          style={{
            backgroundColor: "#070b13",
            border: "1px solid rgba(191,160,90,0.25)",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          {/* Console Header */}
          <div
            style={{
              backgroundColor: "#101622",
              padding: "14px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(191,160,90,0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#c97b7b", display: "inline-block" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#D4B86A", display: "inline-block" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#7AB87A", display: "inline-block" }} />
              <span style={{ marginLeft: "8px", fontSize: "13px", fontWeight: "600", color: "#F0DCA8", fontFamily: "monospace" }}>
                bot_activities.log
              </span>
            </div>
            <button
              onClick={() => {
                setLogs([]);
                showNotification("Console logs cleared client-side.");
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#BFA05A",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              Clear Console
            </button>
          </div>

          {/* Console Body */}
          <div
            style={{
              padding: "20px",
              height: "380px",
              overflowY: "auto",
              fontFamily: "monospace",
              fontSize: "13px",
              lineHeight: "1.6",
              color: "#e2e8f0",
            }}
          >
            {logs.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#6b7280" }}>
                <span>No active logs. Click a button above to run a bot and stream outputs.</span>
              </div>
            ) : (
              logs.map((log, idx) => {
                let color = "#e2e8f0";
                if (log.level === "error") color = "#ea6b6b";
                if (log.level === "warn") color = "#e5be6b";

                return (
                  <div key={idx} style={{ marginBottom: "8px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ color: "#6b7280", flexShrink: 0 }}>[{formatTime(log.timestamp)}]</span>
                    <span
                      style={{
                        color: "#BFA05A",
                        fontWeight: "600",
                        flexShrink: 0,
                        backgroundColor: "rgba(191,160,90,0.06)",
                        padding: "1px 4px",
                        borderRadius: "3px",
                        fontSize: "12px",
                      }}
                    >
                      {log.bot}
                    </span>
                    <span style={{ color, wordBreak: "break-all" }}>{log.message}</span>
                  </div>
                );
              })
            )}
            <div ref={consoleEndRef} />
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}
