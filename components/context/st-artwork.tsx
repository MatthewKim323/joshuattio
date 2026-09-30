"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";

// Easings (same curves as the rest of the site's motion helpers).
const easeInOutCubic = (e: number) =>
  e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2;
const easeOutCubic = (e: number) => 1 - (1 - e) ** 3;

type Pt = { x: number; y: number };

const SPRING = { damping: 14, mass: 0.5, stiffness: 120 };
const DIRECTIONS: Pt[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 5 / Math.sqrt(89), y: 8 / Math.sqrt(89) },
  { x: 5 / Math.sqrt(89), y: -8 / Math.sqrt(89) },
  { x: -5 / Math.sqrt(89), y: 8 / Math.sqrt(89) },
  { x: -5 / Math.sqrt(89), y: -8 / Math.sqrt(89) },
];
const HIDE = { duration: 0.3, ease: easeInOutCubic };
const ENTRANCE_OFFSETS: Pt[] = [
  { x: 100, y: 160 },
  { x: 200, y: 320 },
  { x: 100, y: -160 },
  { x: 200, y: -320 },
  { x: -100, y: 160 },
  { x: -200, y: 320 },
  { x: -100, y: -160 },
  { x: -200, y: -320 },
  { x: 100, y: 0 },
  { x: 200, y: 0 },
  { x: 300, y: 0 },
  { x: -100, y: 0 },
  { x: -200, y: 0 },
  { x: -300, y: 0 },
  { x: 50, y: 80 },
  { x: 50, y: -80 },
  { x: -50, y: 80 },
  { x: -50, y: -80 },
];

function distToBound(dir: number, pos: number, min: number, max: number) {
  return dir > 0 ? (max - pos) / dir : dir < 0 ? -((pos - min) / dir) : Infinity;
}

// Starts true and resolves after mount, so the first render is the settled state.
function useResolvedReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function useIsTouchScreen() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(pointer: coarse)");
    setTouch(mq.matches);
    const on = (e: MediaQueryListEvent) => setTouch(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return touch;
}

type Shared = {
  entranceSeed: number;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  scatter: MotionValue<number>;
  reduced: boolean;
};

function Dot({ cx, cy }: { cx: number; cy: number }) {
  return (
    <line
      x1={cx}
      y1={cy}
      x2={cx + 0.01}
      y2={cy}
      strokeWidth={5}
      strokeLinecap="square"
      vectorEffect="non-scaling-stroke"
    />
  );
}

function Vertex({
  home,
  index,
  entranceSeed,
  cursorX,
  cursorY,
  scatter,
  reduced,
}: Shared & { home: Pt; index: number }) {
  const start = reduced
    ? { x: 0, y: 0 }
    : ENTRANCE_OFFSETS[(7 * index + 5 * entranceSeed) % ENTRANCE_OFFSETS.length];
  const settled = useMotionValue(+!!reduced);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => settled.set(1), 1000 + 50 * index);
    return () => clearTimeout(t);
  }, [index, reduced, settled]);
  useMotionValueEvent(scatter, "change", (v) => {
    if (v > 0) settled.set(1);
  });

  const offset = (): Pt => {
    const isSettled = settled.get() > 0;
    const amount = scatter.get();
    const dx = home.x - cursorX.get();
    const dy = home.y - cursorY.get();
    if (!isSettled) return start;
    if (amount <= 0) return { x: 0, y: 0 };
    const dist = Math.hypot(dx, dy);
    const reach =
      70 +
      ((7 * home.x + 13 * home.y) % 50) +
      150 * Math.exp(-((dist / 320) * (dist / 320)));
    let best = DIRECTIONS[0];
    let bestLen = 0;
    let bestScore = -Infinity;
    for (const d of DIRECTIONS) {
      const dot = d.x * dx + d.y * dy;
      const len = Math.min(
        reach,
        Math.max(
          Math.min(
            distToBound(d.x, home.x, 240, 1360),
            distToBound(d.y, home.y, 420, 1180),
          ),
          0,
        ),
      );
      const score = len * Math.max(dot, 1);
      if (score > bestScore) {
        bestScore = score;
        best = d;
        bestLen = len;
      }
    }
    return { x: best.x * bestLen * amount, y: best.y * bestLen * amount };
  };

  const tx = useTransform(() => offset().x);
  const ty = useTransform(() => offset().y);
  const x = useSpring(tx, SPRING);
  const y = useSpring(ty, SPRING);

  return (
    <motion.g
      initial={!reduced && { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05 * index, duration: 0.5, ease: easeOutCubic }}
      style={{ x, y }}
    >
      <Dot cx={home.x} cy={home.y} />
    </motion.g>
  );
}

