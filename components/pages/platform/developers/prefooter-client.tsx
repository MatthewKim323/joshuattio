"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useDevEasterEgg } from "./dev-easter-egg";
import { useScramble } from "./use-scramble";

// "Ready to build?" prefooter: a grid of draggable UI pieces that snap to cells,
// flag collisions, tilt with drag velocity, and the page-wide easter egg toggle.

const easeOutCubic = (e: number) => 1 - (1 - e) ** 3;
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export type Viewport = "desktop" | "mobile";
type GridPos = { column: number; row: number };
type Rect = { columnEnd: number; columnStart: number; rowEnd: number; rowStart: number };
type Element = { position: GridPos; size: { columns: number; rows: number }; title: string };

const GRID = {
  desktop: { columns: 24, rows: 13 },
  mobile: { columns: 12, rows: 19 },
} as const;

const CTA: Record<Viewport, Rect> = {
  desktop: { columnEnd: 17, columnStart: 9, rowEnd: 9, rowStart: 6 },
  mobile: { columnEnd: 13, columnStart: 1, rowEnd: 6, rowStart: 1 },
};

const DESKTOP: Element[] = [
  { position: { column: 3, row: 2 }, size: { columns: 4, rows: 4 }, title: "calendar" },
  { position: { column: 18, row: 3 }, size: { columns: 5, rows: 3 }, title: "select" },
  { position: { column: 3, row: 9 }, size: { columns: 4, rows: 3 }, title: "dropdown" },
  { position: { column: 8, row: 2 }, size: { columns: 3, rows: 1 }, title: "input" },
  { position: { column: 14, row: 3 }, size: { columns: 3, rows: 1 }, title: "toggles" },
  { position: { column: 18, row: 9 }, size: { columns: 5, rows: 2 }, title: "labels" },
  { position: { column: 9, row: 10 }, size: { columns: 1, rows: 1 }, title: "user-avatar" },
  { position: { column: 10, row: 10 }, size: { columns: 1, rows: 1 }, title: "avatar" },
  { position: { column: 11, row: 10 }, size: { columns: 1, rows: 1 }, title: "app-avatar" },
  { position: { column: 19, row: 7 }, size: { columns: 2, rows: 1 }, title: "checkboxes" },
  { position: { column: 15, row: 11 }, size: { columns: 2, rows: 1 }, title: "button" },
];

const MOBILE: Element[] = [
  { position: { column: 2, row: 8 }, size: { columns: 4, rows: 4 }, title: "calendar" },
  { position: { column: 7, row: 8 }, size: { columns: 2, rows: 1 }, title: "button" },
  { position: { column: 8, row: 14 }, size: { columns: 4, rows: 3 }, title: "dropdown" },
  { position: { column: 8, row: 10 }, size: { columns: 3, rows: 1 }, title: "input" },
  { position: { column: 3, row: 14 }, size: { columns: 3, rows: 1 }, title: "toggles" },
  { position: { column: 9, row: 12 }, size: { columns: 2, rows: 1 }, title: "checkboxes" },
  { position: { column: 2, row: 16 }, size: { columns: 5, rows: 3 }, title: "select" },
];

const ELEMENTS: Record<Viewport, Element[]> = { desktop: DESKTOP, mobile: MOBILE };

/* ---------- contexts ---------- */

type FrameCtx = { viewport: Viewport; cellSize: number; inView: boolean };
const FrameContext = createContext<FrameCtx>({ viewport: "desktop", cellSize: 0, inView: false });

type PositionCtx = {
  draggedElement: Element | null;
  nextDraggedElementGridPosition: GridPos | null;
  setDraggedElement: (e: Element | null) => void;
  setNextDraggedElementGridPosition: (p: GridPos | null) => void;
};
const PositionContext = createContext<PositionCtx | undefined>(undefined);
function usePositions() {
  const c = use(PositionContext);
  if (!c) throw new Error("usePositions must be used within the prefooter frame");
  return c;
}

type CollisionCtx = {
  checkForCollisions: (title: string, rect: Rect) => boolean;
  elementPositions: Record<string, Rect>;
  isDraggedElementColliding: boolean;
  overlappingAreas: Record<string, Rect>;
  updateElementPosition: (title: string, rect: Rect) => void;
};
const CollisionContext = createContext<CollisionCtx | undefined>(undefined);
function useCollisions() {
  const c = use(CollisionContext);
  if (!c) throw new Error("useCollisions must be used within the prefooter frame");
  return c;
}

