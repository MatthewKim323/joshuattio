"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  motionValue,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import { useClickSound } from "./click-sound";

// Year ticker: a strip of 200 hairlines laid out by a density curve, with a
// highlighted window under the current year and a spring-following hover
// window. Desktop hovers + links; below lg it is a draggable strip.

const TICK_SOUND = {
  attack: 0.006,
  highpassFrequency: 0,
  lowpassFrequency: 1047,
  lowpassQ: 1,
  release: 0.008,
  singleVoice: true,
  sustain: 0.012,
  toneFrequency: 349,
  toneMix: 1,
  volume: 0.03,
};

const LINES = 200;
const YEAR_W = 144;
const PAD = 380;

function falloff(d: number) {
  return Math.exp(-(d < 0 ? -d : d) / 36);
}

function bump(t: number) {
  if (t <= -1 || t >= 1) return 0;
  const u = 1 - t * t;
  return u * u;
}

type Geometry = {
  cdfBase: number[];
  cdfFull: number[];
  densityBase: number[];
  densityFull: number[];
  positionsBase: number[];
  positionsFull: number[];
};

function place(cdf: number[], density: number[], n: number, out: number[]) {
  const total = cdf[n - 1];
  let a = 0;
  for (let r = 0; r < LINES; r++) {
    const target = ((r + 0.5) / LINES) * total;
    for (; a < n && cdf[a] < target; ) a++;
    const o = a < n ? a : n - 1;
    const before = o > 0 ? cdf[o - 1] : 0;
    const frac = density[o] > 0 ? (target - before) / density[o] : 0;
    out[r] = o + frac;
  }
}

function layout(width: number, hoverCenter: number, hoverStrength: number, g: Geometry) {
  let base = 0;
  let full = 0;
  for (let r = 0; r < width; r++) {
    const x = r + 0.5;
    const right = width - PAD;
    const d = x < PAD ? Math.exp(-(PAD - x) / 330) : x > right ? Math.exp(-(x - right) / 330) : 1;
    g.densityBase[r] = d;
    base += d;
    g.cdfBase[r] = base;
    const f = hoverStrength > 0 ? Math.max(0, d + -0.08 * hoverStrength * falloff(x - hoverCenter)) : d;
    g.densityFull[r] = f;
    full += f;
    g.cdfFull[r] = full;
  }
  place(g.cdfBase, g.densityBase, width, g.positionsBase);
  place(g.cdfFull, g.densityFull, width, g.positionsFull);
}

const ACTIVE_COLOR = "var(--color-primary-foreground)";
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 20; i++) {
      const t = (lo + hi) / 2;
      const u = 1 - t;
      if (3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t < x) lo = t;
      else hi = t;
    }
    const t = (lo + hi) / 2;
    const u = 1 - t;
    return 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t;
  };
}

const timeEase = cubicBezier(...EASE);
const LABEL_HOVER = { duration: 0.15, ease: EASE };
const LABEL_REST = { duration: 0.4, ease: EASE };
const LABEL_ACTIVE = { duration: 0.2, ease: EASE };
const STRENGTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HOVER_SPRING = { damping: 28, mass: 1, stiffness: 220 };
const ACTIVE_MASK =
  "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.191) 12.5%, rgba(0,0,0,0.562) 25%, rgba(0,0,0,0.879) 37.5%, black 50%, rgba(0,0,0,0.879) 62.5%, rgba(0,0,0,0.562) 75%, rgba(0,0,0,0.191) 87.5%, transparent 100%)";
const HOVER_MASK =
  "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.050) 12.5%, rgba(0,0,0,0.135) 25%, rgba(0,0,0,0.368) 37.5%, black 50%, rgba(0,0,0,0.368) 62.5%, rgba(0,0,0,0.135) 75%, rgba(0,0,0,0.050) 87.5%, transparent 100%)";
const EDGE_MASK = "linear-gradient(90deg, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)";

function yearCenter(i: number) {
  return PAD + (i + 0.5) * YEAR_W;
}

function YearLabel({ year, leftPx, isActive, isHovered }: { year: number; leftPx: number; isActive: boolean; isHovered: boolean }) {
  const hover = !isActive && isHovered;
  return (
    <motion.span
      initial={false}
      animate={{
        color: isActive ? ACTIVE_COLOR : hover ? "var(--color-accent-foreground)" : "var(--color-caption-foreground)",
      }}
      transition={isActive ? LABEL_ACTIVE : hover ? LABEL_HOVER : LABEL_REST}
      style={{ left: `${leftPx}px` }}
      className="absolute bottom-full -translate-x-1/2 -translate-y-3.5 whitespace-nowrap text-overline"
    >
      {year}
    </motion.span>
  );
}

