"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "site-banner-dismissal";
// A dismissal lasts 5 days.
const DISMISS_MS = 432e6;

type Props = { uid: string; title: string; href: string };

/**
 * Announcement bar. Its presence drives `--site-header-banner-height` through
 * `:root:has(.site-banner)` in the stylesheet, so removing it collapses the header height.
 */
export function SiteBanner({ uid, title, href }: Props) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { uid?: string; until?: number };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved.uid === uid && typeof saved.until === "number" && saved.until > Date.now()) setDismissed(true);
    } catch {}
  }, [uid]);

  useEffect(() => {
    // The header height var changed: let height-dependent listeners re-measure.
    if (dismissed) window.dispatchEvent(new Event("resize"));
  }, [dismissed]);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ uid, until: Date.now() + DISMISS_MS }));
    } catch {}
  };

  if (dismissed) return null;
  return (
    <div data-banner-uid={uid} className="site-banner dark isolate flex h-(--site-header-banner-visible-height) w-full items-center justify-center bg-(--color-banner-background)" style={{ boxShadow: "0px 1px 2px 0px oklch(0 0 0 / 0.01),0px 2px 4px -1px oklch(0 0 0 / 0.02),0px 4px 8px -2px oklch(0 0 0 / 0.03)" }}>
      <div className="container flex h-full items-center justify-center">
        <div className="relative flex size-full items-stretch justify-center px-12 max-md:justify-start max-md:pl-0">
          <a className="group relative flex size-full items-center justify-center gap-1.5 text-primary-foreground max-md:justify-start" href={href} onClick={dismiss}>
            <span className="joshuattio-group-hover-underline relative truncate text-[13px]/5">
              {title}
            </span>
            {" "}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-[translate] duration-400 ease-in-out group-hover:translate-x-0.25 group-hover:duration-150 group-active:translate-x-0.25 group-active:duration-50 motion-reduce:transition-none motion-reduce:group-active:translate-x-0 motion-reduce:group-hover:translate-x-0">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="M2.25 7h9.5m0 0L8.357 3.5M11.75 7l-3.393 3.5" />
            </svg>
          </a>
          <button type="button" onClick={dismiss} className="inline-flex cursor-pointer items-center justify-center text-nowrap border text-base transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default size-8 rounded-[10px] button-outline !bg-transparent !border-transparent dark absolute top-1/2 right-0 -translate-y-1/2 hover:!border-tertiary-foreground" aria-label="Dismiss banner">
            <svg className="dark:text-white-500 text-tertiary-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" d="m12.5 5.5-7 7m7 0-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