function CollisionProvider({ children, viewport }: { children: ReactNode; viewport: Viewport }) {
  const [positions, setPositions] = useState<Record<string, Rect>>({});
  const [colliding, setColliding] = useState(false);
  const [overlaps, setOverlaps] = useState<Record<string, Rect>>({});
  const updateElementPosition = useCallback(
    (title: string, rect: Rect) => {
      setPositions((p) => ({ ...p, [title]: rect, cta: CTA[viewport] }));
    },
    [viewport],
  );
  const checkForCollisions = useCallback(
    (title: string, t: Rect) => {
      let hit = false;
      for (const [key, l] of Object.entries(positions)) {
        const drop = () =>
          setOverlaps((o) => {
            const { [key]: _gone, ...rest } = o;
            void _gone;
            return rest;
          });
        if (key === title) {
          drop();
          continue;
        }
        const rowsApart = t.rowEnd <= l.rowStart || t.rowStart >= l.rowEnd;
        const colsApart = t.columnEnd <= l.columnStart || t.columnStart >= l.columnEnd;
        if (rowsApart || colsApart) drop();
        else {
          const area = {
            columnEnd: Math.min(t.columnEnd, l.columnEnd),
            columnStart: Math.max(t.columnStart, l.columnStart),
            rowEnd: Math.min(t.rowEnd, l.rowEnd),
            rowStart: Math.max(t.rowStart, l.rowStart),
          };
          setColliding(true);
          setOverlaps((o) => ({ ...o, [key]: area }));
          hit = true;
        }
      }
      setColliding(hit);
      return hit;
    },
    [positions],
  );
  return (
    <CollisionContext.Provider
      value={{
        checkForCollisions,
        elementPositions: positions,
        isDraggedElementColliding: colliding,
        overlappingAreas: overlaps,
        updateElementPosition,
      }}
    >
      {children}
    </CollisionContext.Provider>
  );
}

function PositionProvider({ children }: { children: ReactNode }) {
  const [draggedElement, setDraggedElement] = useState<Element | null>(null);
  const [nextDraggedElementGridPosition, setNextDraggedElementGridPosition] = useState<GridPos | null>(null);
  return (
    <PositionContext.Provider
      value={{ draggedElement, nextDraggedElementGridPosition, setDraggedElement, setNextDraggedElementGridPosition }}
    >
      {children}
    </PositionContext.Provider>
  );
}

/* ---------- frame (measure + in-view + providers) ---------- */

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setSize((s) => (s.width === r.width && s.height === r.height ? s : { width: r.width, height: r.height }));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

export function PrefooterFrame({ viewport, children }: { viewport: Viewport; children: ReactNode }) {
  const viewRef = useRef<HTMLDivElement>(null);
  const [measureRef, { width, height }] = useMeasure<HTMLDivElement>();
  const inViewRaw = useInView(viewRef, { amount: 0.5, once: true });
  const inView = viewport === "desktop" ? inViewRaw : true;
  const cellSize = Math.min(width / GRID[viewport].columns, height / GRID[viewport].rows);
  return (
    <div ref={viewRef} className="size-full">
      <div ref={measureRef} className="size-full">
        <FrameContext.Provider value={{ viewport, cellSize, inView }}>
          <CollisionProvider viewport={viewport}>
            <PositionProvider>{children}</PositionProvider>
          </CollisionProvider>
        </FrameContext.Provider>
      </div>
    </div>
  );
}

/* ---------- drag target overlay ---------- */

function Vertex({ column, row, colliding }: { column: number; row: number; colliding: boolean }) {
  return (
    <div
      className={cx(
        "absolute top-0 left-0 size-1 -translate-x-1/2 -translate-y-1/2",
        colliding ? "bg-[#672322]" : "bg-default-stroke",
      )}
      style={{ gridColumn: column, gridRow: row }}
    />
  );
}