const Line = memo(function Line({ xMv, scaleXMv, color }: { xMv: MotionValue<number>; scaleXMv: MotionValue<number>; color: string }) {
  return (
    <motion.span
      className="absolute top-0 block"
      style={{ backgroundColor: color, height: "48px", left: 0, scaleX: scaleXMv, width: "1px", x: xMv }}
    />
  );
});

type LineGeometry = { scaleXs: MotionValue<number>[]; xs: MotionValue<number>[] };

function edgeFade(x: number, width: number) {
  const right = width - PAD;
  if (x >= PAD && x <= right) return 1;
  const d = x < PAD ? PAD - x : x - right;
  if (d >= 40) return 0;
  const t = 1 - d / 40;
  return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
}

function useLineGeometry({
  stripWidth,
  activeCenter,
  activeStrength,
  hoverCenter,
  hoverStrength,
}: {
  stripWidth: number;
  activeCenter: MotionValue<number>;
  activeStrength: MotionValue<number>;
  hoverCenter: MotionValue<number>;
  hoverStrength: MotionValue<number>;
}) {
  const geo = useRef<Geometry | null>(null);
  if (geo.current === null || geo.current.densityBase.length !== stripWidth) {
    geo.current = {
      cdfBase: Array(stripWidth),
      cdfFull: Array(stripWidth),
      densityBase: Array(stripWidth),
      densityFull: Array(stripWidth),
      positionsBase: Array(LINES),
      positionsFull: Array(LINES),
    };
    layout(stripWidth, 0, 0, geo.current);
  }
  const lines = useRef<LineGeometry | null>(null);
  if (lines.current === null) {
    const pos = geo.current.positionsBase;
    const center = activeCenter.get();
    const strength = 0.95 * activeStrength.get();
    lines.current = {
      scaleXs: Array.from({ length: LINES }, (_, i) => motionValue(1 + strength * bump((pos[i] - center) / YEAR_W))),
      xs: Array.from({ length: LINES }, (_, i) => motionValue(pos[i])),
    };
  }
  const out = lines.current;
  const update = useCallback(() => {
    const g = geo.current;
    if (!g) return;
    const aCenter = activeCenter.get();
    const aStrength = activeStrength.get();
    const hCenter = hoverCenter.get();
    const hStrength = hoverStrength.get();
    layout(stripWidth, hCenter, hStrength, g);
    for (let i = 0; i < LINES; i++) {
      const base = g.positionsBase[i];
      const full = g.positionsFull[i];
      const k = falloff(base - hCenter);
      const x = full * k + base * (1 - k);
      out.xs[i].set(x);
      const near = falloff(x - hCenter);
      const hover = 1.9 * hStrength * edgeFade(x, stripWidth);
      const active = 0.95 * aStrength;
      const s = Math.min(hover * near + active * bump((x - aCenter) / YEAR_W), Math.max(hover, active));
      out.scaleXs[i].set(1 + s);
    }
  }, [stripWidth, activeCenter, activeStrength, hoverCenter, hoverStrength, out]);
  useMotionValueEvent(activeCenter, "change", update);
  useMotionValueEvent(activeStrength, "change", update);
  useMotionValueEvent(hoverCenter, "change", update);
  useMotionValueEvent(hoverStrength, "change", update);
  useLayoutEffect(() => {
    update();
  }, [update]);
  return out;
}

function BaseLines({ stripWidth, lineGeometry }: { stripWidth: number; lineGeometry: LineGeometry }) {
  return (
    <div aria-hidden="true" className="relative shrink-0" style={{ height: "48px", width: `${stripWidth}px` }}>
      {lineGeometry.xs.map((x, i) => (
        <Line key={i} xMv={x} scaleXMv={lineGeometry.scaleXs[i]} color="var(--color-subtle-stroke)" />
      ))}
    </div>
  );
}