function Plane({
  vertices,
  stroke = "var(--color-caption-foreground)",
  strokeWidth = 1,
  fill = "none",
  hatched = false,
  isHovering,
  entranceSeed,
  cursorX,
  cursorY,
  scatter,
  reduced,
}: Shared & {
  vertices: Pt[];
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  hatched?: boolean;
  isHovering: boolean;
}) {
  const patternId = useId();
  const [warm, setWarm] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWarm(true), 3500);
    return () => clearTimeout(t);
  }, []);
  if (vertices.length === 0) return null;

  const d = vertices.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const unique = vertices.filter(
    (p, i) => vertices.findIndex((q) => q.x === p.x && q.y === p.y) === i,
  );
  const shown = reduced || !isHovering;
  const delay = warm ? 0.5 : 2;

  return (
    <g>
      <motion.path
        initial={!reduced && { opacity: 0 }}
        animate={shown ? { filter: "blur(0px)", opacity: 1 } : { filter: "blur(2px)", opacity: 0 }}
        transition={shown ? { delay, duration: 1.5, ease: easeInOutCubic } : HIDE}
        fill={fill}
        d={d}
      />
      {hatched && (
        <motion.path
          initial={!reduced && { opacity: 0 }}
          animate={shown ? { filter: "blur(0px)", opacity: 1 } : { filter: "blur(2px)", opacity: 0 }}
          transition={shown ? { delay, duration: 2, ease: easeInOutCubic } : HIDE}
          fill={`url(#${patternId})`}
          d={d}
        />
      )}
      <motion.path
        initial={!reduced && { filter: "blur(2px)", pathLength: 0 }}
        animate={shown ? { filter: "blur(0px)", pathLength: 1 } : { filter: "blur(2px)", pathLength: 0 }}
        transition={shown ? { delay, duration: 1.5, ease: easeInOutCubic } : HIDE}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
      <g stroke={`var(--artwork-vertex-fill, ${stroke})`}>
        {unique.map((p, i) => (
          <Vertex
            key={`${p.x}-${p.y}`}
            home={p}
            index={i}
            entranceSeed={entranceSeed}
            cursorX={cursorX}
            cursorY={cursorY}
            scatter={scatter}
            reduced={reduced}
          />
        ))}
      </g>
      <defs>
        <pattern id={patternId} width="1" height="16" patternUnits="userSpaceOnUse">
          <line
            x1="0"
            y1="0.5"
            x2="1"
            y2="0.5"
            stroke="var(--color-surface)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </pattern>
      </defs>
    </g>
  );
}

