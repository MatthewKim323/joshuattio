"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, animate, motion, type AnimationPlaybackControls } from "motion/react";
import { SHELF_HERO_FOR_DATA_VIEWS, type DataViewKey } from "./data-views";

const VIEWS = Object.entries(SHELF_HERO_FOR_DATA_VIEWS) as [DataViewKey, (typeof SHELF_HERO_FOR_DATA_VIEWS)[DataViewKey]][];

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Slider default animation: 500ms, easeOutQuint.
const SLIDE_MS = 500;
const easeOutQuint = (t: number) => 1 + --t * t * t * t * t;

/* ------------------------------------------------------------------ desktop */

// Aspect pinned to the served rendition (3840 x 1906) so heights match to the sub-pixel.
function ScreenFrame({ className, src }: { className: string; src: string }) {
  return (
    <div className={className}>
      <div className="rounded-[20px] border border-white-100/50 bg-[linear-gradient(199deg,_#EDEFF3_11.23%,_#E4E7EC_87.61%)] p-[9px] shadow-[0px_10px_30px_-4px_rgba(28,_40,_64,_0.10),_0px_8px_8px_-8px_rgba(28,_40,_64,_0.10),_0px_4px_4px_-6px_rgba(28,_40,_64,_0.14),_0px_0px_0px_1px_#EDEFF3]">
        <div className="rounded-[11px] shadow-[0px_2px_6px_0px_rgba(28,_40,_64,_0.04)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Sales" width="4536" height="2252" decoding="async" data-nimg="1" className="w-full rounded-[inherit] bg-primary-background" style={{ color: "transparent", aspectRatio: "3840 / 1906" }} srcSet={`${src} 1x`} src={src} />
        </div>
      </div>
    </div>
  );
}

// Preload the other screens so a tab switch never shows an empty frame.
function usePreloadScreens() {
  useEffect(() => {
    for (const [, v] of VIEWS) {
      const img = new Image();
      img.src = v.screenImage.src;
    }
  }, []);
}

export function DataModelHeroDesktop({ className }: { className?: string }) {
  const [current, setCurrent] = useState<DataViewKey>("Sales");
  const { Cards, screenImage } = SHELF_HERO_FOR_DATA_VIEWS[current];
  usePreloadScreens();
  return (
    <div className={`fade-in -spin-in-x-6 slide-in-from-bottom-6 container w-full origin-bottom animate-in flex-col items-center duration-1250 ease-out ${className ?? ""}`}>
      <div className="pointer-events-none -mt-[47px] w-full xl:-mt-[50px]">
        <div className="grid">
          <AnimatePresence initial={false}>
            <motion.div
              key={current}
              className="col-start-1 row-start-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.3, ease: "easeOut" }, x: "0" }}
              exit={{ opacity: 0, transition: { delay: 0.3, duration: 0.2, ease: "easeIn" }, zIndex: -1 }}
            >
              <Cards />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="pointer-events-auto flex w-full flex-col items-center pt-20">
          <ScreenFrame className="max-w-6xl" src={screenImage.src} />
          <ul className="flex gap-x-2 rounded-[15px] bg-primary-background p-2.5 shadow-xl sticky bottom-5 lg:mt-[52px] xl:mt-[37px]">
            {VIEWS.map(([key, { icon }]) => (
              <li key={key}>
                <button
                  type="button"
                  className={`flex cursor-pointer items-center gap-x-1 rounded-[10px] border border-subtle-stroke py-[5px] pr-[11px] pl-[9px] text-sm text-tertiary-foreground transition-[background-color,box-shadow] duration-200 ease-out hover:bg-secondary-background focus-visible:outline-hidden focus-visible:ring-3 focus-visible:active:ring-2${current === key ? " bg-surface-subtle" : ""}`}
                  onClick={() => setCurrent(key)}
                >
                  {icon}
                  <span>{key}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- mobile */

type Drag = { id: number; x: number; y: number; start: number; moved: boolean; locked: boolean | null; last: number; lastT: number; v: number };

// Looping card slider (perView 1, spacing 24): drag to page, snaps to the
// nearest slide with the 500ms easeOutQuint slide animation.
function useLoopSlider(count: number, spacing: number, onChange: (rel: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [pos, setPos] = useState(0); // in slides
  const posRef = useRef(0);
  const anim = useRef<AnimationPlaybackControls | null>(null);
  const drag = useRef<Drag | null>(null);
  const relRef = useRef(0);

  const set = useCallback(
    (p: number) => {
      posRef.current = p;
      setPos(p);
      const rel = ((Math.round(p) % count) + count) % count;
      if (rel !== relRef.current) {
        relRef.current = rel;
        onChange(rel);
      }
    },
    [count, onChange],
  );

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const moveTo = useCallback(
    (target: number) => {
      anim.current?.stop();
      anim.current = animate(posRef.current, target, { duration: SLIDE_MS / 1000, ease: easeOutQuint, onUpdate: set });
    },
    [set],
  );

  // moveToIdx(rel): shortest way round the loop.
  const moveToIdx = useCallback(
    (idx: number) => {
      const cur = posRef.current;
      const base = Math.round(cur);
      const baseRel = ((base % count) + count) % count;
      let d = idx - baseRel;
      if (d > count / 2) d -= count;
      if (d < -count / 2) d += count;
      moveTo(base + d);
    },
    [count, moveTo],
  );

  const step = width + spacing;

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    anim.current?.stop();
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, start: posRef.current, moved: false, locked: null, last: e.clientX, lastT: e.timeStamp, v: 0 };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId || !step) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (d.locked === null && Math.hypot(dx, dy) > 5) {
      d.locked = Math.abs(dx) >= Math.abs(dy);
      if (d.locked) e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (!d.locked) return;
    d.moved = true;
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.v = (e.clientX - d.last) / dt;
    d.last = e.clientX;
    d.lastT = e.timeStamp;
    set(d.start - dx / step);
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.locked) return;
    const p = posRef.current;
    let target = Math.round(p);
    // a flick pages one slide in the direction of travel
    if (Math.abs(d.v) > 0.3 && target === Math.round(d.start)) target = Math.round(d.start) + (d.v < 0 ? 1 : -1);
    moveTo(target);
  };

  // per-slide translate, keeping each slide in the loop copy nearest the viewport
  const transforms = Array.from({ length: count }, (_, i) => {
    if (!width) return 0;
    const rel = ((((i - pos + count / 2) % count) + count) % count) - count / 2;
    return rel * step - i * width;
  });

  return { ref, width, transforms, moveToIdx, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp } };
}

// Free-mode tab strip: fit-content slides that slide so the active one leads.
function useTabStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const xRef = useRef(0);
  const anim = useRef<AnimationPlaybackControls | null>(null);
  const drag = useRef<{ id: number; x: number; start: number; locked: boolean | null; y: number } | null>(null);

  const bounds = () => {
    const el = ref.current;
    if (!el) return { max: 0, offsets: [] as number[] };
    const items = Array.from(el.children) as HTMLElement[];
    const total = items.reduce((s, c) => s + c.offsetWidth, 0);
    const max = Math.max(0, total - el.clientWidth);
    let acc = 0;
    const offsets = items.map((c) => {
      const o = acc;
      acc += c.offsetWidth;
      return o;
    });
    return { max, offsets };
  };
  const setAt = (v: number) => {
    xRef.current = v;
    setX(v);
  };
  const moveToIdx = (i: number) => {
    const { max, offsets } = bounds();
    const target = Math.min(offsets[i] ?? 0, max);
    anim.current?.stop();
    anim.current = animate(xRef.current, target, { duration: SLIDE_MS / 1000, ease: easeOutQuint, onUpdate: setAt });
  };
  const handlers = {
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      anim.current?.stop();
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, start: xRef.current, locked: null };
    },
    onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (!d || d.id !== e.pointerId) return;
      const dx = e.clientX - d.x;
      if (d.locked === null && Math.hypot(dx, e.clientY - d.y) > 5) {
        d.locked = Math.abs(dx) >= Math.abs(e.clientY - d.y);
        if (d.locked) e.currentTarget.setPointerCapture(e.pointerId);
      }
      if (!d.locked) return;
      const { max } = bounds();
      setAt(Math.min(max, Math.max(0, d.start - dx)));
    },
    onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (drag.current?.id === e.pointerId) drag.current = null;
    },
  };
  return { ref, x, moveToIdx, handlers };
}

