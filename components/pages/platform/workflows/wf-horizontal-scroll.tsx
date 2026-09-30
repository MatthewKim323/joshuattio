"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** Snap scroller whose edge fades show only while more content sits beyond that edge. */
export function WfHorizontalScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);
  return (
    <div className="relative">
      <div ref={ref} className="scrollbar-none snap-x snap-mandatory overflow-x-auto overscroll-x-none scroll-pl-[8.333%]">
        {children}
      </div>
      <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-primary-background to-transparent transition-opacity duration-200${atStart ? " opacity-0" : ""}`} />
      <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-primary-background to-transparent transition-opacity duration-200${atEnd ? " opacity-0" : ""}`} />
    </div>
  );
}