const PLANES: { vertices: Pt[]; hatched?: boolean }[] = [
  {
    vertices: [
      { x: 700, y: 480 },
      { x: 900, y: 480 },
      { x: 600, y: 960 },
      { x: 700, y: 1120 },
      { x: 500, y: 1120 },
      { x: 400, y: 960 },
      { x: 700, y: 480 },
    ],
    hatched: true,
  },
  {
    vertices: [
      { x: 900, y: 480 },
      { x: 1000, y: 640 },
      { x: 700, y: 1120 },
      { x: 600, y: 960 },
      { x: 900, y: 480 },
    ],
  },
  {
    vertices: [
      { x: 900, y: 800 },
      { x: 800, y: 960 },
      { x: 900, y: 1120 },
      { x: 1100, y: 1120 },
      { x: 1000, y: 960 },
      { x: 1100, y: 800 },
      { x: 900, y: 800 },
    ],
    hatched: true,
  },
  {
    vertices: [
      { x: 1100, y: 800 },
      { x: 1000, y: 960 },
      { x: 1100, y: 1120 },
      { x: 1200, y: 960 },
      { x: 1100, y: 800 },
    ],
  },
];

const GUIDES: [number, number, number, number][] = [
  [200, 0, 1200, 1600],
  [600, 0, 1600, 1600],
  [1000, 0, 0, 1600],
  [1400, 0, 400, 1600],
  [0, 320, 800, 1600],
  [1600, 320, 800, 1600],
  [0, 480, 1600, 480],
  [0, 1120, 1600, 1120],
];

export function StArtwork(props: ComponentPropsWithoutRef<"svg">) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovering, setHovering] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapStart = useRef(0);
  const tapPoint = useRef({ x: 0, y: 0 });
  const touch = useIsTouchScreen();
  const reduced = useResolvedReducedMotion();
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const scatter = useMotionValue(0);

  function setCursor(clientX: number, clientY: number) {
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return;
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    cursorX.set(p.x);
    cursorY.set(p.y);
  }

  useEffect(
    () => () => {
      if (tapTimer.current) clearTimeout(tapTimer.current);
    },
    [],
  );

  const live = !reduced;
  const shared = { cursorX, cursorY, scatter, reduced };

  return (
    <svg
      ref={svgRef}
      onMouseEnter={
        live && !touch
          ? (e) => {
              setCursor(e.clientX, e.clientY);
              scatter.set(1);
              setHovering(true);
            }
          : undefined
      }
      onMouseLeave={
        live && !touch
          ? () => {
              scatter.set(0);
              setHovering(false);
            }
          : undefined
      }
      onMouseMove={live && !touch ? (e) => setCursor(e.clientX, e.clientY) : undefined}
      onTouchStart={
        live && touch
          ? (e) => {
              tapStart.current = Date.now();
              const t = e.touches[0];
              if (t) tapPoint.current = { x: t.clientX, y: t.clientY };
            }
          : undefined
      }
      onTouchEnd={
        live && touch
          ? (e) => {
              const dt = Date.now() - tapStart.current;
              const t = e.changedTouches[0];
              if (!t) return;
              const dx = t.clientX - tapPoint.current.x;
              const dy = t.clientY - tapPoint.current.y;
              const moved = Math.sqrt(dx * dx + dy * dy);
              if (dt < 300 && moved < 10) {
                if (tapTimer.current) clearTimeout(tapTimer.current);
                setCursor(t.clientX, t.clientY);
                scatter.set(1);
                setHovering(true);
                tapTimer.current = setTimeout(() => {
                  scatter.set(0);
                  setHovering(false);
                  tapTimer.current = null;
                }, 1000);
              }
            }
          : undefined
      }
      viewBox="0 0 1600 1600"
      className={touch ? "select-none" : undefined}
      {...props}
    >
      <g strokeDasharray="4 6" strokeWidth={1} stroke="var(--color-weak-stroke)">
        {GUIDES.map(([x1, y1, x2, y2]) => (
          <line
            key={`${x1}-${y1}-${x2}-${y2}`}
            vectorEffect="non-scaling-stroke"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          />
        ))}
      </g>
      {PLANES.map((plane, i) => (
        <Plane
          key={i}
          vertices={plane.vertices}
          fill="var(--color-primary-background)"
          hatched={plane.hatched}
          isHovering={hovering}
          entranceSeed={i}
          {...shared}
        />
      ))}
    </svg>
  );
}
