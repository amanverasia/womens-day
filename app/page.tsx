"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Note = {
  emoji: string;
  title: string;
  body: string;
  quote: string;
};

type ThemeKey = "midnight" | "sunrise" | "ocean";

type TimelineStep = {
  emoji: string;
  title: string;
  body: string;
};

type ConfettiPiece = {
  id: number;
  burst: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  rotate: number;
  color: string;
};

type PosterPalette = {
  start: string;
  end: string;
  glowA: string;
  glowB: string;
  accent: string;
  cardBg: string;
};

const notes: Note[] = [
  {
    emoji: "🫶",
    title: "To courage",
    body: "For showing up even when it's hard.",
    quote: "Courage doesn't need noise. It just needs one honest step.",
  },
  {
    emoji: "✨",
    title: "To brilliance",
    body: "For learning, building, and lighting the way.",
    quote: "Brilliance grows when curiosity meets consistency.",
  },
  {
    emoji: "🌸",
    title: "To kindness",
    body: "For making people feel seen.",
    quote: "Kindness is a quiet superpower with lasting impact.",
  },
  {
    emoji: "💜",
    title: "To leadership",
    body: "For lifting others as you rise.",
    quote: "Real leadership creates more leaders, not followers.",
  },
  {
    emoji: "🌈",
    title: "To joy",
    body: "For choosing joy and sharing it.",
    quote: "Joy is a brave choice, especially on hard days.",
  },
  {
    emoji: "⭐",
    title: "To resilience",
    body: "For turning setbacks into comebacks.",
    quote: "Resilience is a thousand tiny restarts.",
  },
  {
    emoji: "🔥",
    title: "To ambition",
    body: "For daring to want more and going for it.",
    quote: "Ambition is vision plus the courage to begin.",
  },
  {
    emoji: "🎯",
    title: "To focus",
    body: "For getting things done with style.",
    quote: "Focus turns effort into meaningful momentum.",
  },
  {
    emoji: "🤝",
    title: "To community",
    body: "For building spaces where others can grow.",
    quote: "Community is built by people who make room for others.",
  },
  {
    emoji: "🧠",
    title: "To curiosity",
    body: "For asking better questions every day.",
    quote: "Curiosity is how tomorrow gets invented.",
  },
  {
    emoji: "🚀",
    title: "To progress",
    body: "For moving the world forward, quietly or loudly.",
    quote: "Progress is often quiet, then suddenly undeniable.",
  },
  {
    emoji: "🌻",
    title: "To hope",
    body: "For believing in tomorrow and making it better.",
    quote: "Hope is not waiting. Hope is building.",
  },
];

const timelineSteps: TimelineStep[] = [
  { emoji: "🫶", title: "Courage", body: "Show up fully, even when the day feels heavy." },
  { emoji: "✨", title: "Brilliance", body: "Learn, create, and light up every room you enter." },
  { emoji: "🚀", title: "Progress", body: "Turn small daily wins into world-changing momentum." },
];

const floatingBits = [
  { emoji: "✨", top: "8%", left: "8%", delay: 0 },
  { emoji: "💜", top: "14%", left: "78%", delay: 0.8 },
  { emoji: "🌸", top: "26%", left: "60%", delay: 1.2 },
  { emoji: "⭐", top: "36%", left: "12%", delay: 0.4 },
  { emoji: "🫶", top: "48%", left: "84%", delay: 0.6 },
  { emoji: "🔥", top: "56%", left: "18%", delay: 1.1 },
  { emoji: "🌻", top: "68%", left: "70%", delay: 0.2 },
  { emoji: "🚀", top: "78%", left: "40%", delay: 0.9 },
];

const constellationPairs = [
  [0, 3],
  [3, 5],
  [5, 7],
  [7, 6],
  [6, 2],
  [2, 1],
  [1, 4],
  [4, 0],
  [2, 4],
] as const;

const confettiPalette = ["#f9a8d4", "#c4b5fd", "#67e8f9", "#fde68a", "#fca5a5", "#86efac"];

