"use client";

import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TESTIMONIALS, type Testimonial } from "./careers-data";

// Team voices: a lozenge of avatar circles that pops in from the centre, swells
// toward the pointer (or toward the featured voice when idle), and cycles a quote
// every 5s, preferring a neighbour of the current one. Hover a face to pin its quote.

const SHAPE_WIDE = [
  "________XXXXXXXXXXX________",
  "_______XXXXXXXXXXXXX_______",
  "______XXXXXXXXXXXXXXX______",
  "_______XXXXXXXXXXXXX_______",
  "________XXXXXXXXXXX________",
];
const SHAPE_NARROW = [
  "___XXXXX___",
  "__XXXXXXX__",
  "_XXXXXXXXX_",
  "_XXXXXXXXX_",
  "_XXXXXXXXX_",
  "_XXXXXXXXX_",
  "__XXXXXXX__",
  "___XXXXX___",
];
const CELL = 32;
const MIN_SCALE = 0.8;
const ENTRANCE_SPREAD = 0.5;
const EASE_OUT = [0.22, 0.61, 0.36, 1] as const;
const EASE_POP = [0.34, 1.2, 0.64, 1] as const;
const EASE_HOVER = [0.34, 1.3, 0.64, 1] as const;
const EASE_QUOTE = [0.16, 1, 0.3, 1] as const;
const NARROW_QUERY = "(max-width: 991.98px)";

type Pos = { x: number; y: number };

const Circle = memo(function Circle({
  x,
  y,
  mousePos,
  item,
  itemIndex,
  isActive,
  onHover,
  entranceDelay,
  hasEntered,
}: {
  x: number;
  y: number;
  mousePos: Pos;
  item: Testimonial | null;
  itemIndex: number;
  isActive: boolean;
  onHover: (i: number | null) => void;
  entranceDelay: number;
  hasEntered: boolean;
}) {
  const dist = Math.sqrt((x - mousePos.x) ** 2 + (y - mousePos.y) ** 2);
  const scale = isActive ? 1 : item ? Math.min(1, Math.max(MIN_SCALE, 1 - dist / 400)) : MIN_SCALE;
  // Empty cells settle at a faint random opacity (client only; they start at 0).
  const [faint] = useState(() => 0.2 * Math.random() + 0.1);
  return (
    <motion.div
      className={`absolute overflow-hidden rounded-full bg-white-700 after:absolute after:inset-0 after:z-1 after:mix-blend-hard-light after:rounded-full after:bg-linear-to-tl after:from-[#a4adba] after:to-[#e4e7ec] after:transition after:duration-300 after:ease-out ${item && !isActive ? "after:opacity-100" : "after:opacity-0"}`}
      style={{ height: CELL, left: x, top: y, width: CELL }}
      initial={{ opacity: 0, scale: 0.8 * MIN_SCALE, x: "-50%", y: "-50%" }}
      animate={{ opacity: item ? 1 : faint, scale, x: "-50%", y: "-50%" }}
      transition={
        hasEntered
          ? { scale: { duration: 0.2, ease: EASE_HOVER } }
          : { delay: entranceDelay, duration: 0.5, ease: EASE_OUT, scale: { delay: entranceDelay, duration: 0.5, ease: EASE_POP } }
      }
      onMouseEnter={() => onHover(item ? itemIndex : null)}
    >
      {item ? (
        <>
          <img alt={item[1]} width={512} height={512} decoding="async" className="rounded-full object-cover" style={{ color: "transparent", height: CELL, width: CELL }} src={item[2]} />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px] shadow-black-100/10" />
        </>
      ) : null}
    </motion.div>
  );
});

