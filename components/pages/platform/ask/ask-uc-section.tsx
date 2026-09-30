"use client";
// Dark "Universal Context" section: pointer-tracked signal lines with comets, and header dark mode.
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AskVisualizer } from "./ask-visualizer";

const HEADER_DARK_EVENT = "site-header-theme-dark";

/** Tells the site header it is over this dark section while the header line sits inside it. */
function useHeaderDarkMode(sectionRef: React.RefObject<HTMLElement | null>) {
  const id = useId();
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let dark = false;
    const emit = (next: boolean) => {
      if (dark === next) return;
      dark = next;
      window.dispatchEvent(new CustomEvent(HEADER_DARK_EVENT, { detail: { id, isDark: next } }));
    };
    const headerHeight = () => {
      const probe = document.createElement("div");
      probe.style.cssText = "position:absolute;visibility:hidden;height:var(--site-header-height)";
      document.body.appendChild(probe);
      const h = probe.getBoundingClientRect().height;
      probe.remove();
      return h;
    };
    let offset = headerHeight();
    const check = () => {
      const r = el.getBoundingClientRect();
      emit(r.top <= offset && r.bottom > offset);
    };
    let raf: number | null = null;
    const onScroll = () => {
      if (raf === null)
        raf = requestAnimationFrame(() => {
          check();
          raf = null;
        });
    };
    const onResize = () => {
      offset = headerHeight();
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf !== null) cancelAnimationFrame(raf);
      if (dark) window.dispatchEvent(new CustomEvent(HEADER_DARK_EVENT, { detail: { id, isDark: false } }));
    };
  }, [sectionRef, id]);
}

export function AskUcSection({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null),
    [mouseX, setMouseX] = useState(-1),
    [mouseY, setMouseY] = useState(-1),
    raf = useRef<number | null>(null),
    x = useRef(-1),
    y = useRef(-1);
  useHeaderDarkMode(ref);
  return (
    <section
      ref={ref}
      className={className}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.current = e.clientX - r.left;
        y.current = e.clientY - r.top;
        if (null === raf.current)
          raf.current = requestAnimationFrame(() => {
            setMouseX(x.current);
            setMouseY(y.current);
            raf.current = null;
          });
      }}
      onMouseLeave={() => {
        if (null !== raf.current) {
          cancelAnimationFrame(raf.current);
          raf.current = null;
        }
        setMouseX(-1);
        setMouseY(-1);
      }}
    >
      <AskVisualizer
        orientation="top-to-bottom"
        state="i_universalContext"
        mouseX={mouseX}
        mouseY={mouseY}
        enableComets={true}
        anchorLinesToCenter={true}
        colorMode="dark"
        className="absolute inset-x-0 top-0 h-3/5 max-lg:h-1/3 max-xl:h-1/2"
      />
      {children}
    </section>
  );
}