export function PrefooterDragOverlay() {
  const { viewport } = use(FrameContext);
  const { draggedElement: a, nextDraggedElementGridPosition: r } = usePositions();
  const { isDraggedElementColliding: i, overlappingAreas: l } = useCollisions();
  if (!a || !r) return null;
  return (
    <div
      className="relative col-span-full row-span-full grid size-full"
      style={{
        gridTemplateColumns: `repeat(${GRID[viewport].columns}, 1fr)`,
        gridTemplateRows: `repeat(${GRID[viewport].rows}, 1fr)`,
      }}
    >
      <div
        className={cx(
          "inset-0 grid grid-cols-1 grid-rows-1 relative isolate z-20 bg-transparent",
          i
            ? "shadow-[inset_0_0_0_0.5px_#672322,0_0_0_0.5px_#672322]"
            : "shadow-[inset_0_0_0_0.5px_#2E3238,0_0_0_0.5px_#2E3238]",
        )}
        style={{
          gridColumnEnd: r.column + a.size.columns,
          gridColumnStart: r.column,
          gridRowEnd: r.row + a.size.rows,
          gridRowStart: r.row,
        }}
      >
        <Vertex column={1} row={1} colliding={i} />
        <Vertex column={1} row={-1} colliding={i} />
        <Vertex column={-1} row={1} colliding={i} />
        <Vertex column={-1} row={-1} colliding={i} />
      </div>
      {Object.entries(l).map(([key, area]) => (
        <div
          key={key}
          className="relative isolate z-20"
          style={{
            gridColumnEnd: area.columnEnd,
            gridColumnStart: area.columnStart,
            gridRowEnd: area.rowEnd,
            gridRowStart: area.rowStart,
          }}
        >
          <div
            className="size-full absolute inset-0 bg-[#672322]/10 text-[#672322]/40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(125deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ---------- draggable item ---------- */

function Tilt({ title, movementSpeed, children }: { title: string; movementSpeed: { x: number; y: number }; children: ReactNode }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const { draggedElement } = usePositions();
  const rotateX = useTransform(my, [-1e3, 1e3], [-20, 20]);
  const rotateY = useTransform(mx, [-1e3, 1e3], [20, -20]);
  useEffect(() => {
    mx.set(Math.min(Math.max(movementSpeed.x, -1e3), 1e3));
    my.set(Math.min(Math.max(movementSpeed.y, -1e3), 1e3));
  }, [movementSpeed, mx, my]);
  return (
    <div className={cx("relative size-full [perspective:800px]", (!draggedElement || draggedElement.title === title) && "group")}>
      <motion.div style={{ rotateX, rotateY }} className="size-full">
        {children}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-primary-background opacity-0 mix-blend-plus-lighter transition-opacity duration-150 ease-in-out group-hover:opacity-20 group-active:opacity-0" />
    </div>
  );
}

const SPRING = { damping: 15, mass: 0.1, stiffness: 320 };

function Draggable({ element: e, children }: { element: Element; children: ReactNode }) {
  const { viewport, cellSize: r } = use(FrameContext);
  const {
    setDraggedElement,
    draggedElement,
    nextDraggedElementGridPosition: next,
    setNextDraggedElementGridPosition: setNext,
  } = usePositions();
  const { updateElementPosition, checkForCollisions } = useCollisions();
  const [pos, setPos] = useState<GridPos>({ column: e.position.column, row: e.position.row });
  const dragging = useRef(false);
  const origin = useRef({ x: 0, y: 0 });
  const [speed, setSpeed] = useState({ x: 0, y: 0 });
  const X = useMotionValue(0);
  const Y = useMotionValue(0);
  const y = useSpring(Y, SPRING);
  const x = useSpring(X, SPRING);

  const settle = useCallback(() => {
    Y.set(pos.row * r - e.position.row * r);
    X.set(pos.column * r - e.position.column * r);
    origin.current = { x: X.get(), y: Y.get() };
    updateElementPosition(e.title, {
      columnEnd: pos.column + e.size.columns,
      columnStart: pos.column,
      rowEnd: pos.row + e.size.rows,
      rowStart: pos.row,
    });
  }, [r, pos.row, pos.column, e, X, Y, updateElementPosition]);
  useEffect(() => {
    settle();
  }, [settle]);

  const start = () => {
    checkForCollisions(e.title, {
      columnEnd: pos.column + e.size.columns,
      columnStart: pos.column,
      rowEnd: pos.row + e.size.rows,
      rowStart: pos.row,
    });
    setDraggedElement(e);
    setNext(pos);
    dragging.current = true;
  };
  const end = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const column = next?.column ?? e.position.column;
    const row = next?.row ?? e.position.row;
    if (
      !checkForCollisions(e.title, {
        columnEnd: column + e.size.columns,
        columnStart: column,
        rowEnd: row + e.size.rows,
        rowStart: row,
      })
    )
      setPos({ column, row });
    setSpeed({ x: 0, y: 0 });
    settle();
    setDraggedElement(null);
    setNext(null);
  };

  return (
    <motion.div
      layout
      onMouseDown={start}
      onTouchStart={start}
      onMouseUp={end}
      onTouchEnd={end}
      onPanEnd={end}
      onPan={(ev, info) => {
        ev.preventDefault();
        ev.stopPropagation();
        const target = {
          column: Math.min(
            GRID[viewport].columns - e.size.columns + 1,
            Math.max(1, pos.column + Math.round(info.offset.x / r)),
          ),
          row: Math.min(GRID[viewport].rows - e.size.rows + 1, Math.max(1, pos.row + Math.round(info.offset.y / r))),
        };
        setSpeed({ x: info.velocity.x, y: info.velocity.y });
        Y.set(origin.current.y + info.offset.y);
        X.set(origin.current.x + info.offset.x);
        checkForCollisions(e.title, {
          columnEnd: target.column + e.size.columns,
          columnStart: target.column,
          rowEnd: target.row + e.size.rows,
          rowStart: target.row,
        });
        setNext(target);
      }}
      className={cx(
        "relative isolate z-10 size-full cursor-grab active:cursor-grabbing",
        draggedElement?.title === e.title && "z-90",
      )}
      style={{ touchAction: "none", x, y }}
    >
      <Tilt title={e.title} movementSpeed={speed}>
        {children}
      </Tilt>
    </motion.div>
  );
}

export function PrefooterItem({ title, children }: { title: string; children: ReactNode }) {
  const { viewport, inView } = use(FrameContext);
  const index = ELEMENTS[viewport].findIndex((el) => el.title === title);
  const e = ELEMENTS[viewport][index];
  const area = {
    gridColumnEnd: e.position.column + e.size.columns,
    gridColumnStart: e.position.column,
    gridRowEnd: e.position.row + e.size.rows,
    gridRowStart: e.position.row,
  };
  if (viewport === "mobile") {
    return (
      <div className="size-full" style={area}>
        <Draggable element={e}>{children}</Draggable>
      </div>
    );
  }
  return (
    <motion.div
      className="size-full"
      initial={false}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{ delay: 0.07 * index, duration: 0.44, ease: easeOutCubic }}
      style={area}
    >
      <Draggable element={e}>{children}</Draggable>
    </motion.div>
  );
}

/* ---------- docs link with chained scramble ---------- */

const DOCS_URL = "https://docs.joshuattio.com/sdk/";

export function PrefooterDocsLink() {
  const parts = DOCS_URL.split(/(https:\/\/)([^/]+)(.*)/).filter(Boolean);
  const third = useScramble<HTMLSpanElement>({ text: parts[2] });
  const second = useScramble<HTMLSpanElement>({ onAnimationEnd: () => third.replay(), text: parts[1] });
  const first = useScramble<HTMLSpanElement>({ onAnimationEnd: () => second.replay(), text: parts[0] });
  return (
    <a href="#">
      <span
        onMouseEnter={first.replay}
        className="group relative px-0.5 font-mono text-caption-foreground max-lg:text-sm transition-colors duration-150 ease-in-out hover:text-secondary-foreground active:text-tertiary-foreground"
      >
        <span ref={first.ref}>{parts[0]}</span>
        <span ref={second.ref} className="text-secondary-foreground hover:text-inherit active:text-inherit">
          {parts[1]}
        </span>
        <span ref={third.ref}>{parts[2]}</span>
        <span
          className="absolute right-0 -bottom-1 left-0 h-1 w-full"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundPosition: "0 0",
            backgroundRepeat: "repeat-x",
            backgroundSize: "4px 4px",
          }}
        />
      </span>
    </a>
  );
}

/* ---------- toggles piece (easter egg switch) ---------- */

const PILL =
  "M12 17.3335C12 13.2833 15.2833 10 19.3335 10H29.1114C33.1615 10 36.4448 13.2833 36.4448 17.3335C36.4448 21.3836 33.1615 24.6669 29.1114 24.6669H19.3335C15.2833 24.6669 12 21.3836 12 17.3335Z";

export function PrefooterToggles() {
  const { isEasterEggEnabled: on, toggleEasterEgg } = useDevEasterEgg();
  const [label, setLabel] = useState("Hacker Mode");
  const { ref, replay } = useScramble<SVGTextElement & HTMLElement>({ text: label });

  // Restart the scramble whenever the label changes.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    replay();
  }, [label, replay]);

  // Every 4 to 5s: flash "Hacker Mode" for 1s, then back to the hex value.
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const id = setInterval(() => {
      setLabel("Hacker Mode");
      timers.push(setTimeout(() => setLabel("#0DB472"), 1e3));
    }, 1e3 * Math.random() + 4e3);
    return () => {
      clearInterval(id);
      timers.forEach(clearTimeout);
    };
  }, [label, on]);

  return (
    <svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <path d={PILL} stroke="#2E3238" strokeWidth="0.3" />
      <g
        onClick={(ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          toggleEasterEgg();
        }}
        onMouseEnter={() => setLabel("Hacker Mode")}
        onMouseLeave={() => setLabel("#0DB472")}
        className="cursor-pointer"
      >
        <rect x="8" y="6" width="104" height="22" fill="transparent" />
        <motion.path d={PILL} fill="#202124" initial={false} animate={{ fill: on ? "#2E3238" : "#202124" }} />
        <motion.rect
          x="13.7576"
          y="11.7569"
          width="11.153"
          height="11.153"
          rx="5.57648"
          fill="#383E47"
          initial={false}
          animate={{ fill: on ? "#505967" : "#383E47", x: on ? 23.5311 - 13.7576 : 0 }}
        />
        <motion.rect
          x="13.7576"
          y="11.7569"
          width="11.153"
          height="11.153"
          rx="5.57648"
          stroke="#505967"
          strokeWidth="0.15278"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ x: on ? 23.5311 - 13.7576 : 0 }}
        />
        <text ref={ref} x="42.56" y="23" fill="#616874" fontSize="15.89" fontWeight="500" className="select-none" />
      </g>
      <rect x="12" y="36" width="24.437" height="14.6622" rx="7.3311" fill="#2E3238" />
      <rect x="12" y="36" width="24.437" height="14.6622" rx="7.3311" stroke="#383E47" strokeWidth="0.3" />
      <rect x="23.5311" y="37.7564" width="11.1494" height="11.1494" rx="5.57469" fill="#505967" />
      <rect
        x="23.5311"
        y="37.7564"
        width="11.1494"
        height="11.1494"
        rx="5.57469"
        stroke="#6F7988"
        strokeWidth="0.152731"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="42.56" y="49" fill="#616874" fontSize="15.89" fontWeight="500" className="select-none">
        {"Toggle"}
      </text>
    </svg>
  );
}

