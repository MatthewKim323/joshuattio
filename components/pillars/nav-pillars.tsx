"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE_SWITCH = [0.33, 1, 0.68, 1] as const;

const FEATURES = [
  { id: "home-2026-generate-pipeline", nav: "Build pipeline" },
  { id: "home-2026-convert-leads", nav: "Convert leads" },
  { id: "home-2026-run-sales-motions", nav: "Run sales motions" },
  { id: "home-2026-forecast-revenue", nav: "Forecast revenue" },
  { id: "home-2026-retain-and-expand", nav: "Retain and expand" },
] as const;

type Navigate = (e: MouseEvent<HTMLAnchorElement>, id: string) => void;

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function NavLink({
  feature,
  isActive,
  onClick,
  reduceMotion,
}: {
  feature: (typeof FEATURES)[number];
  isActive: boolean;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
  reduceMotion: boolean;
}) {
  return (
    <a
      href={`/#${feature.id}`}
      onClick={onClick}
      className="group relative block py-1 pr-4 pl-7 font-medium text-[15px] leading-[1.2] md:pr-5 md:pl-8 lg:pl-0 lg:text-[18px]"
      aria-current={isActive ? "location" : undefined}
    >
      {isActive ? (
        <motion.span
          aria-hidden="true"
          layoutId="pipeline-nav-indicator"
          className="absolute inset-y-0 -left-px w-0.5 bg-accent-stroke lg:-left-[calc(20%+1px)]"
          transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: EASE_SWITCH }}
        />
      ) : null}
      <span
        className={cx(
          "[--nav-idle:var(--color-disabled-foreground)] group-hover:[--nav-idle:var(--color-black-700)]",
          "[transition:color_320ms_var(--ease-out-cubic)] motion-reduce:[transition:none]",
          isActive ? "text-primary-foreground" : "text-[color:var(--nav-idle)]",
        )}
      >
        {feature.nav}
      </span>
    </a>
  );
}

function MobileNav({
  activeId,
  onNavigate,
  reduceMotion,
}: {
  activeId: string;
  onNavigate: Navigate;
  reduceMotion: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  // Keep the active tab pinned to the left edge of the scroller.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const link = el.querySelector<HTMLElement>(`[data-feature-id="${activeId}"]`);
    if (!link) return;
    const padLeft = Number.parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const delta = link.getBoundingClientRect().left - el.getBoundingClientRect().left - padLeft;
    if (Math.abs(delta) < 1) return;
    el.scrollTo({ behavior: reduceMotion ? "auto" : "smooth", left: el.scrollLeft + delta });
  }, [activeId, reduceMotion]);

  return (
    <div className="relative lg:hidden">
      <div ref={scroller} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ol className="flex w-max min-w-full items-stretch gap-px bg-subtle-stroke">
          {FEATURES.map((f) => {
            const active = activeId === f.id;
            return (
              <li key={f.id} className="flex-1">
                <a
                  href={`/#${f.id}`}
                  onClick={(e) => onNavigate(e, f.id)}
                  data-feature-id={f.id}
                  className={cx(
                    "flex h-full items-center justify-center whitespace-nowrap px-5 py-4 text-sm transition-colors duration-200 ease-out",
                    active
                      ? "bg-surface-subtle text-primary-foreground"
                      : "bg-secondary-background text-tertiary-foreground hover:bg-white-300 hover:text-primary-foreground",
                  )}
                  aria-current={active ? "location" : undefined}
                >
                  {f.nav}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
      <div
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-secondary-background to-transparent transition-opacity duration-200",
          atStart && "opacity-0",
        )}
      />
      <div
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-secondary-background to-transparent transition-opacity duration-200",
          atEnd && "opacity-0",
        )}
      />
    </div>
  );
}

export function PillarsNav() {
  const [activeId, setActiveId] = useState<string>(FEATURES[0].id);
  const reduceMotion = !!useReducedMotion();
  const programmatic = useRef(false);
  const releaseTimer = useRef(0);

  const onNavigate: Navigate = (e, id) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    setActiveId(id);
    const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    if (Math.abs(target.getBoundingClientRect().top - margin) < 2) return;
    if (reduceMotion) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }
    programmatic.current = true;
    window.clearTimeout(releaseTimer.current);
    const release = () => {
      window.clearTimeout(releaseTimer.current);
      programmatic.current = false;
    };
    window.addEventListener("scrollend", release, { once: true });
    releaseTimer.current = window.setTimeout(release, 1500);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Active chapter = last article whose top has passed 45% of the viewport.
  useEffect(() => {
    const articles = FEATURES.map((f) => document.getElementById(f.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!articles.length) return;
    let raf = 0;
    let marks: { id: string; top: number }[] = [];
    const measure = () => {
      const line = 0.45 * window.innerHeight;
      marks = articles.map((el) => ({
        id: el.id,
        top: el.getBoundingClientRect().top + window.scrollY - line,
      }));
    };
    const update = () => {
      raf = 0;
      if (programmatic.current) return;
      if (!marks.length) measure();
      const y = window.scrollY;
      let id = marks[0]?.id ?? articles[0].id;
      for (const m of marks) if (y >= m.top) id = m.id;
      setActiveId(id);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      schedule();
    };
    const ro = new ResizeObserver(onResize);
    for (const el of articles) ro.observe(el);
    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    const timer = releaseTimer;
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <nav
      aria-label="Homepage platform showcases"
      className="sticky top-(--site-header-height) z-30 -mb-px border-subtle-stroke border-b bg-secondary-background max-lg:shadow-joshuattio-2 lg:col-[1/7] lg:mb-0 lg:grid lg:h-[calc(100vh-var(--site-header-height))] lg:grid-cols-subgrid lg:border-r lg:border-b-0 lg:pt-20 xl:pt-28"
    >
      <MobileNav activeId={activeId} onNavigate={onNavigate} reduceMotion={reduceMotion} />
      <ol className="hidden lg:col-[2/-1] lg:flex lg:flex-col lg:gap-2">
        {FEATURES.map((f) => (
          <li key={f.id}>
            <NavLink
              feature={f}
              isActive={activeId === f.id}
              reduceMotion={reduceMotion}
              onClick={(e) => onNavigate(e, f.id)}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}
