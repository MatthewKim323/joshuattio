"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react";
import { TIERS, type Tier, type TierVariant } from "./tiers-data";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type MouseEvent } from "react";

function Line({ className = "" }: { className?: string }) {
  return (
    <svg width="100%" height="1" className={className || "text-subtle-stroke"}>
      <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

// Site initial inside the tier badge.
function BadgeMark({ className }: { className: string }) {
  return (
    <g className={className}>
      <text
        x="44"
        y="54"
        textAnchor="middle"
        fontSize="30"
        fontWeight="600"
        fill="currentColor"
        style={{ fontFamily: "var(--font-inter-display, var(--font-inter)), sans-serif" }}
      >
        {"j"}
      </text>
    </g>
  );
}

function TierBadge({ variant }: { variant: TierVariant }) {
  const cls = "absolute top-4 right-4 z-10 size-[88px]";
  if (variant === "dark")
    return (
      <svg viewBox="0 0 88 88" fill="none" className={cls}>
        <circle cx="44" cy="44" r="43.5" fill="#23252A" stroke="#505967" />
        <circle cx="44" cy="44" r="36.9" stroke="#505967" />
        <circle cx="44" cy="44" r="30.3" stroke="#505967" />
        <BadgeMark className="text-[#8F99A8]" />
      </svg>
    );
  if (variant === "gray")
    return (
      <svg viewBox="0 0 88 88" fill="none" className={cls}>
        <circle cx="44" cy="44" r="43.5" fill="var(--color-white-300)" stroke="var(--color-white-900)" />
        <circle cx="44" cy="44" r="32.94" stroke="var(--color-white-900)" />
        <BadgeMark className="text-black-700" />
      </svg>
    );
  return (
    <svg viewBox="0 0 88 88" fill="none" className={cls}>
      <circle cx="44" cy="44" r="43.5" fill="white" stroke="#CAD0D9" />
      <BadgeMark className="text-[#8F99A8]" />
    </svg>
  );
}

// Repeating "+" marks drawn through a CSS mask.
function CrossGrid({ crossSize = 8, gap = 20, className = "" }: { crossSize?: number; gap?: number; className?: string }) {
  const cell = crossSize + gap;
  const c = cell / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cell}" height="${cell}"><line x1="${c - crossSize / 2}" y1="${c}" x2="${c + crossSize / 2}" y2="${c}" stroke="black" stroke-width="1"/><line x1="${c}" y1="${c - crossSize / 2}" x2="${c}" y2="${c + crossSize / 2}" stroke="black" stroke-width="1"/></svg>`;
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return (
    <div
      className={`bg-subtle-stroke ${className}`}
      style={{
        maskImage: url,
        maskPosition: "center",
        maskRepeat: "repeat",
        maskSize: `${cell}px ${cell}px`,
        WebkitMaskImage: url,
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "repeat",
        WebkitMaskSize: `${cell}px ${cell}px`,
      }}
    />
  );
}

function Dots() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "_");
  return (
    <svg
      width="100%"
      height="100%"
      className="absolute inset-0 text-white-700 mix-blend-multiply"
      style={{ maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)" }}
    >
      <defs>
        <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect x="6.5" y="6.5" width="1" height="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

const TILT_SPRING = { damping: 20, mass: 0.1, stiffness: 80 };
const GLOW_SPRING = { damping: 40, mass: 0.5, stiffness: 50 };

// Card that tilts toward the cursor with a soft light following it.
export function TierCard({ tier, index, hideLabel = false }: { tier: Tier; index: number; hideLabel?: boolean }) {
  const dark = tier.variant === "dark";
  const gray = tier.variant === "gray";
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), TILT_SPRING);
  const rotateY = useSpring(useMotionValue(0), TILT_SPRING);
  const scale = useSpring(1, TILT_SPRING);
  const glow = useSpring(0, GLOW_SPRING);
  const gx = useTransform(rotateY, [-2, 0, 2], dark ? [85, 50, 15] : [15, 50, 85]);
  const gy = useTransform(rotateX, [-2, 0, 2], dark ? [15, 50, 85] : [85, 50, 15]);
  const tint = dark ? "oklch(1 0 0 / 0.16)" : gray ? "oklch(0.15 0.01 260 / 0.14)" : "oklch(0.15 0.01 260 / 0.12)";
  const background = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, ${tint}, transparent 90%)`;

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width / 2;
    const dy = e.clientY - r.top - r.height / 2;
    rotateX.set(-((dy / (r.height / 2)) * 2));
    rotateY.set((dx / (r.width / 2)) * 2);
  };

  const bg = dark ? "bg-black-300" : gray ? "bg-white-300" : "bg-white-100";
  return (
    <div className="flex flex-col gap-12">
      {!hideLabel && (
        <p className="text-overline">
          {"/"}
          {String(index + 1).padStart(2, "0")}
        </p>
      )}
      <div
        ref={ref}
        className={hideLabel ? "[perspective:800px]" : "[perspective:800px] cursor-default"}
        onMouseMove={onMouseMove}
        onMouseEnter={() => {
          scale.set(1.01);
          glow.set(1);
        }}
        onMouseLeave={() => {
          scale.set(1);
          rotateX.set(0);
          rotateY.set(0);
          glow.set(0);
        }}
      >
        <motion.div
          className={`relative flex aspect-4/5 flex-col justify-between overflow-hidden rounded-2xl shadow-joshuattio-5 ring-1 ring-black-100/5 [transform-style:preserve-3d] ${bg}`}
          style={{ rotateX, rotateY, scale }}
        >
          <TierBadge variant={tier.variant} />
          <div className="relative flex flex-1 flex-col overflow-hidden">
            {dark ? (
              <div
                className="size-full absolute inset-0 text-black-400"
                style={{ backgroundImage: "repeating-linear-gradient(125deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)" }}
              />
            ) : gray ? (
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: "linear-gradient(192deg, transparent 23%, oklch(1 0 0 / 0.8) 50%, transparent 82%)" }}
                />
                <Dots />
              </div>
            ) : (
              <div className="absolute inset-0">
                <CrossGrid gap={16} className="size-full" />
              </div>
            )}
            {!gray && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: dark
                    ? "linear-gradient(200deg, rgba(35,37,42,0.9) 23%, rgba(35,37,42,0) 60%, rgba(35,37,42,0.9) 100%)"
                    : "linear-gradient(191deg, rgba(255,255,255,0.85) 28%, rgba(255,255,255,0.3) 55%, rgba(255,255,255,0.85) 76%)",
                }}
              />
            )}
            <h3 className={dark ? "relative mt-auto px-6 pb-4 text-2xl text-white-100" : "relative mt-auto px-6 pb-4 text-2xl"}>
              {tier.name}
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            <Line className={dark ? "text-black-400" : gray ? "text-default-stroke" : ""} />
            <ul className="flex flex-col gap-1 px-6 pb-5">
              {tier.benefits.map((b) => (
                <li key={b} className={dark ? "text-sm text-white-900" : "text-sm text-tertiary-foreground"}>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl"
            style={{ background, opacity: glow }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// ---- Swipeable deck (below xl) ----

const DECK_SCALE = [1, 0.96, 0.94];
const DECK_X = [0, -16, -30];
const DECK_Y = [0, 22, 39];
const DECK_ROT = [0, 0, 0];
const HINT_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

type SwipeInfo = { direction: number; velocity: number };

function DeckCard({
  tier,
  originalIndex,
  stackPosition,
  totalCards,
  onSwipe,
  onEntranceComplete,
  onInteraction,
  hintRef,
}: {
  tier: Tier;
  originalIndex: number;
  stackPosition: number;
  totalCards: number;
  onSwipe: (direction: number, velocity: number) => void;
  onEntranceComplete: (position: number) => void;
  onInteraction: () => void;
  hintRef?: React.RefObject<(() => Promise<void>) | null>;
}) {
  const top = stackPosition === 0;
  const ref = useRef<HTMLDivElement>(null);
  const swiped = useRef(false);
  const entered = useRef(false);
  const reduced = useReducedMotion();
  const jitter = useMemo(() => {
    const amp = DECK_ROT[stackPosition] ?? 0;
    return (((49297 * Math.sin(9301 * originalIndex + 49297)) % 1000) / 1000) * amp * 2 - amp;
  }, [originalIndex, stackPosition]);
  const x = useMotionValue(top ? 0 : (DECK_X[stackPosition] ?? DECK_X[DECK_X.length - 1]));
  const rotate = useMotionValue(top ? 0 : jitter);
  const lift = useMotionValue(1);
  const rotAnim = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    const targetRot = top ? 0 : jitter;
    let r: AnimationPlaybackControls | null = null;
    if (top) r = animate(rotate, targetRot, { damping: 30, stiffness: 150, type: "spring" });
    else rotate.set(targetRot);
    rotAnim.current = r;
    const targetX = top ? 0 : (DECK_X[stackPosition] ?? DECK_X[DECK_X.length - 1]);
    const xa = animate(x, targetX, { damping: 30, stiffness: 150, type: "spring" });
    return () => {
      r?.stop();
      xa.stop();
    };
  }, [top, stackPosition, jitter, rotate, x]);

  useMotionValueEvent(x, "change", (v) => {
    if (top && !swiped.current) rotate.set((v / 200) * 12);
  });

  // Nudge hint: a small drag-and-return that shows the card can be swiped.
  useEffect(() => {
    if (!hintRef || reduced) return;
    hintRef.current = async () => {
      const out = { duration: 0.6, ease: HINT_EASE, type: "tween" as const };
      const back = { duration: 0.8, ease: HINT_EASE, type: "tween" as const };
      await Promise.all([animate(x, 36, out), animate(rotate, 3, out), animate(lift, 1.02, out)]);
      await Promise.all([animate(x, 0, back), animate(rotate, 0, back), animate(lift, 1, back)]);
    };
    return () => {
      hintRef.current = null;
    };
  }, [hintRef, x, rotate, lift, reduced]);

  const s = DECK_SCALE[stackPosition] ?? DECK_SCALE[DECK_SCALE.length - 1];
  const y = DECK_Y[stackPosition] ?? DECK_Y[DECK_Y.length - 1];

  return (
    <motion.div
      ref={ref}
      className={
        top
          ? "absolute inset-0 cursor-grab before:absolute before:-inset-12 before:content-[''] active:cursor-grabbing"
          : "absolute inset-0 pointer-events-none"
      }
      style={{ rotate, touchAction: top ? "pan-y" : undefined, x, zIndex: totalCards - stackPosition }}
      initial={
        top
          ? { filter: "blur(2px)", opacity: 0, scale: 0.96, y: 12 }
          : { filter: "blur(2px)", opacity: 0, scale: DECK_SCALE[DECK_SCALE.length - 1], y: y + 12 }
      }
      animate={{ filter: `blur(${[0, 0.6, 0.75][stackPosition] ?? 0}px)`, opacity: 1, scale: s, y }}
      variants={{
        exit: ({ direction, velocity }: SwipeInfo) => ({
          opacity: 0,
          transition: reduced
            ? { duration: 0.15, type: "tween" }
            : {
                opacity: { duration: 0.1, ease: [0.4, 0, 1, 1], type: "tween" },
                x: { damping: 30, stiffness: 400, type: "spring", velocity },
              },
          x: 500 * direction,
          zIndex: 4,
        }),
      }}
      exit="exit"
      onAnimationComplete={() => {
        if (!entered.current) {
          entered.current = true;
          onEntranceComplete(stackPosition);
        }
      }}
      transition={
        entered.current
          ? { damping: 50, stiffness: 200, type: "spring" }
          : { duration: 0.25, ease: [0.25, 0.1, 0.25, 1], type: "tween" }
      }
      drag={top ? "x" : false}
      dragMomentum={false}
      onDragStart={() => {
        rotAnim.current?.stop();
        onInteraction();
        animate(lift, 1.02, { damping: 30, stiffness: 500, type: "spring" });
      }}
      onDragEnd={(_, info) => {
        const w = ref.current?.offsetWidth ?? 300;
        if (Math.abs(info.offset.x + 0.8 * info.velocity.x) > 0.4 * w || Math.abs(info.velocity.x) > 500) {
          swiped.current = true;
          rotAnim.current?.stop();
          const dir =
            Math.abs(info.velocity.x) > 20 ? (info.velocity.x > 0 ? 1 : -1) : info.offset.x > 0 ? 1 : -1;
          animate(rotate, 12 * dir, { damping: 30, stiffness: 200, type: "spring" });
          onSwipe(dir, info.velocity.x);
        } else {
          const t = reduced
            ? { duration: 0.15, type: "tween" as const }
            : { damping: 30, stiffness: 500, type: "spring" as const };
          animate(x, 0, t);
          animate(lift, 1, t);
        }
      }}
    >
      <motion.div style={{ scale: lift }}>
        <TierCard tier={tier} index={originalIndex} hideLabel />
      </motion.div>
    </motion.div>
  );
}

export function TierCardDeck({ tiers = TIERS }: { tiers?: Tier[] }) {
  const swipeCount = useRef(0);
  const swipe = useRef<SwipeInfo>({ direction: 1, velocity: 0 });
  const [dealt, setDealt] = useState(0);
  const allDealt = useRef(false);
  const interacted = useRef(false);
  const hinted = useRef(false);
  const hintRef = useRef<(() => Promise<void>) | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const [stack, setStack] = useState(() => tiers.map((_, i) => ({ key: `${i}-0`, tierIndex: i })));
  const inView = useRef(false);
  const seen = useRef(false);

  const onSwipe = useCallback((direction: number, velocity: number) => {
    interacted.current = true;
    swipe.current = { direction, velocity };
    swipeCount.current += 1;
    const n = swipeCount.current;
    setStack((s) => {
      const first = s[0];
      return [...s.slice(1), { key: `${first.tierIndex}-${n}`, tierIndex: first.tierIndex }];
    });
  }, []);

  const tryHint = useCallback(() => {
    if (interacted.current || hinted.current) return;
    if (inView.current) {
      hinted.current = true;
      hintRef.current?.();
    }
  }, []);

  // Cards are dealt one after another; the hint plays once the whole stack is in.
  const onEntranceComplete = useCallback(
    (pos: number) => {
      if (pos === 0) tryHint();
      if (!allDealt.current)
        setDealt((d) => {
          const next = d + 1;
          if (next >= 3) allDealt.current = true;
          return Math.min(next, 3);
        });
    },
    [tryHint],
  );

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting && !seen.current) {
          seen.current = true;
          setDealt(1);
        }
        if (entry.isIntersecting && allDealt.current) timer = setTimeout(() => tryHint(), 600);
      },
      { threshold: 0.5 },
    );
    const onScroll = () => {
      if (timer) clearTimeout(timer);
      if (inView.current && allDealt.current)
        timer = setTimeout(() => {
          if (inView.current) tryHint();
        }, 600);
    };
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [tryHint]);

  const onInteraction = useCallback(() => {
    interacted.current = true;
  }, []);

  const visible = stack.slice(0, allDealt.current ? 3 : dealt);
  return (
    <div ref={root} className="relative mx-auto w-full max-w-xs">
      <div className="relative aspect-4/5" style={{ marginBottom: `${DECK_Y[DECK_Y.length - 1]}px` }}>
        <AnimatePresence custom={swipe.current}>
          {visible.map((c, i) => (
            <DeckCard
              key={c.key}
              tier={tiers[c.tierIndex]}
              originalIndex={c.tierIndex}
              stackPosition={i}
              totalCards={visible.length}
              onSwipe={onSwipe}
              onEntranceComplete={onEntranceComplete}
              onInteraction={onInteraction}
              hintRef={i === 0 ? hintRef : undefined}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
