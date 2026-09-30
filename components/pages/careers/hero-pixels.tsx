"use client";

import { AnimatePresence, motion } from "motion/react";
import { memo, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { PIXELS, type Pixel } from "./careers-data";

// Hero pixel field: one tile per shipped update, 53 week-columns rising to the
// right. Tiles pop in column by column, then breathe on their own random loop.
// Hovering a tile opens a card with that update above it.

const COLS = 53;
const ROWS = 21;
const HEIGHTS = Array.from({ length: COLS }, (_, t) => {
  const i = t / 52;
  const a = (Math.exp(7 * i) - 1) / (Math.exp(7) - 1);
  return Math.max(1, Math.round((0.25 * i + 0.75 * a) * 21));
});
const TOTAL = HEIGHTS.reduce((e, t) => e + t, 0);
const OFFSETS = HEIGHTS.map((_, r) => HEIGHTS.slice(0, r).reduce((e, t) => e + t, 0));

const TAG_TONES = {
  blue: { background: "#E5EEFF", stroke: "#C2D6FF", text: "#2B3E6D" },
  green: { background: "#E0FCED", stroke: "#A7F2CF", text: "#244A3A" },
  purple: { background: "#F5F0FF", stroke: "#D8C4FF", text: "#45297D" },
  red: { background: "#FFEBEB", stroke: "#FFC2C2", text: "#692623" },
  yellow: { background: "#FFF3CC", stroke: "#FFD269", text: "#523817" },
} as const;
const TAG_COLOR: Record<string, keyof typeof TAG_TONES> = {
  AI: "purple",
  Announcement: "red",
  API: "yellow",
  "Browser Extension": "red",
  "Bug Fix": "blue",
  "Data Model": "yellow",
  Design: "yellow",
  Documentation: "red",
  Enhancement: "purple",
  Feature: "blue",
  Integration: "yellow",
  Mobile: "yellow",
  Notes: "yellow",
  Platform: "yellow",
  Reports: "green",
  Sequences: "green",
  Settings: "blue",
  Workflows: "green",
};

const SIDE_OFFSET = 8;
const COLLISION_PADDING = 24;
const CARD_WIDTH = 280;
const OUT_EASE = [0.33, 1, 0.68, 1] as const;
const IN_EASE = [0.12, 0, 0.39, 0] as const;

type Place = { x: number; y: number };

function PixelCard({ entry, anchor }: { entry: Pixel; anchor: HTMLElement }) {
  const ref = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [title, copy, tags, image] = entry;

  useLayoutEffect(() => {
    const update = () => {
      const card = ref.current;
      if (!card) return;
      const r = anchor.getBoundingClientRect();
      const h = card.offsetHeight;
      const vw = document.documentElement.clientWidth;
      let x = r.left + r.width / 2 - CARD_WIDTH / 2;
      x = Math.min(Math.max(x, COLLISION_PADDING), vw - COLLISION_PADDING - CARD_WIDTH);
      let y = r.top - SIDE_OFFSET - h;
      if (y < COLLISION_PADDING) y = r.bottom + SIDE_OFFSET;
      setPlace({ x: Math.round(x), y: Math.round(y) });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [anchor]);

  const wrapper: CSSProperties = {
    position: "fixed",
    left: 0,
    top: 0,
    minWidth: "max-content",
    transform: place ? `translate(${place.x}px, ${place.y}px)` : "translate(0, -200%)",
    visibility: place ? undefined : "hidden",
    pointerEvents: "none",
  };

  return (
    <div style={wrapper} className="z-(--dialog-content-z-index)" data-radix-popper-content-wrapper="">
      <motion.div
        ref={ref}
        role="dialog"
        data-state="open"
        data-side="top"
        initial={{ opacity: 0, scale: 0.98, y: -8 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            opacity: { duration: 0.16, ease: OUT_EASE },
            y: { duration: 0.24, ease: OUT_EASE },
          },
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          transition: {
            opacity: { duration: 0.04, ease: IN_EASE },
            scale: { duration: 0.04, ease: IN_EASE },
            y: { duration: 0.04, ease: IN_EASE },
          },
          y: -8,
        }}
        className="pointer-events-none relative z-(--dialog-content-z-index) h-full w-[280px] rounded-xl bg-primary-background p-2.5 shadow-[0px_0px_0px_1px_rgba(28,40,64,0.05),_0px_4px_8px_-4px_rgba(28,40,64,0.12),_0px_4px_12px_-2px_rgba(28,40,64,0.16)]"
      >
        <div className="flex w-full flex-col gap-0.5">
          {image ? (
            <div className="relative mb-2 w-full">
              <img
                alt=""
                width={image[1]}
                height={image[2]}
                decoding="async"
                className="size-full rounded-lg object-cover"
                style={{ color: "transparent" }}
                src={image[0]}
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-default-stroke/40 ring-inset" />
            </div>
          ) : null}
          {title ? <p className="font-semibold text-primary-foreground text-sm">{title}</p> : null}
          {copy ? <p className="text-sm text-tertiary-foreground leading-tight">{copy}</p> : null}
          {tags.length ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => {
                const tone = TAG_TONES[TAG_COLOR[tag] ?? "blue"];
                return (
                  <span
                    key={tag}
                    className="inline-block rounded-lg border px-1.5 py-0.5 text-secondary-foreground text-xs"
                    style={{ backgroundColor: tone.background, borderColor: tone.stroke, color: tone.text }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

const PixelTile = memo(function PixelTile({ entry, opacity }: { entry: Pixel | undefined; opacity: number }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLDivElement>(null);
  // Per-tile breathing loop: random peak, period and start offset (client only).
  const [loop] = useState(() => ({ peak: 0.4 * Math.random() + 0.6 * opacity, period: 8 * Math.random() + 4, delay: 0.5 * Math.random() + 0.5 }));

  return (
    <div className="relative size-[22px]">
      <div
        ref={trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-state={open ? "open" : "closed"}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <motion.div
          className={`relative size-[22px] rounded-md bg-white-700 z-1 before:absolute before:-inset-px${open ? " bg-blue-200" : ""}`}
          animate={{ opacity: [0.1, loop.peak, 0.1] }}
          transition={{ delay: loop.delay, duration: loop.period, repeat: Infinity }}
        />
      </div>
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>{open && entry && trigger.current ? <PixelCard key="card" entry={entry} anchor={trigger.current} /> : null}</AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
});

function PixelColumns({ width }: { width: number }) {
  const skip = Math.max(0, PIXELS.length - TOTAL);
  // Entrance delays carry a random jitter; drawn once on the client.
  const jitter = useMemo(() => Array.from({ length: TOTAL }, () => Math.random() / 2), []);
  return (
    <div className="flex justify-end" style={{ minHeight: 504 }}>
      {HEIGHTS.map((h, r) => (
        <div key={r} className={`flex flex-col-reverse${width / 24 < COLS - r ? " hidden" : ""}`} style={{ flex: "0 0 24px" }}>
          {Array.from({ length: Math.min(h, ROWS) }, (_, s) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.02 * r + 0.03 * s + jitter[OFFSETS[r] + s] }}
              className="px"
              style={{ height: 24, width: 24 }}
            >
              <PixelTile entry={PIXELS[skip + OFFSETS[r] + s]} opacity={r / 53} />
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function HeroPixels({ caption }: { caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();
    setReady(true);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="col-[2/-1] row-1 hidden flex-col overflow-x-clip pt-36 pb-16 lg:flex">
      <div className="min-h-[392px] lg:min-h-[504px]">{ready ? <PixelColumns width={width} /> : null}</div>
      <motion.p
        className="mt-6 text-caption-foreground text-sm duration-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        {caption}
      </motion.p>
    </div>
  );
}
