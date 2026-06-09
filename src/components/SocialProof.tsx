"use client";

import { useState, useEffect } from "react";

const EVENTS = [
  { name: "Sarah", city: "Austin, TX",       time: "2 minutes ago" },
  { name: "Marcus", city: "Portland, OR",    time: "7 minutes ago" },
  { name: "Jennifer", city: "Nashville, TN", time: "12 minutes ago" },
  { name: "Tyler", city: "Denver, CO",       time: "18 minutes ago" },
  { name: "Aisha", city: "Atlanta, GA",      time: "24 minutes ago" },
  { name: "Chris", city: "Chicago, IL",      time: "31 minutes ago" },
  { name: "Emma", city: "Seattle, WA",       time: "45 minutes ago" },
  { name: "David", city: "Miami, FL",        time: "52 minutes ago" },
  { name: "Priya", city: "San Jose, CA",     time: "1 hour ago" },
  { name: "Jake", city: "Boston, MA",        time: "1 hour ago" },
  { name: "Natalie", city: "Phoenix, AZ",    time: "2 hours ago" },
  { name: "Omar", city: "Dallas, TX",        time: "2 hours ago" },
  { name: "Lily", city: "New York, NY",      time: "3 hours ago" },
  { name: "Ben", city: "Los Angeles, CA",    time: "3 hours ago" },
  { name: "Sofia", city: "Charlotte, NC",    time: "4 hours ago" },
];

export default function SocialProof() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initial delay before first popup
    const initial = setTimeout(() => {
      setVisible(true);
    }, 6000);

    return () => clearTimeout(initial);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (visible) {
      // Hide after 5 seconds
      const hide = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(hide);
    } else {
      // Show next popup after 10 seconds
      const next = setTimeout(() => {
        setCurrent((c) => (c + 1) % EVENTS.length);
        setVisible(true);
      }, 10000);
      return () => clearTimeout(next);
    }
  }, [visible, mounted]);

  if (!mounted) return null;

  const event = EVENTS[current];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        left: "24px",
        zIndex: 9999,
        transform: visible ? "translateY(0)" : "translateY(120%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          backgroundColor: "#0D1117",
          border: "1px solid rgba(191,160,90,0.35)",
          borderLeft: "3px solid #BFA05A",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          maxWidth: "290px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        {/* Icon */}
        <div style={{
          width: "40px",
          height: "40px",
          backgroundColor: "rgba(191,160,90,0.12)",
          border: "1px solid rgba(191,160,90,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "18px",
        }}>
          📖
        </div>

        {/* Text */}
        <div>
          <p style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "10px",
            letterSpacing: "0.5px",
            color: "#F0DCA8",
            marginBottom: "2px",
            lineHeight: 1.4,
          }}>
            <strong>{event.name}</strong> from {event.city}
          </p>
          <p style={{
            fontFamily: "var(--font-garamond)",
            fontStyle: "italic",
            fontSize: "12px",
            color: "#BFA05A",
            marginBottom: "2px",
          }}>
            just received their Chronicle ✦
          </p>
          <p style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "9px",
            letterSpacing: "1px",
            color: "rgba(191,160,90,0.5)",
            textTransform: "uppercase",
          }}>
            {event.time}
          </p>
        </div>
      </div>
    </div>
  );
}
