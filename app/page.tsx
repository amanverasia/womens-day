"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Note = {
  emoji: string;
  title: string;
  body: string;
};

type ThemeKey = "midnight" | "sunrise" | "ocean";

type TimelineStep = {
  emoji: string;
  title: string;
  body: string;
};

const notes: Note[] = [
  { emoji: "🫶", title: "To courage", body: "For showing up even when it's hard." },
  { emoji: "✨", title: "To brilliance", body: "For learning, building, and lighting the way." },
  { emoji: "🌸", title: "To kindness", body: "For making people feel seen." },
  { emoji: "💜", title: "To leadership", body: "For lifting others as you rise." },
  { emoji: "🌈", title: "To joy", body: "For choosing joy and sharing it." },
  { emoji: "⭐", title: "To resilience", body: "For turning setbacks into comebacks." },
  { emoji: "🔥", title: "To ambition", body: "For daring to want more and going for it." },
  { emoji: "🎯", title: "To focus", body: "For getting things done with style." },
  { emoji: "🤝", title: "To community", body: "For building spaces where others can grow." },
  { emoji: "🧠", title: "To curiosity", body: "For asking better questions every day." },
  { emoji: "🚀", title: "To progress", body: "For moving the world forward, quietly or loudly." },
  { emoji: "🌻", title: "To hope", body: "For believing in tomorrow and making it better." },
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

function FloatingBits({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
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
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("midnight");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalTitleId = useMemo(() => "note-modal-title", []);
  const currentTheme = themes[activeTheme];

  const copyLink = useCallback(async () => {
    const shareText =
      "Happy International Women’s Day 💜✨ A little celebration page for all the amazing women out there." +
      `\n\n${window.location.href}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    window.setTimeout(() => setCopyStatus("idle"), 2500);
  }, []);

  useEffect(() => {
    if (!selectedNote) return;

    closeButtonRef.current?.focus();

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedNote(null);
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [selectedNote]);

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
            {copyStatus === "copied" && "Copied to clipboard."}
            {copyStatus === "error" && "Clipboard access failed. Please copy manually."}
            {copyStatus === "idle" && "Static page only, no forms and no data collected."}
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
            <p className="mt-2 text-slate-300">Tap or click any card for a bigger view.</p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, index) => (
              <motion.button
                key={note.title}
                type="button"
                onClick={() => setSelectedNote(note)}
                className={`group rounded-2xl border border-white/20 bg-white/10 p-5 text-left backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${currentTheme.focusRing}`}
                whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.01 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 22, scale: 0.985 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.42, delay: 0.36 + index * 0.05 }}
              >
                <p className="text-3xl" aria-hidden>
                  {note.emoji}
                </p>
                <h3 className={`mt-3 text-lg font-semibold text-white ${currentTheme.cardHover}`}>{note.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200">{note.body}</p>
              </motion.button>
            ))}
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
