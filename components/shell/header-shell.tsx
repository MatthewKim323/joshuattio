"use client";
import { createContext, use, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";

/** Window event a dark section fires while it sits under the header's bottom edge. */
export const HEADER_DARK_EVENT = "site-header-theme-dark";

type HeaderContextValue = { isMenuOpen: boolean; setIsMenuOpen: (open: boolean) => void };
const HeaderContext = createContext<HeaderContextValue | undefined>(undefined);

export function useHeaderContext() {
  const ctx = use(HeaderContext);
  if (!ctx) throw new Error("useHeaderContext must be used within HeaderShell");
  return ctx;
}

function isOffsetInside({ elementTop, elementBottom, offset }: { elementTop: number; elementBottom: number; offset: number }) {
  return elementTop <= offset && elementBottom > offset;
}

function measureCssVarHeight(cssVar: string) {
  const probe = document.createElement("div");
  probe.style.cssText = `position:absolute;visibility:hidden;height:var(${cssVar})`;
  document.body.appendChild(probe);
  const h = probe.getBoundingClientRect().height;
  probe.remove();
  return h;
}

/**
 * Reports whether `section` is under the header's bottom edge (the header height var),
 * rAF-throttled on scroll, re-measured on resize. Returns a cleanup.
 */
export function watchDarkSection(section: HTMLElement, id: string, cssVar = "--site-header-height") {
  let current = false;
  const report = (isDark: boolean) => {
    if (current === isDark) return;
    current = isDark;
    window.dispatchEvent(new CustomEvent(HEADER_DARK_EVENT, { detail: { id, isDark } }));
  };
  let offset = measureCssVarHeight(cssVar);
  const check = () => {
    report(isOffsetInside({
      elementBottom: section.getBoundingClientRect().bottom,
      elementTop: section.getBoundingClientRect().top,
      offset,
    }));
  };
  let raf: number | null = null;
  const onScroll = () => {
    if (raf === null) raf = requestAnimationFrame(() => { check(); raf = null; });
  };
  const onResize = () => { offset = measureCssVarHeight(cssVar); onScroll(); };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  check();
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    if (raf !== null) cancelAnimationFrame(raf);
    report(false);
  };
}

/** Hook form for a section component that should turn the header dark while under it. */
export function useHeaderDarkSection(ref: RefObject<HTMLElement | null>) {
  const id = useId();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return watchDarkSection(el, id);
  }, [ref, id]);
}

// Top-level dark blocks of the page body that flip the header theme. Sections that
// register themselves with useHeaderDarkSection carry data-header-dark-managed.
const DARK_SECTION_SELECTOR = "main section.dark.bg-primary-background";

/** Sticky header wrapper: owns the mobile menu state and the dynamic dark theme. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const darkIds = useRef(new Set<string>());
  const ref = useRef<HTMLDivElement>(null);
  const menuOpenRef = useRef(isMenuOpen);

  useEffect(() => {
    menuOpenRef.current = isMenuOpen;
    ref.current?.classList.toggle("dark", !isMenuOpen && darkIds.current.size > 0);
  }, [isMenuOpen]);

  useEffect(() => {
    const onDark = (e: Event) => {
      if (!(e instanceof CustomEvent)) return;
      const { id, isDark } = e.detail as { id: string; isDark: boolean };
      if (isDark) darkIds.current.add(id);
      else darkIds.current.delete(id);
      ref.current?.classList.toggle("dark", !menuOpenRef.current && darkIds.current.size > 0);
    };
    window.addEventListener(HEADER_DARK_EVENT, onDark);
    const sections = Array.from(document.querySelectorAll<HTMLElement>(DARK_SECTION_SELECTOR))
      .filter((el) => !el.hasAttribute("data-header-dark-managed") && !el.parentElement?.closest("section.dark"));
    const cleanups = sections.map((el, i) => watchDarkSection(el, `shell-dark-${i}`));
    const wrapper = ref.current;
    return () => {
      cleanups.forEach((c) => c());
      window.removeEventListener(HEADER_DARK_EVENT, onDark);
      wrapper?.classList.remove("dark");
    };
  }, []);

  return (
    <HeaderContext value={{ isMenuOpen, setIsMenuOpen }}>
      <div ref={ref} className="sticky top-0 z-(--site-header-z-index)">
        {children}
      </div>
    </HeaderContext>
  );
}
