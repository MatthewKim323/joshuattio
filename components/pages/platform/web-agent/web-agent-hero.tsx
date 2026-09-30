"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useInView } from "motion/react";
import { SOURCE_MARKS } from "./hero-marks";

// Web research hero: the kicker pill sits alone, a grid fades in, sweeps run
// out to every source on the open web and back, the chips light up as each
// sweep lands, then the pill flies into the copy and the grid lifts away.
// Once settled, a random source sends a pulse down its route every 2.5s.

const easeInOutCubic = (e: number) => (e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2);
const easeOutCubic = (e: number) => 1 - (1 - e) ** 3;

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function useReduce() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduce;
}

type Pt = [number, number];
type Route = { delay: number; domain: string; to: Pt };
type Source = Route & { d: string; from: Pt; length: number };
type Scene = {
  center: Pt;
  height: number;
  maskRadius: number;
  routes: Route[];
  sources: Source[];
  viewBox: string;
  width: number;
};
type Pulse = { domain: string; id: number; side: "left" | "right" };

function makeScene({ width, height, maskRadius, routes }: { width: number; height: number; maskRadius: number; routes: Route[] }): Scene {
  const c: Pt = [width / 2, height / 2];
  const sources = routes.map(({ to, ...rest }) => ({
    ...rest,
    d: `M ${c[0]} ${c[1]} L ${to[0]} ${c[1]} L ${to[0]} ${to[1]}`,
    from: c,
    length: Math.abs(to[0] - c[0]) + Math.abs(to[1] - c[1]),
    to,
  }));
  return { center: [width / 2, height / 2], height, maskRadius, routes, sources, viewBox: `0 0 ${width} ${height}`, width };
}

const DESKTOP = makeScene({
  height: 480,
  maskRadius: 380,
  routes: [
    { delay: 0.1, domain: "wikipedia.org", to: [880, 160] },
    { delay: 0.2, domain: "forbes.com", to: [800, 120] },
    { delay: 0.45, domain: "bloomberg.com", to: [480, 200] },
    { delay: 0.3, domain: "ycombinator.com", to: [320, 160] },
    { delay: 0.55, domain: "g2.com", to: [1e3, 280] },
    { delay: 0.65, domain: "crunchbase.com", to: [880, 360] },
    { delay: 0.35, domain: "github.com", to: [320, 280] },
    { delay: 0.8, domain: "techcrunch.com", to: [440, 400] },
    { delay: 0.7, domain: "producthunt.com", to: [320, 480] },
    { delay: 0.15, domain: "glassdoor.com", to: [760, 480] },
  ],
  width: 1280,
});

const MOBILE = makeScene({
  height: 480,
  maskRadius: 480,
  routes: [
    { delay: 0.1, domain: "wikipedia.org", to: [400, 120] },
    { delay: 0.3, domain: "github.com", to: [280, 80] },
    { delay: 0.15, domain: "crunchbase.com", to: [440, 480] },
    { delay: 0.5, domain: "ycombinator.com", to: [280, 480] },
  ],
  width: 720,
});

const STAGES = ["hidden", "grid", "active", "out", "back", "arrive", "lift"] as const;
type Stage = (typeof STAGES)[number];
const LINE = "var(--color-subtle-stroke)";
const EASE = [0.65, 0, 0.35, 1] as const;
const EASE_CSS = `cubic-bezier(${EASE.join(",")})`;
const ARRIVE_AT = (2 - Math.cbrt(0.8571428571428572)) / 2;

