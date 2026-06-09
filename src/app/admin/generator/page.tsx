"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function GeneratorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read query parameters
  const hookText = searchParams.get("hook") || "What is your earliest memory?";
  const body1Text = searchParams.get("body1") || "We forget the details, but the feeling remains.";
  const body2Text = searchParams.get("body2") || "We think we'll remember forever, but memories slowly drift away.";
  const body3Text = searchParams.get("body3") || "Write them down today, before the voices fade.";
  const takeawayText = searchParams.get("takeaway") || "Your story is worth keeping.";

  // Config States
  const [backgroundType, setBackgroundType] = useState<"gold-dust" | "midnight-ocean" | "crimson-rose">("gold-dust");
  const [textColor, setTextColor] = useState<string>("#F0ECE1"); // Cream
  const [fontFamily, setFontFamily] = useState<string>("Georgia, serif");
  
  // Rendering States
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Canvas Refs
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const outroImgRef = useRef<HTMLImageElement | null>(null);

  // Preload the beautiful generated outro card image
  useEffect(() => {
    const img = new Image();
    img.src = "/outro.png";
    img.onload = () => {
      outroImgRef.current = img;
    };
  }, []);

  // Particle System State for Gold Dust
  const particles = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
  }>>([]);

  // Initialize Particles (for 1080x1920 logical canvas size)
  useEffect(() => {
    const pArr = [];
    for (let i = 0; i < 70; i++) {
      pArr.push({
        x: Math.random() * 1080,
        y: Math.random() * 1920,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.2, // upward drift
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
    particles.current = pArr;
  }, []);

  // Text Wrapping Helper
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(" ");
    let line = "";
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const totalHeight = lines.length * lineHeight;
    let startY = y - totalHeight / 2 + lineHeight / 2;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i].trim(), x, startY);
      startY += lineHeight;
    }
  };

  // Draw Background function (Width 1080, Height 1920)
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, timeMs: number) => {
    if (backgroundType === "gold-dust") {
      // Deep Ink dark background
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, width, height);

      // Gold particles
      ctx.fillStyle = "#bfa05a";
      particles.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = height;

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
    } else if (backgroundType === "midnight-ocean") {
      // Deep blue to black vertical gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      const shift = Math.sin(timeMs / 2000) * 20;
      grad.addColorStop(0, "#030b1e");
      grad.addColorStop(0.5, "#0b0c10");
      grad.addColorStop(1, "#010204");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw floating blue waves
      ctx.fillStyle = "rgba(0, 102, 204, 0.03)";
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2 + shift, 600, 400, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (backgroundType === "crimson-rose") {
      // Deep wine red to black gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      const shift = Math.cos(timeMs / 1800) * 15;
      grad.addColorStop(0, "#1d0505");
      grad.addColorStop(0.6, "#0c0202");
      grad.addColorStop(1, "#030000");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Soft crimson ambient glow
      ctx.fillStyle = "rgba(180, 20, 20, 0.02)";
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 3 + shift, 500, 500, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Draw overlay text with timing
  const drawTextOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number, elapsedMs: number) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textColor;

    // Timeline Configuration (Total 34 seconds)
    const hookStart = 0;
    const hookEnd = 4000;
    const body1Start = 4000;
    const body1End = 10000;
    const body2Start = 10000;
    const body2End = 16000;
    const body3Start = 16000;
    const body3End = 22000;
    const takeawayStart = 22000;
    const takeawayEnd = 28000;
    const outroStart = 28000;
    const outroEnd = 34000;

    let textOpacity = 0;
    let textToDraw = "";
    let isTitle = false;

    if (elapsedMs >= hookStart && elapsedMs < hookEnd) {
      textToDraw = hookText;
      isTitle = true;
      // Fade in (500ms) / Fade out (500ms)
      if (elapsedMs - hookStart < 500) {
        textOpacity = (elapsedMs - hookStart) / 500;
      } else if (hookEnd - elapsedMs < 500) {
        textOpacity = (hookEnd - elapsedMs) / 500;
      } else {
        textOpacity = 1;
      }
    } else if (elapsedMs >= body1Start && elapsedMs < body1End) {
      textToDraw = body1Text;
      isTitle = false;
      if (elapsedMs - body1Start < 500) {
        textOpacity = (elapsedMs - body1Start) / 500;
      } else if (body1End - elapsedMs < 500) {
        textOpacity = (body1End - elapsedMs) / 500;
      } else {
        textOpacity = 1;
      }
    } else if (elapsedMs >= body2Start && elapsedMs < body2End) {
      textToDraw = body2Text;
      isTitle = false;
      if (elapsedMs - body2Start < 500) {
        textOpacity = (elapsedMs - body2Start) / 500;
      } else if (body2End - elapsedMs < 500) {
        textOpacity = (body2End - elapsedMs) / 500;
      } else {
        textOpacity = 1;
      }
    } else if (elapsedMs >= body3Start && elapsedMs < body3End) {
      textToDraw = body3Text;
      isTitle = false;
      if (elapsedMs - body3Start < 500) {
        textOpacity = (elapsedMs - body3Start) / 500;
      } else if (body3End - elapsedMs < 500) {
        textOpacity = (body3End - elapsedMs) / 500;
      } else {
        textOpacity = 1;
      }
    } else if (elapsedMs >= takeawayStart && elapsedMs < takeawayEnd) {
      textToDraw = selectedTakeawayFormat(takeawayText);
      isTitle = false;
      if (elapsedMs - takeawayStart < 500) {
        textOpacity = (elapsedMs - takeawayStart) / 500;
      } else if (takeawayEnd - elapsedMs < 500) {
        textOpacity = (takeawayEnd - elapsedMs) / 500;
      } else {
        textOpacity = 1;
      }
    } else if (elapsedMs >= outroStart && elapsedMs < outroEnd) {
      // If we have the custom generated outro image loaded, display it full-screen
      if (outroImgRef.current) {
        ctx.save();
        const imgOpacity = Math.min(1, (elapsedMs - outroStart) / 500);
        ctx.globalAlpha = imgOpacity;
        ctx.drawImage(outroImgRef.current, 0, 0, width, height);
        ctx.restore();
        return; // Skip drawing text overlays, as the outro card already has them
      }
    }

    if (textToDraw) {
      ctx.save();
      ctx.globalAlpha = textOpacity;

      // Font Setup - Uniform and consistent style across all screens
      ctx.font = `italic 46px ${fontFamily}`;
      ctx.fillStyle = textColor;
      wrapText(ctx, textToDraw, width / 2, height / 2, width * 0.85, 68);

      ctx.restore();
    }

    // Always draw brand CTA at the very bottom during the Outro segment (only for fallback)
    if (elapsedMs >= outroStart) {
      ctx.save();
      // Match fade-in of the outro
      const ctaOpacity = Math.min(1, (elapsedMs - outroStart) / 500);
      ctx.globalAlpha = ctaOpacity * 0.9;
      
      // Divider
      ctx.strokeStyle = "rgba(191, 160, 90, 0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width * 0.3, height - 310);
      ctx.lineTo(width * 0.7, height - 310);
      ctx.stroke();

      // Brand Logo / Title
      ctx.fillStyle = "#bfa05a"; // Gold
      ctx.font = "bold tracking-widest 32px Cinzel, serif";
      ctx.fillText("CHRONICLED", width / 2, height - 260);

      // Product Tagline
      ctx.fillStyle = "rgba(240, 236, 225, 0.8)"; // Semi-transparent cream
      ctx.font = "italic 24px Georgia, serif";
      ctx.fillText("Turn your memories into a custom memoir book.", width / 2, height - 200);

      // Website URL
      ctx.fillStyle = "#bfa05a"; // Gold
      ctx.font = "bold 30px Georgia, serif";
      ctx.fillText("getchronicled.art", width / 2, height - 135);
      ctx.restore();
    }
  };

  const selectedTakeawayFormat = (text: string) => {
    // Strip leading/trailing quote marks if they exist
    return text.replace(/^["']|["']$/g, "");
  };

  // Preview Loop (runs inside the browser tab continuously)
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set resolution logical size
    canvas.width = 1080;
    canvas.height = 1920;

    const startTime = Date.now();

    const tick = () => {
      const timeMs = Date.now() - startTime;
      const elapsedMs = timeMs % 34000; // Loop every 34 seconds in preview

      drawBackground(ctx, canvas.width, canvas.height, timeMs);
      drawTextOverlay(ctx, canvas.width, canvas.height, elapsedMs);

      animationFrameId.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [backgroundType, textColor, fontFamily]);

  // Video Compile & Recorder
  const handleRender = async () => {
    setIsRendering(true);
    setRenderProgress(0);
    setIsComplete(false);

    // Create an offscreen canvas specifically for recording
    const recordCanvas = document.createElement("canvas");
    recordCanvas.width = 1080;
    recordCanvas.height = 1920;
    const ctx = recordCanvas.getContext("2d");
    if (!ctx) {
      alert("Failed to initialize canvas context.");
      setIsRendering(false);
      return;
    }

    // Capture Stream at 30 FPS
    const stream = recordCanvas.captureStream(30);
    
    // Check supported MIME type
    let mimeType = "video/webm;codecs=vp9";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm";
    }

    const chunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 6000000, // 6 Mbps for high-def exports
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      
      // Trigger browser file download
      const a = document.createElement("a");
      a.href = url;
      a.download = `chronicled_tiktok_ad_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsComplete(true);
      setIsRendering(false);
    };

    // Begin Recording
    mediaRecorder.start();

    // Loop logic to draw frames at exact 30fps intervals (33.3ms) for 34 seconds
      const totalDuration = 34000;
      const fps = 30;
      const frameInterval = 1000 / fps;
      let currentElapsed = 0;
      
      const renderInterval = setInterval(() => {
        currentElapsed += frameInterval;
  
        // Update progress state
        const percentage = Math.min(100, Math.floor((currentElapsed / totalDuration) * 100));
        setRenderProgress(percentage);
  
        // Render the frame onto offscreen canvas
        drawBackground(ctx, recordCanvas.width, recordCanvas.height, currentElapsed);
        drawTextOverlay(ctx, recordCanvas.width, recordCanvas.height, currentElapsed);
  
        if (currentElapsed >= totalDuration) {
          clearInterval(renderInterval);
          mediaRecorder.stop();
        }
      }, frameInterval);
  };

  return (
    <main
      style={{
        backgroundColor: "var(--ink)",
        minHeight: "100vh",
        color: "var(--cream)",
        padding: "40px 20px",
        fontFamily: "var(--font-garamond), Georgia, serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-cinzel), serif",
                color: "var(--gold)",
                fontSize: "1.8rem",
                letterSpacing: "1px",
                margin: 0,
              }}
            >
              NARRATIVE VIDEO COMPOSER
            </h1>
            <p style={{ color: "var(--parchment)", fontSize: "0.95rem", margin: "5px 0 0 0" }}>
              Export high-converting typography video ads instantly
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/prompts")}
            style={{
              backgroundColor: "transparent",
              border: "1px solid rgba(191, 160, 90, 0.4)",
              color: "var(--gold)",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "var(--font-cinzel), serif",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(191, 160, 90, 0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ← Back to Prompts
          </button>
        </header>

        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "center" }}>
          
          {/* Simulated Mobile Device Preview */}
          <div style={{ flex: "0 0 340px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h3 style={{ color: "var(--parchment)", fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", marginBottom: "15px" }}>
              TikTok Screen Preview (34s Loop)
            </h3>
            
            <div
              style={{
                width: "320px",
                height: "568px", // 9:16 aspect ratio scaled
                borderRadius: "32px",
                border: "6px solid #1a1a20",
                boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(191, 160, 90, 0.15)",
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#000",
              }}
            >
              {/* Dynamic canvas */}
              <canvas
                ref={previewCanvasRef}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                }}
              />

              {/* Status bar mock */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "0",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 24px",
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.6)",
                  pointerEvents: "none",
                  fontFamily: "sans-serif",
                }}
              >
                <span>9:41</span>
                <span>📶 🔋</span>
              </div>
            </div>
          </div>

          {/* Config & Compile Control Panel */}
          <div
            style={{
              flex: "1 1 500px",
              backgroundColor: "var(--ink-card)",
              border: "1px solid rgba(191, 160, 90, 0.15)",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            {/* Display texts preview */}
            <div>
              <h3 style={{ color: "var(--gold)", fontFamily: "var(--font-cinzel), serif", fontSize: "1.1rem", borderBottom: "1px solid rgba(191,160,90,0.15)", paddingBottom: "8px", marginBottom: "15px" }}>
                Active Script Details
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.95rem" }}>
                <p><strong>0s-4s (Hook):</strong> <span style={{ color: "var(--gold-light)", fontStyle: "italic" }}>"{hookText}"</span></p>
                <p><strong>4s-10s (Story Beat 1):</strong> <span style={{ color: "var(--cream)" }}>{body1Text}</span></p>
                <p><strong>10s-16s (Story Beat 2):</strong> <span style={{ color: "var(--cream)" }}>{body2Text}</span></p>
                <p><strong>16s-22s (Story Beat 3):</strong> <span style={{ color: "var(--cream)" }}>{body3Text}</span></p>
                <p><strong>22s-28s (Takeaway):</strong> <span style={{ color: "var(--parchment)", fontStyle: "italic" }}>{takeawayText}</span></p>
                <p><strong>28s-34s (Outro Card):</strong> <span style={{ color: "var(--gold-light)" }}>[Full Screen Outro Card]</span></p>
              </div>
            </div>

            {/* Settings */}
            <div>
              <h3 style={{ color: "var(--gold)", fontFamily: "var(--font-cinzel), serif", fontSize: "1.1rem", borderBottom: "1px solid rgba(191,160,90,0.15)", paddingBottom: "8px", marginBottom: "15px" }}>
                Video Style Controls
              </h3>
              
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {/* Background Select */}
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", color: "var(--parchment)", marginBottom: "8px", fontSize: "0.9rem" }}>Background Scene</label>
                  <select
                    value={backgroundType}
                    onChange={(e) => setBackgroundType(e.target.value as any)}
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
                    <option value="gold-dust" style={{ backgroundColor: "var(--ink)" }}>Luxury Gold Dust (Cinematic)</option>
                    <option value="midnight-ocean" style={{ backgroundColor: "var(--ink)" }}>Midnight Ocean (Deep Blue)</option>
                    <option value="crimson-rose" style={{ backgroundColor: "var(--ink)" }}>Crimson Rose (Atmospheric Red)</option>
                  </select>
                </div>

                {/* Font Select */}
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", color: "var(--parchment)", marginBottom: "8px", fontSize: "0.9rem" }}>Typography Style</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
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
                    <option value="Georgia, serif" style={{ backgroundColor: "var(--ink)" }}>Garamond (Warm Serif)</option>
                    <option value="Times New Roman, serif" style={{ backgroundColor: "var(--ink)" }}>Classic Roman (Sophisticated)</option>
                    <option value="Arial, sans-serif" style={{ backgroundColor: "var(--ink)" }}>Modern Clean (Bold Sans-Serif)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action compilation area */}
            <div style={{ marginTop: "10px" }}>
              <AnimatePresence mode="wait">
                {isRendering ? (
                  <motion.div
                    key="rendering"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--gold)" }}>
                      <span>Compiling Video Frames...</span>
                      <span>{renderProgress}%</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div style={{ width: "100%", height: "8px", backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${renderProgress}%`,
                          backgroundColor: "var(--gold)",
                          transition: "width 0.1s linear",
                        }}
                      />
                    </div>
                    <p style={{ color: "var(--parchment)", fontSize: "0.85rem", fontStyle: "italic", textAlign: "center", margin: 0 }}>
                      Rendering at 1080x1920 logical size. Do not close this tab.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ display: "flex", flexDirection: "column", gap: "15px" }}
                  >
                    <button
                      onClick={handleRender}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--gold)",
                        color: "var(--ink)",
                        fontFamily: "var(--font-cinzel), serif",
                        fontWeight: "bold",
                        padding: "16px",
                        fontSize: "1.15rem",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer",
                        letterSpacing: "1px",
                        transition: "all 0.2s",
                        boxShadow: "0 4px 15px rgba(191, 160, 90, 0.3)",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--gold-light)")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--gold)")}
                    >
                      Export & Download TikTok Video
                    </button>
                    
                    {isComplete && (
                      <p style={{ color: "#4CAF50", fontSize: "0.95rem", textAlign: "center", fontWeight: "500", margin: 0 }}>
                        ✓ Export complete! Your vertical video (.webm) has downloaded successfully.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Helpful tips */}
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.2)",
                border: "1px dashed rgba(191,160,90,0.2)",
                padding: "20px",
                borderRadius: "4px",
                fontSize: "0.88rem",
                color: "var(--parchment)",
                lineHeight: "1.5",
              }}
            >
              <h4 style={{ color: "var(--gold)", margin: "0 0 8px 0", fontFamily: "var(--font-cinzel), serif" }}>💡 Content Engine Tip:</h4>
              <p style={{ margin: 0 }}>
                This tool exports high-quality, lightweight <strong>WebM</strong> files. TikTok, X (Twitter), and YouTube Shorts fully support uploading WebM videos.
              </p>
              <p style={{ margin: "8px 0 0 0" }}>
                <strong>For maximum virality:</strong> Upload this video silently, and overlay a popular trending sound (instrumental/moody) directly within the TikTok or X editor before publishing!
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}

export default function AdminGeneratorPage() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: "var(--ink)", minHeight: "100vh", color: "var(--cream)", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading composer...</div>}>
      <GeneratorContent />
    </Suspense>
  );
}