const posterPalettes: Record<ThemeKey, PosterPalette> = {
  midnight: {
    start: "#020617",
    end: "#312e81",
    glowA: "rgba(236,72,153,0.34)",
    glowB: "rgba(56,189,248,0.27)",
    accent: "#f5d0fe",
    cardBg: "rgba(15,23,42,0.84)",
  },
  sunrise: {
    start: "#1c0904",
    end: "#7c2d12",
    glowA: "rgba(251,191,36,0.34)",
    glowB: "rgba(244,114,182,0.27)",
    accent: "#fde68a",
    cardBg: "rgba(41,14,12,0.85)",
  },
  ocean: {
    start: "#082f49",
    end: "#0f172a",
    glowA: "rgba(34,211,238,0.34)",
    glowB: "rgba(59,130,246,0.27)",
    accent: "#a5f3fc",
    cardBg: "rgba(10,37,56,0.85)",
  },
};

const themeOrder: ThemeKey[] = ["midnight", "sunrise", "ocean"];

const themes = {
  midnight: {
    label: "Midnight Bloom",
    overlay:
      "radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.22),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(147,51,234,0.25),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(56,189,248,0.2),transparent_35%)",
    aura: "linear-gradient(170deg,rgba(15,23,42,0.96),rgba(2,6,23,0.95))",
    accentText: "text-fuchsia-200",
    accentHeading: "text-fuchsia-200",
    accentButton: "bg-fuchsia-400 text-slate-950 hover:bg-fuchsia-300",
    focusRing: "focus-visible:ring-fuchsia-200",
    dotTone: "bg-fuchsia-300",
    dotGlow: "shadow-[0_0_26px_rgba(232,121,249,0.55)]",
    cardHover: "group-hover:text-fuchsia-200",
    shadowTone: "shadow-purple-900/20",
  },
  sunrise: {
    label: "Sunrise Gold",
    overlay:
      "radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.24),transparent_34%),radial-gradient(circle_at_80%_15%,rgba(251,146,60,0.24),transparent_34%),radial-gradient(circle_at_55%_88%,rgba(244,114,182,0.2),transparent_38%)",
    aura: "linear-gradient(170deg,rgba(46,16,10,0.96),rgba(24,9,5,0.94))",
    accentText: "text-amber-200",
    accentHeading: "text-amber-200",
    accentButton: "bg-amber-300 text-slate-950 hover:bg-amber-200",
    focusRing: "focus-visible:ring-amber-200",
    dotTone: "bg-amber-300",
    dotGlow: "shadow-[0_0_26px_rgba(252,211,77,0.6)]",
    cardHover: "group-hover:text-amber-200",
    shadowTone: "shadow-orange-900/25",
  },
  ocean: {
    label: "Ocean Glow",
    overlay:
      "radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_34%),radial-gradient(circle_at_78%_16%,rgba(59,130,246,0.25),transparent_32%),radial-gradient(circle_at_52%_90%,rgba(45,212,191,0.2),transparent_37%)",
    aura: "linear-gradient(170deg,rgba(8,47,73,0.96),rgba(2,18,38,0.94))",
    accentText: "text-cyan-200",
    accentHeading: "text-cyan-200",
    accentButton: "bg-cyan-300 text-slate-950 hover:bg-cyan-200",
    focusRing: "focus-visible:ring-cyan-200",
    dotTone: "bg-cyan-300",
    dotGlow: "shadow-[0_0_26px_rgba(103,232,249,0.58)]",
    cardHover: "group-hover:text-cyan-200",
    shadowTone: "shadow-cyan-900/20",
  },
} as const;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches);

    onChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  return prefersReducedMotion;
}

function sanitizeRecipientName(input: string | null): string | null {
  if (!input) return null;

  const cleaned = input
    .trim()
    .replace(/\s+/g, " ")
    .split("")
    .filter((char) => /[A-Za-z0-9]/.test(char) || char.charCodeAt(0) > 127 || " .'-".includes(char))
    .join("");

  if (!cleaned) return null;
  return cleaned.slice(0, 42);
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const rounded = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + rounded, y);
  ctx.arcTo(x + width, y, x + width, y + height, rounded);
  ctx.arcTo(x + width, y + height, x, y + height, rounded);
  ctx.arcTo(x, y + height, x, y, rounded);
  ctx.arcTo(x, y, x + width, y, rounded);
  ctx.closePath();
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) lines.push(currentLine);

  const visible = lines.slice(0, maxLines);
  visible.forEach((line, index) => {
    const isLastVisible = index === visible.length - 1 && lines.length > visible.length;
    const truncated = isLastVisible ? `${line}…` : line;
    ctx.fillText(truncated, x, y + index * lineHeight);
  });

  return y + visible.length * lineHeight;
}

