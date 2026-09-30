"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { animate, type AnimationPlaybackControls } from "motion/react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Slider default animation: 500ms, easeOutQuint.
const SLIDE_MS = 500;
const easeOutQuint = (t: number) => 1 + --t * t * t * t * t;

type Drag = { id: number; x: number; y: number; start: number; locked: boolean | null; last: number; lastT: number; v: number };

// Looping slider (perView 1, given spacing): drag to page, snaps to the nearest
// slide with the 500ms easeOutQuint slide animation. `transforms[i]` is the
// translate for slide i, keeping each slide in the loop copy nearest the viewport.
export function useLoopSlider(count: number, spacing: number, onChange: (rel: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [pos, setPos] = useState(0);
  const posRef = useRef(0);
  const anim = useRef<AnimationPlaybackControls | null>(null);
  const drag = useRef<Drag | null>(null);
  const relRef = useRef(0);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const set = useCallback(
    (p: number) => {
      posRef.current = p;
      setPos(p);
      const rel = ((Math.round(p) % count) + count) % count;
      if (rel !== relRef.current) {
        relRef.current = rel;
        onChangeRef.current(rel);
      }
    },
    [count],
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

  useEffect(() => () => anim.current?.stop(), []);

  const moveTo = useCallback(
    (target: number) => {
      anim.current?.stop();
      if (target === posRef.current) return;
      anim.current = animate(posRef.current, target, { duration: SLIDE_MS / 1000, ease: easeOutQuint, onUpdate: set });
    },
    [set],
  );

  // moveToIdx(rel): shortest way round the loop.
  const moveToIdx = useCallback(
    (idx: number) => {
      const base = Math.round(posRef.current);
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
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, start: posRef.current, locked: null, last: e.clientX, lastT: e.timeStamp, v: 0 };
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
    if (!d.locked) {
      // a tap mid-animation settles on the nearest slide
      if (posRef.current !== Math.round(posRef.current)) moveTo(Math.round(posRef.current));
      return;
    }
    let target = Math.round(posRef.current);
    // a flick pages one slide in the direction of travel
    if (Math.abs(d.v) > 0.3 && target === Math.round(d.start)) target = Math.round(d.start) + (d.v < 0 ? 1 : -1);
    moveTo(target);
  };

  const transforms = Array.from({ length: count }, (_, i) => {
    if (!width) return 0;
    const rel = ((((i - pos + count / 2) % count) + count) % count) - count / 2;
    return rel * step - i * width;
  });

  return { ref, width, transforms, moveToIdx, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp } };
}
