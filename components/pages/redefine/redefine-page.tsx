"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  frame,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useScramble } from "@/components/pages/platform/developers/use-scramble";
import { LOCKUP_PATHS, PHONETIC_PATH } from "./glyphs";

const BLOB_SRC = "/img/img-d0e7f6fa88.png";
const LOCKUP_MASK_SRC = "/img/img-5a5dad06b5.png";

// ---------- small hooks ----------

function useMaxWidth(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${query})`);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

function useIsSafari() {
  const [safari, setSafari] = useState(false);
  useEffect(() => {
    const ua = window.navigator.userAgent;
    setSafari(ua.includes("Safari") && !ua.includes("Chrome") && !ua.includes("Chromium"));
  }, []);
  return safari;
}

function useWindowSize() {
  const [size, setSize] = useState({ width: Infinity, height: Infinity });
  useEffect(() => {
    const on = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return size;
}

/** Pointer position relative to an element, updated on every document mousemove. */
function useMouse(ref: React.RefObject<Element | null>) {
  const [s, set] = useState({ elX: 0, elY: 0, elW: 0, elH: 0 });
  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      set({ elX: e.pageX - (r.left + window.pageXOffset), elY: e.pageY - (r.top + window.pageYOffset), elW: r.width, elH: r.height });
    };
    document.addEventListener("mousemove", on);
    return () => document.removeEventListener("mousemove", on);
  }, [ref]);
  return s;
}

// ---------- dot grid pinned under the title ----------

const LIT = [3, 4, 5, 10, 14, 17, 18, 19, 21, 23];

function DotGrid() {
  const [scrolled, setScrolled] = useState(false);
  const [lit, setLit] = useState(0);
  const [settled, setSettled] = useState(false);
  const narrow = useMaxWidth("991.98px");
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrolled(v > 0);
    setLit(Math.floor(3 * v));
  });
  const topOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const h = useTransform(scrollYProgress, [0, 1], [48, 480]);
  const height = useMotionTemplate`${h}px`;
  // random stagger per dot, drawn once on the client so render stays pure
  const jitter = useMemo(() => Array.from({ length: 24 }, () => Math.random()), []);
  return (
    <motion.div
      initial="initial"
      animate={scrolled ? "collapse" : "initial"}
      className={`pointer-events-none fixed top-[calc(50%+200px)] left-1/2 z-1 h-12 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-container${scrolled ? " max-lg:opacity-0 max-lg:transition-opacity max-lg:duration-500 max-lg:ease-in-out" : ""}`}
      style={{ height }}
    >
      {Array.from({ length: 24 }).map((_, i) => {
        const col = Math.floor(i / 3);
        const row = i % 3;
        const first = col === 0;
        const on = lit >= i;
        const opacity = scrolled ? (first ? topOpacity.get() : 0) : 1;
        const x = scrolled && first && !narrow ? -100 : 18 * col;
        const y = 18 * row;
        const background = scrolled ? (on ? "#dee2e7" : "#ffffff") : LIT.includes(i) ? "#dee2e7" : "#ffffff";
        const blur = scrolled ? (first && !narrow ? 0 : 12) : 0;
        return (
          <motion.div
            key={i}
            initial={{ filter: "blur(4px)", opacity: 0, x, y }}
            animate={{ background, filter: `blur(${blur}px)`, opacity, x, y }}
            transition={{ delay: settled && !narrow ? jitter[i] / 20 : jitter[i] / 10, duration: settled ? 0.4 : 0.2, ease: "easeInOut" }}
            onAnimationComplete={() => setSettled(true)}
            className="absolute size-3 rounded-full border border-white-600"
          />
        );
      })}
    </motion.div>
  );
}

// ---------- title ----------

function fade({ blur, monochrome = false, duration = 1, delay = 0 }: { blur: number; monochrome?: boolean; duration?: number; delay?: number }) {
  return {
    hidden: {
      backgroundImage: monochrome ? undefined : "linear-gradient(to right, hsl(180, 80%, 50%), hsl(320, 80%, 50%))",
      filter: `blur(${blur}px)`,
      opacity: 0,
    },
    visible: {
      backgroundImage: monochrome ? undefined : "linear-gradient(to right, #1C1D1F, #1C1D1F)",
      filter: "blur(0px)",
      opacity: 1,
      transition: { delay, duration, ease: "easeOut" as const },
    },
  };
}

function Title() {
  const { ref } = useScramble<HTMLSpanElement>({ chance: 0.8, overdrive: false, step: 2, text: "/ Redefining CRM", tick: 1 });
  return (
    <header className="relative z-1 flex min-h-[calc(100vh-var(--site-header-height))] w-full max-w-2xl flex-col justify-center px-container pb-32">
      <p className="text-overline">
        <span ref={ref} /> </p>
      <motion.div initial="hidden" animate="visible" className="pt-20">
        <div className="flex flex-wrap items-baseline">
          <motion.p variants={fade({ blur: 8, delay: 0.6 })} className="mr-2 bg-fixed bg-clip-text text-heading-responsive-md text-transparent">
            {"CRM"}
          </motion.p>{" "}
          <div className="inline-flex items-baseline gap-2 text-heading-responsive-md-serif">
            <motion.svg variants={fade({ blur: 3, delay: 0.8, monochrome: true })} className="h-10 translate-y-2.25 max-lg:h-8 max-lg:translate-y-1.75" viewBox="0 0 204 40">
              <path d={PHONETIC_PATH} fill="currentColor" />
            </motion.svg>
            <motion.p variants={fade({ blur: 3, delay: 1, monochrome: true })}>{"abbr."}</motion.p>
          </div>
        </div>
        <h1 className="pt-2 text-heading-responsive-md max-lg:leading-[1.2]">
          <motion.span variants={fade({ blur: 4, delay: 1.4 })} className="bg-fixed bg-clip-text text-transparent">
            {"Customer"}
          </motion.span>{" "}
          <motion.span variants={fade({ blur: 4, delay: 1.6 })} className="bg-fixed bg-clip-text text-transparent">
            {"relationship"}
          </motion.span>{" "}
          <motion.span variants={fade({ blur: 16, delay: 1.8, duration: 1.2 })} className="bg-fixed bg-clip-text text-transparent">
            {"magic."}
          </motion.span>
        </h1>
      </motion.div>
    </header>
  );
}

// ---------- scroll-revealed copy ----------

type Kind = "h2" | "paragraph" | "listItem" | "smallParagraph";

const KINDS: Record<Kind, { tag: "h2" | "p"; cls: string; blur: number; gradient: boolean; inDur: number; outDur: number }> = {
  h2: { tag: "h2", cls: "mb-[2.6rem] font-display text-2xl font-semibold", blur: 12, gradient: true, inDur: 0.7, outDur: 0.15 },
  paragraph: {
    tag: "p",
    cls: "leading-[1.6]! my-[1rem] font-serif text-xl text-secondary-foreground max-xl:text-lg last:mb-0",
    blur: 1.5,
    gradient: false,
    inDur: 0.6,
    outDur: 0.15,
  },
  listItem: {
    tag: "p",
    cls: "leading-[1.6]! mb-[0.5rem] mt-[1.5rem] font-serif flex flex-wrap items-center text-xl text-secondary-foreground max-xl:text-lg",
    blur: 2,
    gradient: false,
    inDur: 0.6,
    outDur: 0.15,
  },
  smallParagraph: {
    tag: "p",
    cls: "leading-[1.6]! font-serif text-base text-tertiary-foreground pl-7 max-w-lg max-xl:text-sm",
    blur: 1.5,
    gradient: false,
    inDur: 0.6,
    outDur: 0.15,
  },
};

const SPECTRUM = "linear-gradient(to right, hsl(180, 80%, 50%), hsl(320, 80%, 50%))";
const INK = "linear-gradient(to right, #1C1D1F, #1C1D1F)";

/** One block of copy: every word fades from blur as the block scrolls past 88% of the viewport, one after another. */
function RevealText({
  type,
  allowed,
  onRevealed,
  onLeave,
  className,
  text,
}: {
  type: Kind;
  allowed: boolean;
  onRevealed: () => void;
  onLeave: () => void;
  className?: string;
  text: string;
}) {
  const k = KINDS[type];
  const words = text.split(" ");
  const safari = useIsSafari();
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [entered, setEntered] = useState(false);
  const [shown, setShown] = useState<boolean[]>(() => Array(words.length).fill(false));
  const { scrollYProgress } = useScroll({ offset: ["start 88vh", "end 88vh"], target: ref });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setEntered(v > 0);
    setProgress(Math.floor(v * words.length));
  });
  const leave = useRef(onLeave);
  useEffect(() => {
    leave.current = onLeave;
  });
  useEffect(() => {
    if (!entered) leave.current();
  }, [entered]);

  // a later class of the same kind replaces the earlier one, the way the source merges them
  let base = `text-pretty ${k.cls}`;
  if (className === "mb-6") base = base.replace(" mb-[2.6rem]", "");
  const Tag = k.tag;
  const isList = type === "listItem";
  let blur = k.blur;
  return (
    <Tag ref={ref as React.Ref<HTMLParagraphElement & HTMLHeadingElement>} className={className ? `${base} ${className}` : base}>
      {words.map((w, i) => {
        const past = progress > i;
        const prevDone = shown[i - 1] || i === 0;
        const first = i === 0;
        const last = i === words.length - 1;
        const gradient = k.gradient || (isList && last);
        const x = isList && first ? "-2px" : "0px";
        const b = blur;
        if (isList) {
          if (first) blur = 0;
          if (last) blur = 4;
        }
        const filter = safari ? "none" : `blur(${b}px)`;
        const from = gradient ? SPECTRUM : "none";
        const to = gradient ? INK : "none";
        let cls = "-mx-1 px-1";
        if (isList && first) cls = "mx-0 w-7 px-0 text-black-800 text-overline!";
        else {
          if (gradient) cls += " bg-fixed bg-clip-text text-transparent";
          if (isList && last) cls += " italic";
        }
        return (
          <Fragment key={i}>
            <motion.span
              variants={{
                hidden: { backgroundImage: to, filter, opacity: 0.1, transition: { duration: k.outDur, ease: "easeIn" }, x },
                visible: { backgroundImage: [from, to], filter: safari ? "none" : "blur(0px)", opacity: 1, transition: { duration: k.inDur, ease: "easeOut" }, x: 0 },
              }}
              initial="hidden"
              animate={allowed && past && prevDone ? "visible" : "hidden"}
              onAnimationStart={(def) => {
                setTimeout(
                  () => {
                    setShown((s) => {
                      const n = [...s];
                      n[i] = progress > i;
                      return n;
                    });
                  },
                  type === "h2" ? 50 : 1,
                );
                if (def === "visible" && last) onRevealed();
              }}
              className={cls}
            >
              {w}{" "}
            </motion.span>
            {isList && !first && "\u00a0"}
          </Fragment>
        );
      })}
    </Tag>
  );
}

const COPY: Record<"A" | "B" | "C", { text: string; type: Kind; className?: string }[]> = {
  A: [
    { text: "The time has come to redefine CRM.", type: "h2" },
    { text: "For more than twenty years, businesses have faced an impossible choice with CRM: power or simplicity.", type: "paragraph" },
    { text: "Complex systems that could do anything, or simple tools that couldn’t scale. Most would use spreadsheets, until they had no choice.", type: "paragraph" },
    { className: "pt-5", text: "We were told, that’s just how CRM works.", type: "paragraph" },
    {
      text: "The paradigm was built for a different era: when the internet was dial-up, when AI was science fiction, or when business moved in months, not minutes.",
      type: "paragraph",
    },
    { className: "pt-5", text: "Times have changed.", type: "paragraph" },
    { text: "Today’s businesses deserve better than yesterday’s CRM.", type: "paragraph" },
    { text: "They deserve magic. Real magic, and the kind that makes the impossible feel inevitable.", type: "paragraph" },
  ],
  B: [
    { text: "What does customer relationship magic mean?", type: "h2" },
    { text: "It means flipping the script: a CRM that works for you, not the other way around.", type: "paragraph" },
    { text: "It means building a CRM for how business actually works today, not how it worked two decades ago.", type: "paragraph" },
    { text: "It means rejecting the false trade-off that power must mean complexity, and an intuitive experience must mean limitation.", type: "paragraph" },
    { className: "pb-5", text: "It means:", type: "paragraph" },
    { text: "[1] Setup should be instant.", type: "listItem" },
    { text: "Because your time is for strategy, not data entry.", type: "smallParagraph" },
    { text: "[2] Power should feel effortless.", type: "listItem" },
    { text: "Because you control your tools, not the other way around.", type: "smallParagraph" },
    { text: "[3] Your CRM should adapt to you.", type: "listItem" },
    { text: "Because your business model and workflows are unique.", type: "smallParagraph" },
    { text: "[4] AI should be foundational.", type: "listItem" },
    { text: "Because it’s not just a feature, as AI changes everything.", type: "smallParagraph" },
  ],
  C: [
    { className: "mb-6", text: "This is customer relationship magic.", type: "h2" },
    { text: "That’s why we’re here. That’s what we’re building:", type: "paragraph" },
    { text: "A CRM that works for you, not the other way around.", type: "paragraph" },
  ],
};

const SECTIONS = [
  { className: "min-h-[calc(62vh-var(--site-header-height))] pb-28", id: "A" as const },
  { className: "min-h-[calc(62vh-var(--site-header-height))] pb-28", id: "B" as const },
  { className: "min-h-auto", id: "C" as const },
];

// ---------- closing lockup ----------

function LockupGlyph({ active, d, index, hovering }: { active: boolean; d: string; index: number; hovering: boolean }) {
  const { width, height } = useWindowSize();
  const diag = Math.sqrt(width ** 2 + height ** 2);
  const ref = useRef<SVGPathElement>(null);
  const { elX, elY, elW, elH } = useMouse(ref);
  const dist = Math.sqrt((elX - elW / 2) ** 2 + (elY - elH / 2) ** 2);
  const glow = 6 * (1 - Math.min(dist, diag / 2) / (diag / 2));
  const std = Number.isFinite(glow) ? glow : 0;
  return (
    <g className="relative">
      <defs>
        <filter id={`blur-proximity-A-${index}`} x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation={std} />
        </filter>
        <filter id={`blur-proximity-B-${index}`} x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation={std / 2} />
        </filter>
      </defs>
      <AnimatePresence>
        {dist ? (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: +!hovering, transition: { duration: 0.5, ease: "easeInOut" } }} className="relative mix-blend-plus-lighter">
            <motion.path animate={{ filter: `url(#blur-proximity-A-${index})`, transition: { duration: 0 } }} d={d} fill="white" />
            <motion.path animate={{ filter: `url(#blur-proximity-B-${index})`, transition: { duration: 0 } }} d={d} fill="white" />
          </motion.g>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0], transition: { delay: 0.3 + 0.06 * index, duration: 1.5, ease: "easeOut" } }}
            className="relative"
            fill="white"
          >
            <path d={d} style={{ filter: "url(#blur-12)" }} className="mix-blend-plus-lighter" />
            <path d={d} style={{ filter: "url(#blur-4)" }} className="relative mix-blend-plus-lighter" />
            <path d={d} style={{ filter: "url(#blur-1)" }} className="mix-blend-plus-lighter" />
          </motion.g>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <motion.path
            ref={ref}
            initial={{
              fill: hovering ? "#1C1D1F" : "#fff",
              filter: hovering
                ? "drop-shadow(0 0 16px hsl(180, 80%, 50%)) drop-shadow(0 0 6px hsl(320, 80%, 50%))"
                : "drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 transparent)",
              opacity: 0,
            }}
            animate={{
              fill: hovering ? "#1C1D1F" : "#fff",
              filter: "drop-shadow(0 0 0 hsla(180, 80%, 50%, 0)) drop-shadow(0 0 0 hsla(320, 80%, 50%, 0))",
              opacity: 1,
              transition: {
                delay: 0.04 * index,
                duration: 1,
                ease: "easeOut",
                fill: { delay: hovering ? 0.01 * index : -0.01 * index, duration: 0.4, ease: "easeInOut" },
              },
            }}
            transition={{ duration: 0 }}
            d={d}
            className="absolute"
          />
        )}
      </AnimatePresence>
    </g>
  );
}

