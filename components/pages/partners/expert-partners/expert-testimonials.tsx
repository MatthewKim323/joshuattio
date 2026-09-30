"use client";

import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMedia } from "@/components/pages/apps/detail/use-media";
import { FLAGS } from "./flags";
import { TESTIMONIALS, type Testimonial } from "./testimonials-data";

// Avatar grid shapes ("X" = a circle). This page uses the compact variant.
const GRID_DESKTOP = ["XXXXXXXXXXXXXXX", "XXXXXXXXXXXXXXX", "XXXXXXXXXXXXXXX"];
const GRID_MOBILE = ["_XXX_", "XXXXX", "XXXXX", "_XXX_"];
const CELL = 64;
const CIRCLE = 54;
const MIN_SCALE = 0.85;
const ENTRANCE_SPREAD = 0.3;

const EASE_ENTER: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
const EASE_ENTER_SCALE: [number, number, number, number] = [0.34, 1.2, 0.64, 1];
const EASE_HOVER_SCALE: [number, number, number, number] = [0.34, 1.3, 0.64, 1];
const EASE_QUOTE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Point = { x: number; y: number };
type Cell = Point & { itemIndex: number };

const CIRCLE_CLASS =
  "absolute overflow-hidden rounded-full bg-white-700 after:absolute after:inset-0 after:z-1 after:mix-blend-hard-light after:rounded-full after:bg-linear-to-tl after:from-[#a4adba] after:to-[#e4e7ec] after:transition after:duration-300 after:ease-out";

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
  mousePos: Point;
  item: Testimonial | null;
  itemIndex: number;
  isActive: boolean;
  onHover: (index: number | null) => void;
  entranceDelay: number;
  hasEntered: boolean;
}) {
  const dist = Math.sqrt((x - mousePos.x) ** 2 + (y - mousePos.y) ** 2);
  const scale = isActive ? 1 : item ? Math.min(1, Math.max(MIN_SCALE, 1 - dist / 400)) : MIN_SCALE;
  // Empty slots settle at a faint, per-slot opacity.
  const [idleOpacity] = useState(() => 0.2 * Math.random() + 0.1);
  const tint = item && !isActive;
  return (
    <motion.div
      className={`${CIRCLE_CLASS} ${tint ? "after:opacity-100" : "after:opacity-0"}`}
      style={{ height: CIRCLE, left: x, top: y, width: CIRCLE }}
      initial={{ opacity: 0, scale: 0.8 * MIN_SCALE, x: "-50%", y: "-50%" }}
      animate={{ opacity: item ? 1 : idleOpacity, scale, x: "-50%", y: "-50%" }}
      transition={
        hasEntered
          ? { scale: { duration: 0.2, ease: EASE_HOVER_SCALE } }
          : {
              delay: entranceDelay,
              duration: 0.5,
              ease: EASE_ENTER,
              scale: { delay: entranceDelay, duration: 0.5, ease: EASE_ENTER_SCALE },
            }
      }
      onMouseEnter={() => onHover(item ? itemIndex : null)}
    >
      {item && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={item.name}
            width={item.photo.width}
            height={item.photo.height}
            decoding="async"
            data-nimg="1"
            className="rounded-full object-cover"
            style={{ color: "transparent", height: CIRCLE, width: CIRCLE }}
            srcSet={item.photo.srcSet}
            src={item.photo.src}
          />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px] shadow-black-100/10" />
        </>
      )}
    </motion.div>
  );
});

// Center-out ordering: cells closest to the middle of the shape get the first quotes.
function buildCells(shape: string[]): Cell[][] {
  const pts: { col: number; row: number; x: number; y: number }[] = [];
  shape.forEach((line, row) =>
    line.split("").forEach((ch, col) => {
      if (ch === "X") pts.push({ col, row, x: col * CELL + CELL / 2, y: row * CELL + CELL / 2 });
    }),
  );
  const cx = (shape[0].length * CELL) / 2;
  const cy = (shape.length * CELL) / 2;
  pts.sort((a, b) => Math.sqrt((a.x - cx) ** 2 + (a.y - cy) ** 2) - Math.sqrt((b.x - cx) ** 2 + (b.y - cy) ** 2));
  const order = new Map<string, number>();
  pts.forEach((p, i) => order.set(`${p.row}-${p.col}`, i));
  return shape.map((line, row) =>
    line.split("").map((ch, col) => ({
      itemIndex: ch === "X" ? (order.get(`${row}-${col}`) ?? -1) : -1,
      x: col * CELL + CELL / 2,
      y: row * CELL + CELL / 2,
    })),
  );
}

