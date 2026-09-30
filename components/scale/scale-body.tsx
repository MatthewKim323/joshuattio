"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { animate, motion, useInView } from "motion/react";
import { SignalRays } from "./signal-rays";
import { useResolvedReducedMotion } from "./use-reduced-motion";

// Curve: 121 samples of y = 700 - 700 * t^2.4 across the 1392 x 760 viewBox.
const POINTS = Array.from({ length: 121 }, (_, i) => {
  const t = i / 120;
  return `${(1392 * t).toFixed(1)} ${(700 - 700 * t ** 2.4).toFixed(1)}`;
});
const LINE = `M${POINTS.join(" L ")}`;
const MASK = `M0 0 L1392 0 L${[...POINTS].reverse().join(" L ")} Z`;
const SVG = { preserveAspectRatio: "none", viewBox: "0 0 1392 760" } as const;
const STROKE = {
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  vectorEffect: "non-scaling-stroke",
} as const;

const EASE_REVEAL = [0, 0, 0.58, 1] as const;
const DUR_REVEAL = 0.6;
const HIDDEN = { filter: "blur(1.5px)", opacity: 0 };
const SHOWN = { filter: "blur(0px)", opacity: 1 };

const STATS = [
  { decimals: 1, label: "MCP calls/month", number: 10.9, suffix: "M" },
  { decimals: 0, label: "API calls/week", number: 400, suffix: "M" },
  { decimals: 0, label: "active customer agents", number: 76, suffix: "k" },
  { decimals: 0, label: "emails synced/day", number: 15, suffix: "M" },
];

function format(n: number, decimals: number, suffix: string) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(n)}${suffix}`;
}

function Chart({ className, isInView, reduceMotion }: { className: string; isInView: boolean; reduceMotion: boolean }) {
  const run = isInView && !reduceMotion;
  const hidden: CSSProperties | undefined = run || reduceMotion ? undefined : { opacity: 0 };
  return (
    <div aria-hidden="true" className={`overflow-hidden ${className}`}>
      <div className={`absolute inset-0${run ? " infra-grid-reveal" : ""}`} style={run ? { animationDelay: "100ms" } : hidden}>
        <div
          aria-hidden="true"
          className="size-full text-subtle-stroke"
          style={{
            backgroundImage:
              "linear-gradient(to right, transparent calc(50% - 0.5px), currentColor calc(50% - 0.5px) calc(50% + 0.5px), transparent calc(50% + 0.5px))",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            backgroundSize: "8px 100%",
          }}
        />
        <SignalRays color="var(--color-black-900)" count={24} peakOpacity={0.55} shouldReduceMotion={reduceMotion} />
      </div>
      <div
        className={`absolute inset-0 bg-[linear-gradient(to_bottom,rgba(148,185,255,0.18),rgba(148,185,255,0)_85%)]${run ? " infra-bloom-reveal" : ""}`}
        style={run ? { animationDelay: "1300ms" } : hidden}
      />
      <svg className="absolute inset-0 size-full" {...SVG}>
        <path d={MASK} fill="var(--color-primary-background)" />
      </svg>
      <svg className="absolute inset-0 size-full" {...SVG}>
        <path d={LINE} stroke="var(--color-default-stroke)" {...STROKE} />
      </svg>
      <svg className={`absolute inset-0 size-full${run ? " infra-reveal-to-right" : ""}`} style={run ? { animationDelay: "100ms" } : hidden} {...SVG}>
        <path d={LINE} stroke="var(--color-blue-500)" {...STROKE} />
      </svg>
    </div>
  );
}

function CountUp({ decimals, delay, inView, number, reduceMotion, suffix }: {
  decimals: number; delay: number; inView: boolean; number: number; reduceMotion: boolean; suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = format(number, decimals, suffix);
  useEffect(() => {
    if (!inView) return;
    const el = ref.current;
    if (reduceMotion) {
      if (el) el.textContent = final;
      return;
    }
    if (el) el.textContent = format(0, decimals, suffix);
    const controls = animate(0, number, {
      delay,
      duration: 1,
      ease: EASE_REVEAL,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v, decimals, suffix);
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, final, decimals, delay, number, suffix]);
  return <span ref={ref}>{final}</span>;
}

function Stat({ index, inView, reduceMotion, ...s }: (typeof STATS)[number] & { index: number; inView: boolean; reduceMotion: boolean }) {
  const delay = 0.15 + 0.1 * index;
  const [done, setDone] = useState(false);
  return (
    <motion.div
      className={`flex flex-col gap-1.5 border-blue-500 border-l-2 pl-4 sm:pl-6${!reduceMotion && !done ? " will-change-[opacity,filter]" : ""}`}
      initial={HIDDEN}
      animate={inView || reduceMotion ? SHOWN : HIDDEN}
      transition={{ delay, duration: reduceMotion ? 0 : DUR_REVEAL, ease: EASE_REVEAL }}
      onAnimationComplete={(def) => {
        if (def === SHOWN) setDone(true);
      }}
    >
      <p className="font-display font-medium text-[28px] text-primary-foreground tabular-nums leading-none tracking-[-0.32px] sm:text-[32px]">
        <CountUp decimals={s.decimals} delay={delay} inView={inView} number={s.number} reduceMotion={reduceMotion} suffix={s.suffix} />
      </p>
      <p className="font-medium text-[16px] text-tertiary-foreground leading-none tracking-[-0.16px]">{s.label}</p>
    </motion.div>
  );
}

// Inner band of the scale section: curve chart reveal (triggered when the
// section's bottom edge enters), stats blur-in + count-up (at 20% visibility).
export function ScaleBody({ heading }: { heading: ReactNode }) {
  const band = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const reduce = useResolvedReducedMotion();
  const statsIn = useInView(band, { amount: 0.2, once: true });
  const chartIn = useInView(sentinel, { once: true });

  return (
    <div
      ref={band}
      className="w-full flex-1 border-subtle-stroke border-x max-lg:border-none relative flex flex-col overflow-hidden pb-10 md:pb-14 lg:min-h-[760px] pt-38 max-xl:pt-28 max-lg:pt-22"
    >
      <Chart
        className="relative order-last mt-10 -mb-10 h-[220px] w-full md:-mb-14 md:h-[240px] lg:absolute lg:inset-0 lg:order-none lg:m-0 lg:h-auto lg:w-full"
        isInView={chartIn}
        reduceMotion={reduce}
      />
      <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px" />
      {heading}
      <div className="hidden flex-[0.7] lg:block" />
      <div className="relative z-10 mt-10 grid grid-cols-24 lg:mt-0">
        <div className="col-[3/-3] grid max-w-[480px] grid-cols-2 gap-x-12 gap-y-8 lg:col-[2/-2]">
          {STATS.map((s, i) => (
            <Stat key={s.label} {...s} index={i} inView={statsIn} reduceMotion={reduce} />
          ))}
        </div>
      </div>
      <div className="hidden flex-[2.2] lg:block" />
    </div>
  );
}
