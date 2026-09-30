"use client";

import { motion } from "motion/react";
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";

// Hero strip wrapper: fades in after the header copy.
export function CreatorListFade({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ bounce: 0, delay: 0.6, duration: 0.6 }}
      className="relative flex w-full overflow-x-hidden"
    >
      {children}
    </motion.div>
  );
}

type Mode = "autoscroll" | "autoplay";

// Endless slide loop (center aligned, fixed 60fps step like the scroll engine the
// source uses). "autoscroll" drifts 1px per frame; "autoplay" advances one slide
// every 3500ms with the seek integrator (duration 25, friction 0.68). Both can be
// dragged and resume on release.
const STEP = 1000 / 60;
const DURATION = 25;
const FRICTION = 0.68;
const SPEED = 1;
const DELAY = 3500;

export function LoopCarousel({
  mode,
  className,
  trackClassName,
  children,
}: {
  mode: Mode;
  className: string;
  trackClassName: string;
  children: ReactNode;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ next: () => void; prev: () => void } | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    if (!slides.length) return;

    let pos: number[] = []; // slide left at location 0, relative to viewport
    let size: number[] = []; // slide width
    let outer: number[] = []; // slide width + horizontal margins
    let total = 0;
    let vw = 0;
    let snaps: number[] = [];

    let location = 0;
    let target = 0;
    let velocity = 0;
    let duration = DURATION;
    let friction = FRICTION;
    let index = 0;
    let dragging = false;
    let hidden = document.visibilityState === "hidden";

    const measure = () => {
      track.style.transform = "translate3d(0px, 0px, 0px)";
      slides.forEach((s) => (s.style.transform = ""));
      const vr = viewport.getBoundingClientRect();
      vw = vr.width;
      pos = [];
      size = [];
      outer = [];
      slides.forEach((s) => {
        const r = s.getBoundingClientRect();
        const cs = getComputedStyle(s);
        pos.push(r.left - vr.left);
        size.push(r.width);
        outer.push(r.width + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight));
      });
      total = outer.reduce((a, b) => a + b, 0);
      snaps = pos.map((p, i) => vw / 2 - (p + size[i] / 2));
    };

    const render = () => {
      // Keep the location in one period; slide shifts make the wrap invisible.
      if (location < -total * 2 || location > total * 2) {
        const k = Math.trunc(location / total) * total;
        location -= k;
        target -= k;
      }
      track.style.transform = `translate3d(${location}px, 0px, 0px)`;
      const a = (vw - total) / 2;
      slides.forEach((s, i) => {
        const x = pos[i] + location;
        const m = ((((x - a) % total) + total) % total) + a;
        const shift = m - x;
        s.style.transform = `translate3d(${shift}px, 0px, 0px)`;
      });
    };

    const seek = () => {
      velocity += (target - location) / duration;
      velocity *= friction;
      location += velocity;
    };

    // Nearest snap location (in any loop period) to a given location.
    const nearest = (loc: number) => {
      let best = 0;
      let bestD = Infinity;
      let bestI = 0;
      snaps.forEach((s, i) => {
        const k = Math.round((loc - s) / total);
        const c = s + k * total;
        const d = Math.abs(c - loc);
        if (d < bestD) {
          bestD = d;
          best = c;
          bestI = i;
        }
      });
      return { loc: best, i: bestI };
    };

    const scrollBy = (dir: 1 | -1) => {
      const from = nearest(target);
      const i = (from.i + dir + slides.length) % slides.length;
      const step = dir === 1 ? -outer[from.i] : outer[i];
      target = from.loc + step;
      index = i;
      duration = DURATION;
      friction = FRICTION;
    };

    measure();
    location = target = snaps[0];
    render();

    let timer = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      if (mode !== "autoplay" || dragging || hidden) return;
      timer = window.setTimeout(() => {
        scrollBy(1);
        schedule();
      }, DELAY);
    };
    schedule();

    api.current = {
      next: () => {
        scrollBy(1);
        schedule();
      },
      prev: () => {
        scrollBy(-1);
        schedule();
      },
    };

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      acc += Math.min(now - last, 250);
      last = now;
      while (acc >= STEP) {
        acc -= STEP;
        if (mode === "autoscroll" && !dragging && !hidden) {
          location -= SPEED;
          target = location;
          velocity = 0;
        } else {
          seek();
        }
      }
      render();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pointer drag.
    let startX = 0;
    let lastX = 0;
    let lastT = 0;
    let pv = 0;
    let pointerId = -1;
    let moved = false;
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      moved = false;
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      lastT = e.timeStamp;
      pv = 0;
      target = location;
      velocity = 0;
      duration = 0.75;
      friction = 0.3;
      window.clearTimeout(timer);
    };
    const move = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - lastX;
      if (!moved && Math.abs(e.clientX - startX) > 10) {
        moved = true;
        try {
          viewport.setPointerCapture(pointerId);
        } catch {}
      }
      const dt = Math.max(1, e.timeStamp - lastT);
      pv = dx / dt;
      lastX = e.clientX;
      lastT = e.timeStamp;
      target += dx;
      if (mode === "autoscroll") location = target;
    };
    const up = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      if (mode === "autoplay") {
        const force = pv * (e.pointerType === "mouse" ? 300 : 400);
        const n = nearest(target + force);
        target = n.loc;
        index = n.i;
        duration = DURATION;
        friction = FRICTION;
        schedule();
      } else {
        location = target;
      }
    };
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const vis = () => {
      hidden = document.visibilityState === "hidden";
      schedule();
    };
    const ro = new ResizeObserver(() => {
      const snapIndex = index;
      measure();
      if (mode === "autoplay") location = target = snaps[snapIndex];
      velocity = 0;
      render();
    });
    ro.observe(viewport);

    viewport.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    viewport.addEventListener("click", click, true);
    const noDrag = (e: DragEvent) => e.preventDefault();
    viewport.addEventListener("dragstart", noDrag);
    document.addEventListener("visibilitychange", vis);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      ro.disconnect();
      viewport.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      viewport.removeEventListener("click", click, true);
      viewport.removeEventListener("dragstart", noDrag);
      document.removeEventListener("visibilitychange", vis);
      api.current = null;
    };
  }, [mode]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      api.current?.prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      api.current?.next();
    }
  };

  return (
    <div onKeyDownCapture={onKey} className={`relative ${className}`} role="region" aria-roledescription="carousel" data-slot="carousel">
      <div ref={viewportRef} className="overflow-hidden" data-slot="carousel-content">
        <div ref={trackRef} className={`flex ${trackClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