// Pulse that runs round the pill outline, left or right half.
function KickerPulse({ side, width, height, onComplete }: { side: "left" | "right"; width: number; height: number; onComplete: () => void }) {
  const n = width - 0.5;
  const s = height - 0.5;
  const mid = height / 2;
  const paths = [
    `M 0.5 ${mid} V 13 A 12.5 12.5 0 0 1 13 0.5 H ${n - 12.5} A 12.5 12.5 0 0 1 ${n} 13 V ${mid}`,
    `M 0.5 ${mid} V ${s - 12.5} A 12.5 12.5 0 0 0 13 ${s} H ${n - 12.5} A 12.5 12.5 0 0 0 ${n} ${s - 12.5} V ${mid}`,
  ];
  return (
    <svg aria-hidden="true" data-kicker-pulse={side} width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" className="pointer-events-none absolute -inset-px">
      <motion.g
        transform={side === "right" ? `translate(${width} 0) scale(-1 1)` : undefined}
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: 1, times: [0, 0.8, 1] }}
        onAnimationComplete={onComplete}
      >
        {paths.map((d) =>
          Array.from({ length: 24 }, (_, i) => (
            <motion.path
              key={`${d}-${i}`}
              d={d}
              pathLength={1}
              stroke="var(--color-blue-500)"
              strokeWidth={1}
              strokeOpacity={(1 - i / 24) ** 2}
              strokeDasharray={`${0.024999999999999998} 2`}
              initial={{ strokeDashoffset: 0.020833333333333332 * i }}
              animate={{ strokeDashoffset: -1.5 + 0.020833333333333332 * i }}
              transition={{ duration: 1, ease: easeOutCubic }}
            />
          )),
        )}
      </motion.g>
    </svg>
  );
}