function Lockup({ active, hovering }: { active: boolean; hovering: boolean }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 960 400"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      className="isolate transition-transform duration-1000 ease-in-out hover:scale-[1.015]"
    >
      <defs>
        <filter id="blur-12" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id="blur-4" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="blur-1" x="-30%" y="-30%" width="160%" height="160%" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>
      {LOCKUP_PATHS.map((d, i) => (
        <LockupGlyph key={i} d={d} index={i} active={active} hovering={hovering} />
      ))}
    </svg>
  );
}

type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  size: number;
  color: string;
  progress: number;
  speed: number;
  opacity: number;
  last: number;
};

function makeParticle(targetX: number, targetY: number, color: string, w: number, h: number): Particle {
  const side = Math.floor(3 * Math.random());
  let startX: number;
  let startY: number;
  if (side === 0) {
    startX = Math.random() * w;
    startY = h + h / 8;
  } else {
    startX = side === 1 ? -w / 8 : w + w / 8;
    startY = (0.2 + 0.8 * Math.random()) * h;
  }
  return { x: startX, y: startY, targetX, targetY, startX, startY, size: 2, color, progress: 0, speed: 0.5 + Math.random(), opacity: 0, last: performance.now() };
}

function stepParticle(p: Particle, active: boolean, now: number) {
  const dt = Math.min((now - p.last) / 1e3, 0.1);
  p.last = now;
  if (active) {
    if (p.progress < 1) p.progress = Math.min(1, p.progress + p.speed * dt);
    p.x = p.startX + (p.targetX - p.startX) * p.progress;
    p.y = p.startY + (p.targetY - p.startY) * p.progress;
    p.opacity = p.progress;
  } else if (p.progress > 0) {
    p.progress = Math.max(0, p.progress - p.speed * dt);
    p.x = p.targetX + (p.startX - p.targetX) * (1 - p.progress);
    p.y = p.targetY + (p.startY - p.targetY) * (1 - p.progress);
    p.opacity = p.progress - 0.2 * Math.random();
  } else {
    p.x = p.targetX;
    p.y = p.targetY;
    p.opacity = 0;
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, dim: boolean) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
  ctx.fillStyle = dim ? "rgba(0, 0, 0, 0.2)" : p.color;
  ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  ctx.restore();
}