function Window({
  stripWidth,
  center,
  opacity,
  mask,
  color,
  lineGeometry,
}: {
  stripWidth: number;
  center: MotionValue<number>;
  opacity: MotionValue<number>;
  mask: string;
  color: string;
  lineGeometry: LineGeometry;
}) {
  const x = useTransform(center, (c) => c - YEAR_W);
  const inner = useTransform(x, (v) => -v);
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 overflow-hidden"
      style={{
        left: 0,
        maskImage: mask,
        maskPosition: "0 0",
        maskRepeat: "no-repeat",
        maskSize: "288px 100%",
        opacity,
        WebkitMaskImage: mask,
        WebkitMaskPosition: "0 0",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "288px 100%",
        width: "288px",
        x,
      }}
    >
      <motion.div className="absolute inset-y-0 left-0" style={{ height: "48px", width: `${stripWidth}px`, x: inner }}>
        {lineGeometry.xs.map((mv, i) => (
          <Line key={i} xMv={mv} scaleXMv={lineGeometry.scaleXs[i]} color={color} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function HoverWindow({ stripWidth, hoverCenter, hoverStrength, lineGeometry }: { stripWidth: number; hoverCenter: MotionValue<number>; hoverStrength: MotionValue<number>; lineGeometry: LineGeometry }) {
  const opacity = useTransform(hoverStrength, (s) => 0.45 * s);
  return <Window stripWidth={stripWidth} center={hoverCenter} opacity={opacity} mask={HOVER_MASK} color="var(--color-strong-stroke)" lineGeometry={lineGeometry} />;
}

function ActiveWindow({ stripWidth, activeCenter, activeStrength, lineGeometry }: { stripWidth: number; activeCenter: MotionValue<number>; activeStrength: MotionValue<number>; lineGeometry: LineGeometry }) {
  return <Window stripWidth={stripWidth} center={activeCenter} opacity={activeStrength} mask={ACTIVE_MASK} color={ACTIVE_COLOR} lineGeometry={lineGeometry} />;
}

function clickPlan(steps: number) {
  const clicks = Math.min(6 * steps, 18);
  return { animationDuration: clicks > 0 ? clicks / 30 : 0, clicks };
}

type Stopper = { stop: () => void; target?: number };

function useActiveMover(active: MotionValue<number>) {
  const running = useRef<Stopper | null>(null);
  const move = useCallback(
    (to: number, duration: number) => {
      if (running.current?.target === to) return;
      running.current?.stop();
      if (duration <= 0 || active.get() === to) {
        active.set(to);
        running.current = null;
        return;
      }
      const anim = animate(active, to, { bounce: 0.18, duration, type: "spring" });
      running.current = { stop: () => anim.stop(), target: to };
      void anim.then(() => {
        if (running.current?.target === to) running.current = null;
      });
    },
    [active],
  );
  return [running, move] as const;
}

function DesktopTicker({ allYears, currentYear, className }: { allYears: number[]; currentYear: number; className?: string }) {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const click = useClickSound(TICK_SOUND);
  const stripWidth = 760 + YEAR_W * allYears.length;
  const currentIndex = allYears.indexOf(currentYear);
  const activeIndex = pendingIndex ?? currentIndex;
  const start = yearCenter(currentIndex >= 0 ? currentIndex : 0);
  const activeCenter = useMotionValue(start);
  const activeStrength = useMotionValue(1);
  const hoverTarget = useMotionValue(start);
  const hoverCenter = useSpring(hoverTarget, HOVER_SPRING);
  const hoverStrength = useMotionValue(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const strengthAnim = useRef<Stopper | null>(null);
  const [activeAnim, moveActive] = useActiveMover(activeCenter);
  const target = yearCenter(currentIndex >= 0 ? currentIndex : 0);

  useEffect(() => {
    // Settle onto the route's year (after a navigation between years).
    setPendingIndex(null);
    const from = activeCenter.get();
    if (from === target || activeAnim.current?.target === target) return;
    const { animationDuration } = clickPlan(Math.abs(target - from) / YEAR_W);
    moveActive(target, animationDuration);
  }, [target, activeCenter, moveActive, activeAnim]);

  useEffect(
    () => () => {
      activeAnim.current?.stop();
      strengthAnim.current?.stop();
    },
    [activeAnim],
  );

  const inside = useRef(false);
  const fadeHover = useCallback(
    (to: number) => {
      strengthAnim.current?.stop();
      const anim = animate(hoverStrength, to, { duration: to > 0 ? 0.55 : 0.5, ease: STRENGTH_EASE });
      strengthAnim.current = { stop: () => anim.stop() };
    },
    [hoverStrength],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = stripRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const rel = px - PAD;
      const span = YEAR_W * allYears.length;
      let to = px;
      if (rel >= 0 && rel < span) {
        const i = Math.floor(rel / YEAR_W);
        if (py < 0) to = yearCenter(i);
        const y = allYears[i];
        setHoveredYear((prev) => (prev === y ? prev : y));
      } else setHoveredYear((prev) => (prev === null ? prev : null));
      if (!inside.current) {
        inside.current = true;
        if (hoverStrength.get() < 0.05) hoverCenter.jump(to);
        fadeHover(1);
      }
      hoverTarget.set(to);
    },
    [allYears, hoverCenter, hoverTarget, hoverStrength, fadeHover],
  );

  const onPointerLeave = useCallback(() => {
    inside.current = false;
    setHoveredYear(null);
    fadeHover(0);
  }, [fadeHover]);

  const geometry = useLineGeometry({ activeCenter, activeStrength, hoverCenter, hoverStrength, stripWidth });

  return (
    <div className={className ? `relative ${className}` : "relative"}>
      <div className="flex w-full items-end justify-center overflow-hidden pt-8 pb-9" style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}>
        <div ref={stripRef} className="relative" style={{ height: "48px", width: `${stripWidth}px` }}>
          {allYears.map((y, i) => (
            <YearLabel key={y} year={y} leftPx={yearCenter(i)} isActive={i === activeIndex} isHovered={y === hoveredYear} />
          ))}
          <BaseLines stripWidth={stripWidth} lineGeometry={geometry} />
          <HoverWindow stripWidth={stripWidth} hoverCenter={hoverCenter} hoverStrength={hoverStrength} lineGeometry={geometry} />
          <ActiveWindow stripWidth={stripWidth} activeCenter={activeCenter} activeStrength={activeStrength} lineGeometry={geometry} />
          <div className="absolute" style={{ height: "80px", left: 0, top: "-32px", width: `${stripWidth}px` }} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
            <div className="absolute flex" style={{ height: "80px", left: "380px", top: 0, width: `${YEAR_W * allYears.length}px` }}>
              {allYears.map((y, i) => (
                <Link
                  key={y}
                  href={`/changelog/${y}`}
                  scroll={false}
                  aria-label={`Browse changelog for ${y}`}
                  aria-current={y === currentYear ? "page" : undefined}
                  onClick={() => {
                    if (i === activeIndex) return;
                    const { clicks, animationDuration } = clickPlan(Math.abs(i - currentIndex));
                    setPendingIndex(i);
                    moveActive(yearCenter(i), animationDuration);
                    if (clicks > 0) click(clicks, { animationDuration, timeEase });
                  }}
                  className="flex-1"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PAN_SPRING = { damping: 35, stiffness: 500, type: "spring" as const };

function MobileTicker({ allYears, currentYear, className }: { allYears: number[]; currentYear: number; className?: string }) {
  const router = useRouter();
  const click = useClickSound(TICK_SOUND);
  const stripWidth = 760 + YEAR_W * allYears.length;
  const currentIndex = Math.max(0, allYears.indexOf(currentYear));
  const offsetFor = useCallback((i: number) => stripWidth / 2 - yearCenter(i), [stripWidth]);
  const restOffset = offsetFor(currentIndex);
  const center = yearCenter(currentIndex);
  const x = useMotionValue(restOffset);
  const panAnim = useRef<Stopper | null>(null);
  const lastIndex = useRef(0);
  const panning = useRef(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const activeIndex = pendingIndex ?? currentIndex;
  const activeCenter = useMotionValue(center);
  const activeStrength = useMotionValue(1);
  const hoverTarget = useMotionValue(center);
  const hoverCenter = useSpring(hoverTarget, HOVER_SPRING);
  const hoverStrength = useMotionValue(0);
  const [activeAnim, moveActive] = useActiveMover(activeCenter);
  const strengthAnim = useRef<Stopper | null>(null);

  const slideTo = useCallback(
    (to: number) => {
      panAnim.current?.stop();
      if (x.get() === to) return;
      const anim = animate(x, to, PAN_SPRING);
      panAnim.current = { stop: () => anim.stop() };
    },
    [x],
  );

  useEffect(() => {
    if (panning.current) return;
    setPendingIndex(null);
    slideTo(restOffset);
  }, [restOffset, slideTo]);

  useEffect(() => {
    const from = activeCenter.get();
    if (from === center || activeAnim.current?.target === center) return;
    const { animationDuration } = clickPlan(Math.abs(center - from) / YEAR_W);
    moveActive(center, animationDuration);
  }, [center, activeCenter, moveActive, activeAnim]);

  useEffect(
    () => () => {
      panAnim.current?.stop();
      activeAnim.current?.stop();
      strengthAnim.current?.stop();
    },
    [activeAnim],
  );

  useEffect(() => {
    strengthAnim.current?.stop();
    const on = hoveredYear !== null;
    if (on) {
      const i = allYears.indexOf(hoveredYear);
      if (i >= 0) hoverTarget.set(yearCenter(i));
    }
    const anim = animate(hoverStrength, on ? 1 : 0, { duration: on ? 0.55 : 0.5, ease: STRENGTH_EASE });
    strengthAnim.current = { stop: () => anim.stop() };
  }, [hoveredYear, allYears, hoverTarget, hoverStrength]);

  const nearest = useCallback(
    (offset: number) => {
      let best = 0;
      let dist = Infinity;
      for (let i = 0; i < allYears.length; i++) {
        const d = Math.abs(offset - offsetFor(i));
        if (d < dist) {
          dist = d;
          best = i;
        }
      }
      return best;
    },
    [allYears, offsetFor],
  );

  const onPan = useCallback(
    (_e: PointerEvent, info: PanInfo) => {
      const first = !panning.current;
      if (first) {
        panAnim.current?.stop();
        panning.current = true;
      }
      const offset = offsetFor(currentIndex) + info.offset.x;
      x.set(offset);
      const i = nearest(offset);
      if (first) lastIndex.current = i;
      if (i !== lastIndex.current) {
        click(Math.min(Math.abs(i - lastIndex.current), 3), { animationDuration: 0.1 });
        lastIndex.current = i;
      }
      setHoveredYear(allYears[i]);
    },
    [allYears, currentIndex, offsetFor, x, click, nearest],
  );

  const onPanEnd = useCallback(() => {
    panning.current = false;
    const i = nearest(x.get());
    setPendingIndex(i);
    slideTo(offsetFor(i));
    setHoveredYear(allYears[i]);
    if (allYears[i] !== currentYear) {
      const { clicks, animationDuration } = clickPlan(Math.abs(i - currentIndex));
      moveActive(yearCenter(i), animationDuration);
      if (clicks > 0) click(clicks, { animationDuration, bypassSingleVoiceGate: true, timeEase });
      router.push(`/changelog/${allYears[i]}`, { scroll: false });
    }
  }, [allYears, x, currentYear, currentIndex, offsetFor, router, nearest, slideTo, moveActive, click]);

  const geometry = useLineGeometry({ activeCenter, activeStrength, hoverCenter, hoverStrength, stripWidth });

  return (
    <div className={className ? `relative ${className}` : "relative"}>
      <div className="relative flex w-full items-end overflow-hidden pt-8 pb-9" style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}>
        <span aria-hidden="true" className="invisible w-px shrink-0" style={{ height: "48px" }} />
        <motion.div
          className="absolute bottom-9 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
          style={{ height: "48px", touchAction: "pan-y", width: `${stripWidth}px`, x }}
          onPan={onPan}
          onPanEnd={onPanEnd}
        >
          {allYears.map((y, i) => (
            <YearLabel key={y} year={y} leftPx={yearCenter(i)} isActive={i === activeIndex} isHovered={y === hoveredYear} />
          ))}
          <BaseLines stripWidth={stripWidth} lineGeometry={geometry} />
          <HoverWindow stripWidth={stripWidth} hoverCenter={hoverCenter} hoverStrength={hoverStrength} lineGeometry={geometry} />
          <ActiveWindow stripWidth={stripWidth} activeCenter={activeCenter} activeStrength={activeStrength} lineGeometry={geometry} />
          <div className="absolute flex" style={{ height: "80px", left: "380px", top: "-32px", width: `${YEAR_W * allYears.length}px` }}>
            {allYears.map((y, i) => (
              <button
                key={y}
                type="button"
                aria-label={`Browse changelog for ${y}`}
                aria-current={y === currentYear ? "page" : undefined}
                onMouseEnter={() => {
                  if (!panning.current) setHoveredYear(y);
                }}
                onMouseLeave={() => {
                  if (!panning.current) setHoveredYear((prev) => (prev === y ? null : prev));
                }}
                onClick={() => {
                  if (i === activeIndex) return;
                  const { clicks, animationDuration } = clickPlan(Math.abs(i - currentIndex));
                  setPendingIndex(i);
                  slideTo(offsetFor(i));
                  moveActive(yearCenter(i), animationDuration);
                  if (clicks > 0) click(clicks, { animationDuration, timeEase });
                  router.push(`/changelog/${y}`, { scroll: false });
                }}
                className="flex-1 cursor-pointer"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function YearTicker({ allYears, currentYear, className }: { allYears: number[]; currentYear: number; className?: string }) {
  const years = [...allYears].sort((a, b) => a - b);
  return (
    <nav aria-label="Browse changelog by year" className={className ? `relative ${className}` : "relative"}>
      <DesktopTicker allYears={years} currentYear={currentYear} className="hidden lg:block" />
      <MobileTicker allYears={years} currentYear={currentYear} className="lg:hidden" />
    </nav>
  );
}