export function Testimonials() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(NARROW_QUERY);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const shape = narrow ? SHAPE_NARROW : SHAPE_WIDE;
  const [mousePos, setMousePos] = useState<Pos>({ x: 0, y: 0 });
  const [active, setActive] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [entered, setEntered] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<Pos>({ x: 0, y: 0 });
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tween = useRef<{ startPos: Pos; endPos: Pos; startTime: number } | null>(null);
  const raf = useRef(0);
  const activeRef = useRef<number | null>(null);
  const shownOnce = useRef(false);

  const count = shape.join("").split("X").length - 1;
  const items = useMemo(() => TESTIMONIALS.slice(0, count), [count]);

  const cells = useMemo(() => {
    let k = 0;
    return shape.map((row, a) =>
      row.split("").map((ch, r) => ({ itemIndex: ch === "X" ? k++ : -1, x: r * CELL + CELL / 2, y: a * CELL + CELL / 2 })),
    );
  }, [shape]);

  const delays = useMemo(() => {
    const cx = (shape[0].length * CELL) / 2;
    const cy = (shape.length * CELL) / 2;
    const m = new Map<string, number>();
    let max = 0;
    cells.forEach((row, l) =>
      row.forEach(({ x, y }, s) => {
        const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        m.set(`${l}-${s}`, d);
        max = Math.max(max, d);
      }),
    );
    m.forEach((d, key) => m.set(key, (d / max) * ENTRANCE_SPREAD));
    return m;
  }, [cells, shape]);

  const positions = useMemo(() => {
    const m = new Map<number, Pos>();
    cells.forEach((row) => row.forEach(({ x, y, itemIndex }) => itemIndex !== -1 && m.set(itemIndex, { x, y })));
    return m;
  }, [cells]);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), (ENTRANCE_SPREAD + 0.6) * 1e3);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    mouseRef.current = mousePos;
  }, [mousePos]);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const activePos = useMemo(() => {
    if (active === null) return null;
    for (const row of cells) for (const c of row) if (c.itemIndex === active) return { x: c.x, y: c.y };
    return null;
  }, [active, cells]);

  // Next featured voice: weighted toward neighbours of the current one.
  const pickNext = useCallback(
    (from: number | null) => {
      if (from === null || positions.size === 0) return Math.floor(Math.random() * items.length);
      const origin = positions.get(from);
      if (!origin) return Math.floor(Math.random() * items.length);
      const weights: number[] = [];
      let total = 0;
      for (let i = 0; i < items.length; i++) {
        if (i === from) {
          weights.push(0);
          continue;
        }
        const p = positions.get(i);
        if (!p) {
          weights.push(0);
          continue;
        }
        const w = 1 / (Math.sqrt((p.x - origin.x) ** 2 + (p.y - origin.y) ** 2) + 50);
        weights.push(w);
        total += w;
      }
      let r = Math.random() * total;
      for (let i = 0; i < weights.length; i++) if ((r -= weights[i]) <= 0) return i;
      return Math.floor(Math.random() * items.length);
    },
    [items.length, positions],
  );

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (box.current && hovering) {
        const r = box.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }
    },
    [hovering],
  );

  const onHover = useCallback((i: number | null) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    if (i !== null) {
      setHovering(true);
      setActive(i);
    } else {
      leaveTimer.current = setTimeout(() => setHovering(false), 2e3);
    }
  }, []);

  const onLeave = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setHovering(false), 2e3);
  }, []);

  const step = useCallback(() => {
    if (!tween.current) return;
    const { startPos, endPos, startTime } = tween.current;
    const t = Math.min(1, (performance.now() - startTime) / 400);
    const k = 1 - (1 - t) ** 3;
    setMousePos({ x: startPos.x + (endPos.x - startPos.x) * k, y: startPos.y + (endPos.y - startPos.y) * k });
    if (t < 1) raf.current = requestAnimationFrame(step);
    else tween.current = null;
  }, []);

  useEffect(() => {
    if (hovering) return;
    const first = activeRef.current !== null ? null : setTimeout(() => setActive(pickNext(null)), 900);
    const cycle = setInterval(() => setActive((cur) => pickNext(cur)), 5e3);
    return () => {
      if (first) clearTimeout(first);
      clearInterval(cycle);
    };
  }, [hovering, pickNext]);

  useEffect(() => {
    if (hovering || !activePos) return;
    const cur = mouseRef.current;
    if (cur.x === 0 && cur.y === 0) {
      setMousePos(activePos);
      return;
    }
    cancelAnimationFrame(raf.current);
    tween.current = { endPos: activePos, startPos: { x: cur.x, y: cur.y }, startTime: performance.now() };
    raf.current = requestAnimationFrame(step);
  }, [activePos, hovering, step]);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove]);

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      cancelAnimationFrame(raf.current);
    },
    [],
  );

  const quote = active !== null ? (items[active] ?? null) : null;
  const firstQuote = !shownOnce.current && quote !== null;
  useEffect(() => {
    if (quote) shownOnce.current = true;
  }, [quote]);

  return (
    <div className="flex flex-col items-center justify-center bg-white-100">
      <div
        ref={box}
        className="relative mb-8 [mask-image:linear-gradient(to_right,transparent_0%,white_10%,white_90%,transparent_100%)] max-lg:pointer-events-none"
        style={{ height: shape.length * CELL, width: shape[0].length * CELL }}
        onMouseLeave={onLeave}
      >
        {cells.map((row, a) =>
          row.map(({ x, y, itemIndex }, l) => (
            <Circle
              key={`${a}-${l}`}
              x={x}
              y={y}
              mousePos={mousePos}
              item={itemIndex !== -1 ? (items[itemIndex] ?? null) : null}
              itemIndex={itemIndex}
              isActive={active !== null && itemIndex === active}
              onHover={onHover}
              entranceDelay={delays.get(`${a}-${l}`) ?? 0}
              hasEntered={entered}
            />
          )),
        )}
      </div>
      <div className="relative flex min-h-40 items-center justify-center text-center max-lg:min-h-58">
        <AnimatePresence mode="popLayout">
          {quote ? (
            <motion.div
              key={quote[0]}
              className="max-w-2xl"
              initial={{ opacity: 0, y: firstQuote ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: EASE_QUOTE }}
            >
              <p className="mb-2 text-pretty font-serif text-xl">{`“${quote[3]}”`}</p>
              <div className="flex items-center justify-center gap-1 text-secondary-foreground text-sm">
                {quote[1]}
                {quote[4] ? <>{" "}{quote[4]}</> : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