/** Particles that gather into the lockup when the finale is in view, then the vector lockup takes over. */
function ParticleLockup({ active, hovering, setHovering }: { active: boolean; hovering: boolean; setHovering: (v: boolean) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const particles = useRef<Particle[]>([]);
  const loaded = useRef(false);
  const [scale, setScale] = useState(1);
  const narrow = useMaxWidth("767.98px");

  useEffect(() => {
    const tick = (now: number) => {
      const c = canvas.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, 1464, 600);
      for (const p of particles.current) {
        stepParticle(p, active, now);
        drawParticle(ctx, p, hovering);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [active, hovering]);

  useEffect(() => {
    const on = () => {
      if (wrap.current) setScale(Math.min(1, wrap.current.clientWidth / 960));
    };
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  useEffect(() => {
    if (!canvas.current || loaded.current) return;
    const img = new Image();
    img.src = LOCKUP_MASK_SRC;
    img.onload = () => {
      const c = canvas.current;
      if (!c || !c.getContext("2d")) return;
      c.width = 1464;
      c.height = 600;
      const off = document.createElement("canvas");
      off.width = 960;
      off.height = 400;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, 960, 400);
      const data = octx.getImageData(0, 0, 960, 400).data;
      const out: Particle[] = [];
      for (let y = 0; y < 400; y += 2)
        for (let x = 0; x < 960; x += 2) {
          const o = (960 * y + x) * 4;
          const a = data[o + 3];
          const lum = (data[o] + data[o + 1] + data[o + 2]) / 3;
          if (a < 128 || lum > 30) continue;
          out.push(makeParticle(252 + x, 100 + y, `rgba(255, 255, 255, ${a / 255})`, 1464, 600));
        }
      particles.current = out;
      loaded.current = true;
    };
  }, []);

  return (
    <>
      <motion.div
        ref={wrap}
        className="screen-full pointer-events-none absolute inset-x-0 bottom-0 z-0 flex h-full items-center justify-center"
        animate={{ opacity: +!active, transition: { delay: 0.5 * Number(active), duration: Number(active), ease: "easeIn" } }}
      >
        <canvas
          ref={canvas}
          className="h-[600px] w-[1440px]"
          style={{ height: "600px", transform: `scale(${scale})`, transformOrigin: "center center", width: "1464px" }}
        />
      </motion.div>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.3, ease: "easeOut" } }}
          transition={{ delay: 0, duration: 0.1, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-0 z-0 flex h-full items-center justify-center"
        >
          <div className="relative w-full max-w-[960px]">
            <Lockup hovering={hovering} active={active} />
            <a
              className="absolute inset-x-[10%] inset-y-[20%]"
              href={narrow ? "/" : "#"}
              onMouseEnter={() => {
                if (!narrow) setHovering(true);
              }}
              onMouseLeave={() => {
                if (!narrow) setHovering(false);
              }}
            >
              <span className="sr-only">{"Experience the magic"}</span>
            </a>
          </div>
        </motion.div>
      )}
    </>
  );
}

const SWATCHES = ["hsl(301, 52%, 85%)", "hsl(217, 81%, 89%)", "hsl(357, 64%, 93%)", "hsl(343, 52%, 91%)"];
const HALO_FILTERS: [string, string, string, string, string, string][] = [
  ["filter0-rd-halo", "71", "71", "988", "124", "7"],
  ["filter1-rd-halo", "55", "55", "1020", "156", "15"],
  ["filter2-rd-halo", "30", "30", "1070", "206", "27.5"],
  ["filter3-rd-halo", "0", "0", "1130", "266", "42.5"],
  ["filter4-rd-halo", "157", "85", "816", "96", "4"],
];

/** Finale: color field rising with scroll, drifting halo, the blob, and the particle lockup. */
function Finale({ active }: { active: boolean }) {
  const safari = useIsSafari();
  const field = useRef<HTMLDivElement>(null);
  const narrow = useMaxWidth("991.98px");
  const raf = useRef<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { damping: 30, restDelta: 0.001, stiffness: 100 });
  const [swatch, setSwatch] = useState("hsl(343, 52%, 71%)");
  const velocity = useMotionValue(smooth.getVelocity());
  const readVelocity = useCallback(() => {
    const v = smooth.getVelocity();
    velocity.set(v);
    if (v) frame.update(readVelocity);
  }, [smooth, velocity]);
  useMotionValueEvent(smooth, "change", () => {
    frame.update(readVelocity, false, true);
  });
  const haloX = useTransform(velocity, [-2, 0, 2], [-800, 0, 800], { clamp: false });
  const fieldY = useTransform(smooth, [0, 0.9, 1], ["80%", "40%", "0%"]);

  useEffect(() => {
    const tick = () => {
      if (!field.current) return;
      const deg = ((Date.now() % 1e4) / 1e4) * 360;
      setSwatch(SWATCHES[Math.floor(deg / 90)]);
      field.current.style.backgroundImage = `
                linear-gradient(
                    ${deg}deg,
                    hsl(343, 52%, 71%) 0%,
                    hsl(301, 52%, 65%) 25%,
                    hsl(217, 81%, 69%) 50%,
                    hsl(357, 64%, 73%) 75%
                )
            `;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [active]);

  return (
    <>
      <motion.div
        ref={field}
        className="pointer-events-none fixed inset-0 z-0 origin-bottom"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ backgroundSize: "400% 400%", maskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 100%)", y: fieldY }}
        transition={active ? { bounce: 0, duration: 0.92 } : { bounce: 0, delay: 0.1, duration: 0.7 }}
      />
      <AnimatePresence>
        {!active && !safari && (
          <motion.div
            initial={{ y: 96 }}
            animate={{
              rotate: [0, 3, -2, 1, 2, 4, -2, 0],
              scaleX: [1, 1.2, 0.96, 1.4, 0.98, 1.06, 0.92, 1],
              transition: { rotate: { duration: 24, ease: "linear", repeat: Infinity }, scale: { duration: 24, ease: "linear", repeat: Infinity } },
              y: 0,
            }}
            exit={{ transition: { duration: 4, ease: "linear" }, y: 96 }}
            style={{ x: haloX }}
            className="fixed bottom-0 left-[calc(50%-480px)] h-[96px] w-[960px]"
          >
            <svg width="1130" height="266" viewBox="0 0 1130 266" fill="none">
              {HALO_FILTERS.slice(0, 4).map(([id], i) => (
                <g key={id} opacity="0.7" filter={`url(#${id})`} style={i === 3 ? { mixBlendMode: "hard-light" } : undefined}>
                  <motion.ellipse cx="565" cy="133" rx="480" ry="48" animate={{ fill: swatch }} transition={{ duration: 1, ease: "easeInOut" }} />
                </g>
              ))}
              <g style={{ mixBlendMode: "plus-lighter" }} opacity="0.7" filter="url(#filter4-rd-halo)">
                <ellipse cx="565" cy="133" rx="400" ry="40" fill="white" />
              </g>
              <defs>
                {HALO_FILTERS.map(([id, x, y, w, h, sd]) => (
                  <filter key={id} id={id} x={x} y={y} width={w} height={h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation={sd} result="effect1_foregroundBlur" />
                  </filter>
                ))}
              </defs>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        variants={{
          active: { scale: 1.1, transition: { duration: 1.2, ease: [0.33, 1, 0.68, 1] }, x: "-50%", y: narrow ? -320 : -560 },
          hover: { scale: 1.1, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }, x: "-50%", y: "-10%" },
          inactive: { scale: 1.1, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] }, x: "-50%", y: "0%" },
        }}
        initial="inactive"
        animate={hovering && active ? "hover" : active ? "active" : "inactive"}
        className="pointer-events-none fixed bottom-0 left-1/2 z-0 h-screen w-[150%] lg:w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="blob"
          decoding="async"
          src={BLOB_SRC}
          style={{ position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, color: "transparent" }}
        />
      </motion.div>
      <ParticleLockup active={active} hovering={hovering} setHovering={setHovering} />
    </>
  );
}

// ---------- page ----------

export function RedefinePage() {
  const finale = useRef<HTMLDivElement>(null);
  const inView = useInView(finale, { amount: 0.88 });
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const mark = useCallback((section: string, i: number, on: boolean) => {
    setDone((prev) => {
      const next = new Set(prev);
      const key = `${section}-${i}`;
      if (on) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);
  return (
    <div className="relative flex flex-col items-center">
      <Title />
      <DotGrid />
      <div className="relative z-1 w-full max-w-2xl px-container">
        {SECTIONS.map((s) => (
          <section key={s.id} className={s.className}>
            {COPY[s.id].map((c, i) => (
              <RevealText
                key={i}
                type={c.type}
                allowed={i === 0 || done.has(`${s.id}-${i - 1}`)}
                onRevealed={() => mark(s.id, i, true)}
                onLeave={() => mark(s.id, i, false)}
                className={c.className}
                text={c.text}
              />
            ))}
          </section>
        ))}
      </div>
      <div className="relative z-0 mt-12 mb-[16vh] h-[240px] max-h-screen w-full overflow-hidden lg:h-[480px]" ref={finale}>
        <Finale active={inView} />
      </div>
    </div>
  );
}
