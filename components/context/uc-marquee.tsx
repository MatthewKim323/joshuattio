"use client";
import { useEffect, useRef, type ReactNode } from "react";

/*
 * Endless integrations row. Auto-scroll advances 0.5px per 60Hz frame
 * (30px/s) to the left, never pauses on hover, focus or interaction, and only
 * runs while the row is within 100px of the viewport. The track holds the
 * tile set three times, so wrapping by one set width is seamless.
 */
const SPEED = 0.5;
const SET_COUNT = 3;

export function UcMarquee({ children, initialOffset = 0 }: { children: ReactNode; initialOffset?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const slides = track.children;
    let offset = initialOffset;
    let period = 0;
    const measure = () => {
      const per = slides.length / SET_COUNT;
      const a = slides[0] as HTMLElement | undefined;
      const b = slides[per] as HTMLElement | undefined;
      period = a && b ? b.offsetLeft - a.offsetLeft : 0;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    let raf = 0;
    let last = 0;
    let playing = false;
    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 100) : 1000 / 60;
      last = now;
      offset -= SPEED * (dt / (1000 / 60));
      if (period > 0) while (offset <= -period) offset += period;
      track.style.transform = `translate3d(${offset}px, 0px, 0px)`;
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !playing) {
          playing = true;
          last = 0;
          raf = requestAnimationFrame(tick);
        } else if (!e.isIntersecting && playing) {
          playing = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "100px" },
    );
    io.observe(track.parentElement ?? track);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [initialOffset]);

  return (
    <div
      ref={trackRef}
      className="flex -ml-6 items-center lg:-ml-8"
      style={{ transform: `translate3d(${initialOffset}px, 0px, 0px)` }}
    >
      {children}
    </div>
  );
}