export function ExpertTestimonials({ className = "" }: { className?: string }) {
  const isMobile = useMedia("(max-width: 991.98px)");
  const shape = isMobile ? GRID_MOBILE : GRID_DESKTOP;

  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  const [active, setActive] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glide = useRef<{ startPos: Point; endPos: Point; startTime: number } | null>(null);
  const raf = useRef(0);
  const activeRef = useRef<number | null>(null);
  const firstId = useRef<string | null>(null);

  const slots = shape.join("").split("X").length - 1;
  const items = useMemo(() => TESTIMONIALS.slice(0, slots), [slots]);
  const cells = useMemo(() => buildCells(shape), [shape]);

  const delays = useMemo(() => {
    const cx = (shape[0].length * CELL) / 2;
    const cy = (shape.length * CELL) / 2;
    const map = new Map<string, number>();
    let max = 0;
    cells.forEach((row, r) =>
      row.forEach(({ x, y }, c) => {
        const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        map.set(`${r}-${c}`, d);
        max = Math.max(max, d);
      }),
    );
    map.forEach((d, k) => map.set(k, (d / max) * ENTRANCE_SPREAD));
    return map;
  }, [cells, shape]);

  const positions = useMemo(() => {
    const map = new Map<number, Point>();
    cells.forEach((row) => row.forEach(({ x, y, itemIndex }) => itemIndex !== -1 && map.set(itemIndex, { x, y })));
    return map;
  }, [cells]);

  useEffect(() => {
    const t = setTimeout(() => setHasEntered(true), (ENTRANCE_SPREAD + 0.6) * 1000);
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

  // Next quote: weighted toward neighbours of the current one.
  const pickNext = useCallback(
    (from: number | null) => {
      if (from === null || positions.size === 0) return Math.floor(Math.random() * items.length);
      const origin = positions.get(from);
      if (!origin) return Math.floor(Math.random() * items.length);
      const weights: number[] = [];
      let total = 0;
      for (let i = 0; i < items.length; i++) {
        const p = i === from ? undefined : positions.get(i);
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

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (gridRef.current && hovering) {
        const r = gridRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }
    },
    [hovering],
  );

  const onHover = useCallback((index: number | null) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    if (index !== null) {
      setHovering(true);
      setActive(index);
    } else {
      leaveTimer.current = setTimeout(() => setHovering(false), 2000);
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setHovering(false), 2000);
  }, []);

  const step = useCallback(() => {
    if (!glide.current) return;
    const { startPos, endPos, startTime } = glide.current;
    const t = Math.min(1, (performance.now() - startTime) / 400);
    const k = 1 - (1 - t) ** 3;
    setMousePos({ x: startPos.x + (endPos.x - startPos.x) * k, y: startPos.y + (endPos.y - startPos.y) * k });
    if (t < 1) raf.current = requestAnimationFrame(step);
    else glide.current = null;
  }, []);

  // Autoplay while the visitor is not hovering: first quote after 900ms, then every 5s.
  useEffect(() => {
    if (hovering) return;
    const first = activeRef.current !== null ? null : setTimeout(() => setActive(pickNext(null)), 900);
    const every = setInterval(() => setActive((cur) => pickNext(cur)), 5000);
    return () => {
      if (first) clearTimeout(first);
      clearInterval(every);
    };
  }, [hovering, pickNext]);

  // The magnifying "cursor" glides to the autoplayed avatar.
  useEffect(() => {
    if (hovering || !activePos) return;
    const cur = mouseRef.current;
    if (cur.x === 0 && cur.y === 0) {
      setMousePos(activePos);
    } else {
      cancelAnimationFrame(raf.current);
      glide.current = { endPos: activePos, startPos: { x: cur.x, y: cur.y }, startTime: performance.now() };
      raf.current = requestAnimationFrame(step);
    }
  }, [activePos, hovering, step]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      cancelAnimationFrame(raf.current);
    },
    [],
  );

  const current = active !== null ? (items[active] ?? null) : null;
  if (current && firstId.current === null) firstId.current = current.id;
  const isFirst = current !== null && current.id === firstId.current;
  const Flag = current ? FLAGS[current.countryCode] : undefined;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        ref={gridRef}
        className="relative mb-8 [mask-image:linear-gradient(to_right,transparent_0%,white_10%,white_90%,transparent_100%)] max-lg:pointer-events-none"
        style={{ height: `${shape.length * CELL + (isMobile ? 20 : 0)}px`, width: `${shape[0].length * CELL}px` }}
        onMouseLeave={onMouseLeave}
      >
        {cells.map((row, r) =>
          row.map(({ x, y, itemIndex }, c) => (
            <Circle
              key={`${r}-${c}`}
              x={x}
              y={y}
              mousePos={mousePos}
              item={itemIndex !== -1 ? (items[itemIndex] ?? null) : null}
              itemIndex={itemIndex}
              isActive={active !== null && itemIndex === active}
              onHover={onHover}
              entranceDelay={delays.get(`${r}-${c}`) ?? 0}
              hasEntered={hasEntered}
            />
          )),
        )}
      </div>
      <div className="expert-quote-box relative flex min-h-40 items-center justify-center text-center max-lg:min-h-58">
        {/* Phones: hold the box at the height of an eight-line quote so rotating quotes never shift the page. */}
        <style>{"@media (max-width:767.98px){.expert-quote-box{min-height:236px}}"}</style>
        <AnimatePresence mode="popLayout">
          {current && (
            <motion.div
              key={current.id}
              className="max-w-2xl"
              initial={{ opacity: 0, y: isFirst ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: EASE_QUOTE }}
            >
              <p className="mb-2 text-pretty font-serif text-xl">
                {"“"}
                {current.mobileQuote ? (
                  <>
                    <span className="md:hidden">{current.mobileQuote}</span>
                    <span className="max-md:hidden">{current.quote}</span>
                  </>
                ) : (
                  current.quote
                )}
                {"”"}
              </p>
              <div className="flex items-center justify-center gap-1 text-secondary-foreground text-sm">
                {current.name}
                {Flag && (
                  <Flag
                    aria-label={current.countryCode}
                    className="inline-block h-3 rounded-[2px] shadow-[inset_0_0_0_1px] shadow-black-100/10"
                  />
                )}
                {current.subtitle && <>{" "}{current.subtitle}</>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