export function DataModelHeroMobile({ className }: { className?: string }) {
  const [current, setCurrent] = useState(0);
  const [created, setCreated] = useState(false);
  const tabs = useTabStrip();
  const tabsMove = useRef(tabs.moveToIdx);
  useEffect(() => {
    tabsMove.current = tabs.moveToIdx;
  });
  const onChange = useCallback((rel: number) => {
    setCurrent(rel);
    tabsMove.current(rel);
  }, []);
  const slider = useLoopSlider(VIEWS.length, 24, onChange);

  useEffect(() => {
    setCreated(true);
  }, []);

  const ready = created && slider.width > 0;

  return (
    <>
      <ul className={`scrollbar-none w-full justify-start overflow-x-auto overflow-y-hidden sm:justify-center mt-20 flex isolate ${className ?? ""}`}>
        <div ref={tabs.ref} className="keen-slider justify-start py-3 sm:justify-center" {...tabs.handlers}>
          {VIEWS.map(([key, { icon }], i) => (
            <li
              key={key}
              className="keen-slider__slide p-1 first:pl-4 xs:first:pl-6 last:pr-4 xs:last:pr-6"
              style={{ maxWidth: "fit-content", minWidth: "fit-content", transform: `translate3d(${-tabs.x}px, 0px, 0px)` }}
            >
              <button
                type="button"
                onClick={() => slider.moveToIdx(i)}
                className={`flex shrink-0 cursor-pointer items-center gap-x-1 whitespace-nowrap rounded-[10px] border border-subtle-stroke ${current === i ? "" : "bg-primary-background "}py-[9px] pr-[11px] pl-[9px] text-sm text-tertiary-foreground transition-[background-color,box-shadow] duration-200 ease-out hover:bg-secondary-background focus-visible:outline-hidden focus-visible:ring-3 focus-visible:active:ring-2${current === i ? " bg-surface-subtle" : ""}`}
              >
                {icon}
                <span>{key}</span>
              </button>
            </li>
          ))}
        </div>
      </ul>
      <div className={`container mt-5 isolate ${className ?? ""}`}>
        <div ref={slider.ref} className="keen-slider" {...slider.handlers}>
          {VIEWS.map(([key, { CardsMobile }], i) => (
            <div
              key={key}
              className={`keen-slider__slide${i !== 0 && !created ? " hidden" : ""}`}
              style={ready ? { minWidth: `${slider.width}px`, maxWidth: `${slider.width}px`, transform: `translate3d(${slider.transforms[i]}px, 0px, 0px)` } : undefined}
            >
              <CardsMobile />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-x-2">
          {VIEWS.map(([key], i) => (
            <button
              key={key}
              type="button"
              aria-label={`Go to data view ${i + 1}`}
              onClick={() => slider.moveToIdx(i)}
              className={`h-2 w-2 rounded-full ${current !== i ? "bg-surface" : "bg-muted-strong-background"}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