function FloatingBits({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
        {constellationPairs.map(([from, to], index) => {
          const fromBit = floatingBits[from];
          const toBit = floatingBits[to];

          return (
            <motion.line
              key={`${from}-${to}`}
              x1={fromBit.left}
              y1={fromBit.top}
              x2={toBit.left}
              y2={toBit.top}
              stroke="rgba(226,232,240,0.45)"
              strokeWidth="0.35"
              strokeLinecap="round"
              strokeDasharray="2.8 3.4"
              animate={
                reducedMotion
                  ? undefined
                  : {
                      strokeOpacity: [0.22, 0.45, 0.22],
                      strokeDashoffset: [0, -8],
                    }
              }
              transition={
                reducedMotion
                  ? undefined
                  : {
                      duration: 6 + index * 0.45,
                      delay: index * 0.2,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                    }
              }
            />
          );
        })}
      </svg>

      {floatingBits.map((item, index) => (
        <span
          key={`${item.emoji}-${index}`}
          className="floating-bit absolute text-2xl opacity-60 sm:text-3xl"
          style={
            {
              top: item.top,
              left: item.left,
              "--float-x": `${8 + (index % 3) * 2}px`,
              "--float-y": `${12 + (index % 4) * 2}px`,
              "--float-rotate": `${5 + (index % 2) * 3}deg`,
              "--float-duration": `${8 + index * 0.8}s`,
              animationDelay: `${-item.delay}s`,
              animationPlayState: reducedMotion ? "paused" : "running",
            } as CSSProperties
          }
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [posterStatus, setPosterStatus] = useState<"idle" | "rendering" | "done" | "error">("idle");
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("midnight");
  const [recipientName, setRecipientName] = useState<string | null>(null);
  const [recipientInput, setRecipientInput] = useState("");
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const confettiBurstRef = useRef(0);
  const posterResetTimeoutRef = useRef<number | null>(null);
  const modalTitleId = useMemo(() => "note-modal-title", []);
  const currentTheme = themes[activeTheme];
  const posterButtonText = posterStatus === "rendering" ? "Creating poster..." : "Download poster";

  const toggleCard = useCallback((index: number) => {
    setFlippedCards((previous) => ({ ...previous, [index]: !previous[index] }));
  }, []);

  const handleRecipientInput = useCallback((value: string) => {
    const parsed = sanitizeRecipientName(value);
    setRecipientInput(parsed ?? "");
    setRecipientName(parsed);
  }, []);

  const clearRecipient = useCallback(() => {
    setRecipientInput("");
    setRecipientName(null);
  }, []);

  const launchConfetti = useCallback(() => {
    if (prefersReducedMotion) return;

    const burst = confettiBurstRef.current++;
    const pieces = Array.from({ length: 30 }, (_, index) => ({
      id: burst * 100 + index,
      burst,
      left: 10 + Math.random() * 80,
      size: 6 + Math.random() * 8,
      duration: 1300 + Math.random() * 700,
      delay: Math.random() * 220,
      drift: (Math.random() - 0.5) * 240,
      rotate: 220 + Math.random() * 360,
      color: confettiPalette[Math.floor(Math.random() * confettiPalette.length)],
    }));

    setConfettiPieces((previous) => [...previous, ...pieces]);

    window.setTimeout(() => {
      setConfettiPieces((previous) => previous.filter((piece) => piece.burst !== burst));
    }, 2300);
  }, [prefersReducedMotion]);

  const copyLink = useCallback(async () => {
    const shareUrl = new URL(window.location.href);
    if (recipientName) {
      shareUrl.searchParams.set("to", recipientName);
    } else {
      shareUrl.searchParams.delete("to");
    }

    const shareText =
      recipientName
        ? `Happy International Women’s Day 💜✨ A little celebration page dedicated to ${recipientName}.`
        : "Happy International Women’s Day 💜✨ A little celebration page for all the amazing women out there.";

    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl.toString()}`);
      setCopyStatus("copied");
      launchConfetti();
    } catch {
      setCopyStatus("error");
    }

    window.setTimeout(() => setCopyStatus("idle"), 2500);
  }, [launchConfetti, recipientName]);

  const downloadPoster = useCallback(async () => {
    if (posterStatus === "rendering") return;
    setPosterStatus("rendering");

    try {
      const width = 1080;
      const height = 1350;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      if ("fonts" in document) {
        await (document as Document & { fonts: FontFaceSet }).fonts.ready;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");

      const palette = posterPalettes[activeTheme];

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, palette.start);
      gradient.addColorStop(1, palette.end);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const glowA = ctx.createRadialGradient(140, 130, 20, 140, 130, 430);
      glowA.addColorStop(0, palette.glowA);
      glowA.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glowA;
      ctx.fillRect(0, 0, width, height);

      const glowB = ctx.createRadialGradient(860, 260, 10, 860, 260, 460);
      glowB.addColorStop(0, palette.glowB);
      glowB.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glowB;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "600 34px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText("International Women's Day", 84, 94);

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 94px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText("Happy Women's Day", 84, 218);
      ctx.font = "700 86px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText("💜 ✨", 84, 308);

      const dedication = recipientName
        ? `A special dedication to ${recipientName} and every incredible woman out there.`
        : "A little celebration page for all the amazing women out there.";
      ctx.fillStyle = "rgba(226,232,240,0.98)";
      ctx.font = "500 34px system-ui, -apple-system, Segoe UI, sans-serif";
      drawWrappedText(ctx, dedication, 84, 372, 910, 48, 3);

      drawRoundedRect(ctx, 72, 454, 936, 770, 30);
      ctx.fillStyle = palette.cardBg;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.32)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = palette.accent;
      ctx.font = "700 46px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText("Wall of appreciation", 108, 526);

      const posterNotes = [notes[0], notes[3], notes[10]];
      let cursorY = 590;
      for (const note of posterNotes) {
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.font = "700 34px system-ui, -apple-system, Segoe UI, sans-serif";
        ctx.fillText(`${note.emoji} ${note.title}`, 108, cursorY);

        ctx.fillStyle = "rgba(226,232,240,0.95)";
        ctx.font = "500 28px system-ui, -apple-system, Segoe UI, sans-serif";
        cursorY = drawWrappedText(ctx, note.body, 108, cursorY + 42, 860, 40, 2) + 34;
      }

      ctx.fillStyle = "rgba(241,245,249,0.92)";
      ctx.font = "600 24px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText("Made with ✨ + 💜", 108, 1164);

      ctx.fillStyle = "rgba(148,163,184,0.95)";
      ctx.font = "500 20px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText("Static celebration page • No data collection", 108, 1200);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `womens-day-poster-${activeTheme}.png`;
      link.click();
      setPosterStatus("done");
    } catch {
      setPosterStatus("error");
    }

    if (posterResetTimeoutRef.current) {
      window.clearTimeout(posterResetTimeoutRef.current);
    }
    posterResetTimeoutRef.current = window.setTimeout(() => setPosterStatus("idle"), 2600);
  }, [activeTheme, posterStatus, recipientName]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncRecipient = () => {
      const raw = new URLSearchParams(window.location.search).get("to");
      const parsed = sanitizeRecipientName(raw);
      setRecipientName(parsed);
      setRecipientInput(parsed ?? "");
    };

    syncRecipient();
    window.addEventListener("popstate", syncRecipient);
    return () => window.removeEventListener("popstate", syncRecipient);
  }, []);

  const statusMessage =
    copyStatus === "copied"
      ? recipientName
        ? `Copied personalized link for ${recipientName}.`
        : "Copied to clipboard."
      : copyStatus === "error"
        ? "Clipboard access failed. Please copy manually."
        : posterStatus === "done"
          ? "Poster downloaded."
          : posterStatus === "error"
            ? "Could not generate poster."
            : "Static page only, no forms and no data collected.";

  useEffect(() => {
    if (!selectedNote) return;

    closeButtonRef.current?.focus();

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedNote(null);
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [selectedNote]);

  useEffect(() => {
    return () => {
      if (posterResetTimeoutRef.current) {
        window.clearTimeout(posterResetTimeoutRef.current);
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <motion.div
        key={`overlay-${activeTheme}`}
        className="absolute inset-0"
        style={{ backgroundImage: currentTheme.overlay }}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      />
      <motion.div
        key={`aura-${activeTheme}`}
        className="absolute inset-0"
        style={{ backgroundImage: currentTheme.aura }}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      />
      <FloatingBits reducedMotion={prefersReducedMotion} />

      <div aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        {confettiPieces.map((piece) => (
          <span
            key={piece.id}
            className="confetti-bit absolute -top-8 rounded-sm"
            style={
              {
                left: `${piece.left}%`,
                width: `${piece.size}px`,
                height: `${Math.max(4, piece.size * 0.56)}px`,
                backgroundColor: piece.color,
                "--confetti-drift": `${piece.drift}px`,
                "--confetti-rotate": `${piece.rotate}deg`,
                "--confetti-duration": `${piece.duration}ms`,
                animationDelay: `${piece.delay}ms`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <motion.section
          className={`rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-10 ${currentTheme.shadowTone}`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" }}
        >
          <motion.p
            className={`text-sm uppercase tracking-[0.25em] ${currentTheme.accentText}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: 0.08 }}
          >
            International Women&apos;s Day
          </motion.p>
          <motion.h1
            className="mt-4 text-balance text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: 0.16 }}
          >
            Happy Women&apos;s Day 💜
          </motion.h1>
          {recipientName && (
            <motion.p
              className={`mt-3 text-base font-medium ${currentTheme.accentHeading} sm:text-lg`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.42, delay: 0.2 }}
            >
              For {recipientName} - and every incredible woman out there.
            </motion.p>
          )}
          <motion.p
            className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: 0.24 }}
          >
            Celebrating strength, kindness, leadership, and everyday brilliance. This little wall is a playful thank
            you to women who inspire progress in every space.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-2"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: 0.3 }}
          >
            <p className="mr-1 text-xs uppercase tracking-[0.18em] text-slate-300">Scene</p>
            {themeOrder.map((themeKey) => {
              const theme = themes[themeKey];
              const isActive = themeKey === activeTheme;

              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => setActiveTheme(themeKey)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${currentTheme.focusRing} ${
                    isActive
                      ? "border-white/75 bg-white/20 text-white"
                      : "border-white/25 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                  aria-pressed={isActive}
                >
                  {theme.label}
                </button>
              );
            })}
          </motion.div>

          <motion.div
            className="mt-4 flex flex-wrap items-center gap-2"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: 0.33 }}
          >
            <label htmlFor="recipient-input" className="text-xs uppercase tracking-[0.16em] text-slate-300">
              Dedicate to
            </label>
            <input
              id="recipient-input"
              type="text"
              value={recipientInput}
              onChange={(event) => handleRecipientInput(event.target.value)}
              placeholder="Name (optional)"
              maxLength={42}
              className={`w-full min-w-[220px] grow rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto sm:grow-0 ${currentTheme.focusRing}`}
            />
            {recipientInput && (
              <button
                type="button"
                onClick={clearRecipient}
                className={`rounded-full border border-white/25 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${currentTheme.focusRing}`}
              >
                Clear
              </button>
            )}
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: 0.36 }}
          >
            <button
              type="button"
              onClick={copyLink}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${currentTheme.accentButton} ${currentTheme.focusRing}`}
            >
              Copy share text + link
            </button>
            <button
              type="button"
              onClick={downloadPoster}
              disabled={posterStatus === "rendering"}
              className={`rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${currentTheme.focusRing}`}
            >
              {posterButtonText}
            </button>
            <a
              href="#wall"
              className={`rounded-full border border-white/35 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${currentTheme.focusRing}`}
            >
              Jump to the wall
            </a>
          </motion.div>

          <motion.p
            className={`mt-4 text-sm ${currentTheme.accentText}`}
            aria-live="polite"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: 0.42 }}
          >
            {statusMessage}
          </motion.p>
        </motion.section>

        <section className="relative mt-10 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl sm:p-8">
          <p className={`text-xs uppercase tracking-[0.25em] ${currentTheme.accentText}`}>Momentum timeline</p>
          <div className="relative mt-5">
            <div aria-hidden className="pointer-events-none absolute left-[15%] right-[15%] top-6 hidden h-px bg-white/20 md:block" />
            <div className="grid gap-4 md:grid-cols-3">
              {timelineSteps.map((step, index) => (
                <motion.article
                  key={step.title}
                  className="relative rounded-2xl border border-white/20 bg-slate-900/45 p-5"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: 0.2 + index * 0.09 }}
                >
                  <motion.span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-2xl ${currentTheme.dotTone} ${currentTheme.dotGlow}`}
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : {
                            scale: [1, 1.07, 1],
                          }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            duration: 2.4,
                            delay: index * 0.25,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }
                    }
                  >
                    {step.emoji}
                  </motion.span>
                  <h3 className={`mt-4 text-xl font-semibold ${currentTheme.accentHeading}`}>{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{step.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="wall" className="mt-16 scroll-mt-8">
          <motion.div
            className="mb-6"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: 0.18 }}
          >
            <h2 className="text-3xl font-bold sm:text-4xl">Wall of appreciation</h2>
            <p className="mt-2 text-slate-300">Flip cards for quotes, then open a spotlight view.</p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, index) => {
              const isFlipped = Boolean(flippedCards[index]);

              return (
                <motion.article
                  key={note.title}
                  className="relative min-h-[248px] [perspective:1200px]"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 22, scale: 0.985 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.42, delay: 0.36 + index * 0.05 }}
                  whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.005 }}
                >
                  <div
                    className={`relative h-full w-full [transform-style:preserve-3d] transition-transform ${
                      prefersReducedMotion ? "duration-0" : "duration-500"
                    } ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
                  >
                    <div
                      className={`absolute inset-0 flex flex-col rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur [backface-visibility:hidden] focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-950 ${currentTheme.focusRing}`}
                    >
                      <p className="text-3xl" aria-hidden>
                        {note.emoji}
                      </p>
                      <h3 className={`mt-3 text-lg font-semibold text-white ${currentTheme.cardHover}`}>{note.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{note.body}</p>
                      <button
                        type="button"
                        onClick={() => toggleCard(index)}
                        className={`mt-auto self-start rounded-full border border-white/30 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${currentTheme.focusRing}`}
                        aria-pressed={isFlipped}
                      >
                        Flip for quote
                      </button>
                    </div>

                    <div
                      className={`absolute inset-0 flex flex-col rounded-2xl border border-white/25 bg-slate-900/90 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-950 ${currentTheme.focusRing}`}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Back Side</p>
                      <p className={`mt-3 text-lg font-semibold ${currentTheme.accentHeading}`}>{note.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-100">{note.quote}</p>

                      <div className="mt-auto flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => toggleCard(index)}
                          className={`rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${currentTheme.focusRing}`}
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedNote(note)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${currentTheme.accentButton} ${currentTheme.focusRing}`}
                        >
                          Open spotlight
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <footer className="mt-14 pb-4 text-center text-sm text-fuchsia-100/90">
          <p>Made with ✨ + 💜</p>
          <p className="mt-2 text-xs text-slate-300">This is a static celebration page. No tracking, no data collection.</p>
        </footer>
      </div>

      <AnimatePresence>
        {selectedNote && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-4 backdrop-blur-sm"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            onClick={() => setSelectedNote(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={modalTitleId}
              className="w-full max-w-lg rounded-3xl border border-white/20 bg-slate-900/95 p-6 shadow-2xl"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-4xl" aria-hidden>
                  {selectedNote.emoji}
                </p>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setSelectedNote(null)}
                  className={`rounded-full border border-white/30 px-3 py-1 text-sm text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${currentTheme.focusRing}`}
                >
                  Close
                </button>
              </div>
              <h3 id={modalTitleId} className={`mt-4 text-2xl font-bold ${currentTheme.accentHeading}`}>
                {selectedNote.title}
              </h3>
              <p className="mt-3 text-lg leading-8 text-slate-100">{selectedNote.body}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