function SourceChip({
  domain,
  offsetX,
  offsetY,
  appearDelay,
  litDelay,
  released,
  reduce,
  interactive,
  signalId,
  onPulse,
}: {
  domain: string;
  offsetX: number;
  offsetY: number;
  appearDelay: number;
  litDelay: number;
  released: boolean;
  reduce: boolean;
  interactive: boolean;
  signalId: number | undefined;
  onPulse: () => void;
}) {
  const [lit, setLit] = useState(false);
  const [signal, setSignal] = useState(false);
  useEffect(() => {
    if (signalId === undefined) return;
    setSignal(true);
    const t = setTimeout(() => setSignal(false), 350);
    return () => clearTimeout(t);
  }, [signalId]);
  useEffect(() => {
    if (reduce || released) return;
    const t = setTimeout(() => setLit(true), 1e3 * litDelay);
    return () => clearTimeout(t);
  }, [litDelay, reduce, released]);
  const on = (lit && !released) || signal;
  const dim = released && !on;
  const mark = SOURCE_MARKS[domain];
  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{ transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))` }}
      initial={!reduce && { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: reduce ? 0 : appearDelay, duration: reduce ? 0 : 0.4, ease: "easeOut" }}
    >
      <button
        type="button"
        disabled={!interactive}
        aria-label={`Trace source from ${domain}`}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse" && interactive) onPulse();
        }}
        onFocus={() => {
          if (interactive) onPulse();
        }}
        onClick={onPulse}
        className={cx(
          "group pointer-events-auto relative flex cursor-default items-center gap-1.5 border",
          !on && !dim && "border-subtle-stroke",
          "bg-primary-background py-1 pr-1.5 pl-1 font-mono text-[11px]/[1.4em]",
          !on && !dim && "text-tertiary-foreground",
          "max-[360px]:text-[10px]",
          "after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2",
          "outline-none transition-[border-color,color,box-shadow] duration-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-joshuattio-1 focus-visible:border-blue-300 focus-visible:text-blue-600 focus-visible:ring-2 focus-visible:ring-focus-ring",
          on && "border-blue-300 text-blue-600",
          dim && "border-subtle-stroke/50 text-tertiary-foreground/55",
          signal && "shadow-joshuattio-1",
        )}
      >
        {mark ? (
          <svg
            width="14"
            height="14"
            viewBox={mark.viewBox}
            fill="none"
            aria-hidden={true}
            className={cx(
              "size-3.5 shrink-0",
              !on && "grayscale",
              "transition-[filter,opacity] duration-200 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0",
              on && "grayscale-0",
              dim && "opacity-40",
            )}
          >
            <path d={mark.d} fill={mark.fill} />
          </svg>
        ) : null}
        <span className="whitespace-nowrap">{domain}</span>
      </button>
    </motion.div>
  );
}

// A comet of 64 dashes running along a route from the source into the pill.
function RoutePulse({ pulse, path, scale, onArrive, onComplete }: { pulse: Pulse; path: string; scale: number; onArrive: (p: Pulse) => void; onComplete: (id: number) => void }) {
  const arrived = useRef(false);
  return (
    <motion.g
      data-source-pulse={pulse.domain}
      onAnimationComplete={() => onComplete(pulse.id)}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.4, times: [0, 0.08, 0.88, 1] }}
    >
      {Array.from({ length: 64 }, (_, s) => (
        <motion.path
          key={s}
          d={path}
          stroke="var(--color-blue-500)"
          strokeWidth={1 / scale}
          strokeOpacity={(1 - s / 64) ** 2}
          pathLength={1}
          strokeDasharray="0.0047 2"
          initial={{ strokeDashoffset: -1 - 0.0045 * s }}
          animate={{ strokeDashoffset: 0.3 - 0.0045 * s }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          onUpdate={
            s === 0
              ? (latest: { strokeDashoffset?: unknown }) => {
                  const t = latest.strokeDashoffset;
                  if (!arrived.current && typeof t === "number" && t >= 0) {
                    arrived.current = true;
                    onArrive(pulse);
                  }
                }
              : undefined
          }
        />
      ))}
    </motion.g>
  );
}

function Routes({
  routes,
  lineColor,
  scale,
  pulses,
  onPulseArrive,
  onPulseComplete,
  reduce,
  delay,
  visible,
}: {
  routes: (Source & { finalD: string })[];
  lineColor: string;
  scale: number;
  pulses: Pulse[];
  onPulseArrive: (p: Pulse) => void;
  onPulseComplete: (id: number) => void;
  reduce: boolean;
  delay: number;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <>
      <motion.path
        d={routes.map((e) => e.finalD).join(" ")}
        stroke={lineColor}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        initial={!reduce && { opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: reduce ? 0 : delay, duration: reduce ? 0 : 0.5 }}
      />
      {pulses.map((p) => {
        const r = routes.find((e) => e.domain === p.domain);
        return r ? <RoutePulse key={p.id} pulse={p} path={r.finalD} scale={scale} onArrive={onPulseArrive} onComplete={onPulseComplete} /> : null;
      })}
    </>
  );
}

const SWEEP_STOPS = [
  { animate: "100%", color: "var(--color-blue-200)", initial: "-75%", opacity: 0 },
  { animate: "175%", color: "var(--color-blue-500)", initial: "0%", opacity: 1 },
  { animate: "175.1%", color: "var(--color-blue-500)", initial: "0.1%", opacity: 0 },
];

function Sweep({ d, from, to, delay, duration }: { d: string; from: Pt; to: Pt; delay: number; duration: number }) {
  const id = useId();
  return (
    <>
      <defs>
        <motion.linearGradient id={id} gradientUnits="userSpaceOnUse" x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}>
          {SWEEP_STOPS.map((e, r) => (
            <motion.stop
              key={r}
              initial={{ offset: e.initial }}
              animate={{ offset: e.animate }}
              transition={{ delay, duration, ease: easeInOutCubic }}
              stopColor={e.color}
              stopOpacity={e.opacity}
            />
          ))}
        </motion.linearGradient>
      </defs>
      <path d={d} stroke={`url(#${id})`} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

const RINGS = [
  { base: 0.9, className: "-inset-2 rounded-[21px]" },
  { base: 0.6, className: "-inset-4 rounded-[29px]" },
  { base: 0.35, className: "-inset-6 rounded-[37px]" },
];
const RING_TIMES = [0, 0.45, 1];

function Kicker({
  label,
  children,
  accent,
  ringPhase = "hidden",
  intro = false,
  flightDuration,
  className,
}: {
  label: string;
  children?: ReactNode;
  accent: "off" | "on" | "fading";
  ringPhase?: "hidden" | "shown" | "gone";
  intro?: boolean;
  flightDuration: number;
  className?: string;
}) {
  const on = accent === "on";
  return (
    <motion.div
      layoutId="web-agent-kicker-pill"
      data-hero-kicker={intro ? "intro" : "final"}
      transition={{ layout: { duration: flightDuration, ease: EASE }, opacity: { duration: 0.6, ease: "easeOut" } }}
      className={cx(
        "relative flex w-fit items-center rounded-[13px] border border-weak-stroke bg-primary-background px-3 py-1.5 font-medium text-[13px]/[1.4em] text-secondary-foreground",
        className,
      )}
      initial={!!intro && { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {accent !== "off" && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[inherit]"
          initial={{ opacity: 1 }}
          animate={{ opacity: on ? 1 : 0 }}
          transition={{ duration: 0.4, ease: easeOutCubic }}
        >
          {RINGS.map((e, r) => (
            <motion.span
              key={e.className}
              className={cx("absolute border border-blue-300", e.className)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={ringPhase === "shown" ? { opacity: [0, 1, e.base], scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={
                ringPhase === "shown"
                  ? { delay: 0.18 * r, duration: 0.55, ease: easeOutCubic, times: RING_TIMES }
                  : { delay: ringPhase === "gone" ? (RINGS.length - 1 - r) * 0.18 : 0, duration: 0.35, ease: easeOutCubic }
              }
            />
          ))}
          <motion.span
            className="absolute inset-0 rounded-[inherit] border border-blue-300 shadow-joshuattio-4"
            initial={!!on && { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: easeOutCubic }}
          />
        </motion.div>
      )}
      {children}
      {label}
    </motion.div>
  );
}

function Sweeps({ scene, outStarted, backStarted, reduce }: { scene: Scene; outStarted: boolean; backStarted: boolean; reduce: boolean }) {
  return (
    <>
      {outStarted &&
        !reduce &&
        scene.sources.map((e, a) => <Sweep key={a} d={e.d} from={e.from} to={e.to} delay={0.6 * e.delay} duration={e.length / 420} />)}
      {backStarted && !reduce && scene.sources.map((e, a) => <Sweep key={a} d={e.d} from={e.to} to={e.from} delay={0} duration={0.9} />)}
    </>
  );
}

function RevealMask({ id, scene, height, visible, duration }: { id: string; scene: Scene; height: number; visible: boolean; duration: number }) {
  return (
    <>
      <radialGradient id={`${id}-reveal-gradient`}>
        <stop offset="55%" stopColor="white" />
        <stop offset="100%" stopColor="black" />
      </radialGradient>
      <mask id={`${id}-reveal`} maskUnits="userSpaceOnUse" x={0} y={0} width={scene.width} height={height}>
        <motion.circle
          cx={scene.center[0]}
          cy={scene.center[1]}
          fill={`url(#${id}-reveal-gradient)`}
          initial={{ r: 0 }}
          animate={{ r: visible ? Math.hypot(scene.width, height) : 0 }}
          transition={{ duration, ease: easeOutCubic }}
        />
      </mask>
    </>
  );
}

function HeroCopy({ children, visible }: { children: ReactNode; visible: boolean }) {
  return (
    <div
      className="w-full [&_*]:[animation-play-state:inherit]"
      data-hero-copy=""
      inert={!visible}
      style={{ animationPlayState: visible ? "running" : "paused", visibility: visible ? "visible" : "hidden" }}
    >
      {children}
    </div>
  );
}

function fitScene(size: { width: number; height: number }): Scene {
  if (!size.width) return DESKTOP;
  const base = size.width < 1024 ? MOBILE : DESKTOP;
  const scale = Math.max(size.width / base.width, size.height / base.height);
  const reach = 40 * Math.floor((size.width / 2 - 70) / (40 * scale));
  const cx0 = base.center[0];
  return makeScene({
    ...base,
    routes: base.routes.map((e) => ({
      ...e,
      to: [cx0 + Math.max(-reach, Math.min(reach, e.to[0] - cx0)), e.to[1] - 40] as Pt,
    })),
  });
}

function usePulses({ scene, lifted, reduce, inView }: { scene: Scene; lifted: boolean; reduce: boolean; inView: boolean }) {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [kickerPulses, setKickerPulses] = useState<Pulse[]>([]);
  const seq = useRef(0);
  const center = scene.center[0];
  const sendPulse = useCallback(
    (e: Source) => {
      const id = ++seq.current;
      setPulses((a) => [...a, { domain: e.domain, id, side: e.to[0] < center ? "left" : "right" }]);
    },
    [center],
  );
  const onPulseArrive = useCallback((e: Pulse) => {
    setKickerPulses((t) => [...t, e]);
  }, []);
  const onPulseComplete = useCallback((e: number) => {
    setPulses((t) => t.filter((t) => t.id !== e));
  }, []);
  const onKickerPulseComplete = useCallback((e: number) => {
    setKickerPulses((t) => t.filter((t) => t.id !== e));
  }, []);
  useEffect(() => {
    const keep = new Set(scene.sources.map((e) => e.domain));
    setPulses((e) => e.filter((e) => keep.has(e.domain)));
  }, [scene.sources]);
  useEffect(() => {
    if (!lifted || reduce || !inView) return;
    const i = setInterval(() => {
      if (document.visibilityState === "visible") sendPulse(scene.sources[Math.floor(Math.random() * scene.sources.length)]);
    }, 2500);
    return () => clearInterval(i);
  }, [lifted, reduce, inView, scene.sources, sendPulse]);
  return { pulses, kickerPulses, sendPulse, onPulseArrive, onPulseComplete, onKickerPulseComplete };
}

export function WebAgentHero({ label, header, flightDuration }: { label: string; header: ReactNode; flightDuration: number }) {
  const reduce = useReduce();
  const [stage, setStage] = useState<Stage>("hidden");
  const gridId = useId();
  const copyRef = useRef<HTMLDivElement>(null);
  const [{ kickerY, kickerWidth, kickerHeight, copyCenterY, copyHeight }, setMeasure] = useState({
    copyCenterY: 0,
    copyHeight: 0,
    kickerHeight: 0,
    kickerWidth: 0,
    kickerY: 0,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef);
  const [size, setSize] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      setSize({ height, width });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const measured = size.width > 0;
  const scene = useMemo(() => fitScene(size), [size]);
  const W = measured ? Math.max(size.width / scene.width, size.height / scene.height) : 1;

  useEffect(() => {
    if (!measured) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setStage("lift");
      return;
    }
    const timers = (
      [
        ["grid", 0],
        ["active", 1050],
        ["out", 1350],
        ["back", 2850],
        ["arrive", 2850 + 0.9 * ARRIVE_AT * 1e3],
        ["lift", 3950],
      ] as [Stage, number][]
    ).map(([s, t]) => setTimeout(() => setStage(s), t));
    const onChange = () => {
      if (mq.matches) {
        timers.forEach(clearTimeout);
        setStage("lift");
      }
    };
    mq.addEventListener("change", onChange);
    return () => {
      timers.forEach(clearTimeout);
      mq.removeEventListener("change", onChange);
    };
  }, [measured]);

  const U = STAGES.indexOf(stage);
  const gridOn = U >= STAGES.indexOf("grid");
  const outStarted = U >= STAGES.indexOf("out");
  const backStarted = U >= STAGES.indexOf("back");
  const arrived = U >= STAGES.indexOf("arrive");
  const lifted = stage === "lift";

  const { pulses, kickerPulses, sendPulse, onPulseArrive, onPulseComplete, onKickerPulseComplete } = usePulses({
    inView,
    lifted,
    reduce,
    scene,
  });

  useLayoutEffect(() => {
    const copy = copyRef.current;
    const root = rootRef.current;
    if (!copy || !root || !lifted) return;
    const measure = () => {
      const kicker = copy.querySelector('[data-hero-kicker="final"]');
      if (!kicker) return;
      const c = copy.getBoundingClientRect();
      const k = kicker.getBoundingClientRect();
      const top = c.top - root.getBoundingClientRect().top;
      setMeasure({
        copyCenterY: top + c.height / 2,
        copyHeight: c.height,
        kickerHeight: k.height,
        kickerWidth: k.width,
        kickerY: top + k.height / 2,
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(copy);
    ro.observe(root);
    measure();
    return () => ro.disconnect();
  }, [lifted]);

  const flight = reduce ? 0 : flightDuration;
  const revealDuration = reduce ? 0 : 0.65;
  const active = U >= STAGES.indexOf("active");
  const lift = 40 * W;
  const rawY = scene.center[1] + (kickerY - size.height / 2 + lift) / W;
  const snapY = 40 * Math.round(rawY / 40);
  const shift = kickerY > 0 ? (snapY - rawY) * W : 0;
  const fieldH = scene.height + 40;
  const holeY = scene.center[1] + (copyCenterY + shift - size.height / 2 + lift) / W;
  const layer = {
    opacity: lifted ? 0.5 : 1,
    transform: lifted ? `translateY(-${lift}px)` : "translateY(0)",
    transitionDuration: "700ms",
    transitionTimingFunction: EASE_CSS,
  };
  const routes = scene.sources.map((e) => {
    const [t, a] = e.to;
    const r = scene.center[0];
    const start = r + (Math.sign(t - r) * kickerWidth) / 2 / W;
    const cols = Math.floor((size.width / 2 - 4) / (40 * W));
    const lane = a > scene.center[1] ? r + Math.sign(t - r) * cols * 40 : t;
    return { ...e, finalD: `M ${start} ${snapY} H ${lane} V ${a} H ${t}` };
  });

  return (
    <div
      ref={rootRef}
      data-web-agent-hero=""
      data-stage={lifted ? "settled" : stage}
      className="relative h-[calc(100svh-var(--site-header-height))] min-h-160 w-full overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center pb-[8vh]">
        <div ref={copyRef} className="pointer-events-auto w-full">
          <div className="flex w-full flex-col items-center" style={{ transform: `translateY(${shift}px)` }}>
            {lifted && (
              <Kicker label={label} accent="off" className="mb-6" flightDuration={flight}>
                {kickerPulses.map((p) => (
                  <KickerPulse key={p.id} side={p.side} width={kickerWidth} height={kickerHeight} onComplete={() => onKickerPulseComplete(p.id)} />
                ))}
              </Kicker>
            )}
            <HeroCopy visible={lifted}>{header}</HeroCopy>
          </div>
        </div>
      </div>
      {gridOn && !lifted && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <Kicker
            label={label}
            accent={reduce || !active ? "off" : arrived ? "fading" : "on"}
            ringPhase={backStarted ? "gone" : outStarted ? "shown" : "hidden"}
            intro
            flightDuration={flight}
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 z-0 transition-[transform,opacity] motion-reduce:transition-none" style={layer}>
        <motion.svg
          viewBox={scene.viewBox}
          className="absolute inset-0 size-full overflow-visible"
          aria-hidden="true"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          initial={{ opacity: 0 }}
          animate={{ opacity: gridOn ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.7, ease: easeOutCubic }}
        >
          <defs>
            <pattern id={gridId} y={-1 / W} width={40} height={40} patternUnits="userSpaceOnUse">
              <path d="M 40 0 H 0 V 40" stroke={LINE} strokeWidth="1" />
            </pattern>
            <RevealMask id={gridId} scene={scene} height={fieldH} visible={gridOn} duration={revealDuration} />
            <radialGradient id={`${gridId}-hole`}>
              <stop offset="0%" stopColor="black" />
              <stop offset="45%" stopColor="black" />
              <stop offset="100%" stopColor="white" />
            </radialGradient>
            <mask id={`${gridId}-mask`} maskUnits="userSpaceOnUse" x={0} y={0} width={scene.width} height={fieldH}>
              <rect width={scene.width} height={fieldH} fill="white" />
              <motion.ellipse
                cx={scene.center[0]}
                cy={holeY}
                fill={`url(#${gridId}-hole)`}
                initial={{ rx: 0, ry: 0 }}
                animate={lifted ? { rx: scene.maskRadius, ry: copyHeight / 2 / W + 40 } : { rx: 0, ry: 0 }}
                transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
              />
            </mask>
          </defs>
          <g mask={`url(#${gridId}-reveal)`}>
            <rect width={scene.width} height={fieldH} fill={`url(#${gridId})`} mask={`url(#${gridId}-mask)`} />
          </g>
          <Routes
            routes={routes}
            lineColor={LINE}
            scale={W}
            pulses={pulses}
            onPulseArrive={onPulseArrive}
            onPulseComplete={onPulseComplete}
            reduce={reduce}
            delay={flightDuration}
            visible={lifted && kickerY > 0}
          />
          <Sweeps scene={scene} outStarted={outStarted} backStarted={backStarted} reduce={reduce} />
        </motion.svg>
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 transition-[transform,opacity] motion-reduce:transition-none" style={{ ...layer, opacity: 1 }}>
        {outStarted &&
          scene.sources.map((e) => (
            <SourceChip
              key={e.domain}
              interactive={lifted}
              signalId={pulses.findLast((t) => t.domain === e.domain)?.id}
              onPulse={() => sendPulse(e)}
              domain={e.domain}
              offsetX={(e.to[0] - scene.center[0]) * W}
              offsetY={(e.to[1] - scene.center[1]) * W}
              appearDelay={0.6 * e.delay}
              litDelay={0.6 * e.delay + (e.length / 420) * ARRIVE_AT}
              released={backStarted}
              reduce={reduce}
            />
          ))}
      </div>
    </div>
  );
}