/* ---------- easter egg: page tint + black backdrop ---------- */

export function PrefooterEasterEgg() {
  const { isEasterEggEnabled: on } = useDevEasterEgg();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!on) return;
    // The route's dark scope re-declares the token below on its wrapper, so the override goes on both.
    const scope = document.querySelector<HTMLElement>('[data-route-theme="dark"]');
    const scopePrimary = scope?.style.getPropertyValue("--internal-color-primary-background") ?? "";
    scope?.style.setProperty("--internal-color-primary-background", "var(--color-black-0)");
    const s = document.documentElement.style;
    const bg = s.getPropertyValue("background-color");
    const primary = s.getPropertyValue("--internal-color-primary-background");
    const overscroll = s.getPropertyValue("--color-overscroll-bottom");
    const behavior = s.getPropertyValue("overscroll-behavior");
    s.setProperty("background-color", "#000000");
    s.setProperty("--internal-color-primary-background", "var(--color-black-0)");
    s.setProperty("--color-overscroll-bottom", "var(--color-black-0)");
    s.setProperty("overscroll-behavior", "none");
    return () => {
      s.setProperty("background-color", bg);
      s.setProperty("--internal-color-primary-background", primary);
      s.setProperty("--color-overscroll-bottom", overscroll);
      s.setProperty("overscroll-behavior", behavior);
      scope?.style.setProperty("--internal-color-primary-background", scopePrimary);
    };
  }, [on]);
  if (!mounted) return null;
  return createPortal(
    on ? (
      <div className="pointer-events-none fixed inset-0 z-(--style-overlay-z-index) bg-green-600 mix-blend-multiply contrast-160" />
    ) : null,
    document.body,
  );
}
