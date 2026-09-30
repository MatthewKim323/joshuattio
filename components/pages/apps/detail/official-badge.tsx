"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function OfficialBadgeIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path
        d="M6.20801 1.34399C6.63641 0.885598 7.36357 0.885598 7.79199 1.34399L8.53027 2.13403C8.74384 2.36249 9.04585 2.48724 9.3584 2.47681L10.4395 2.44067C11.0663 2.4197 11.5798 2.93384 11.5586 3.56079L11.5234 4.64087C11.5129 4.95363 11.6376 5.25631 11.8662 5.46997L12.6562 6.20825C13.1143 6.63654 13.1141 7.36281 12.6562 7.79126L11.8662 8.53052C11.6377 8.7441 11.5129 9.04605 11.5234 9.35864L11.5586 10.4397C11.5797 11.0666 11.0663 11.5807 10.4395 11.5598L9.3584 11.5227C9.04582 11.5123 8.74383 11.638 8.53027 11.8665L7.79199 12.6565C7.36359 13.1148 6.63639 13.1148 6.20801 12.6565L5.46973 11.8665C5.25615 11.638 4.95418 11.5123 4.6416 11.5227L3.56152 11.5598C2.93452 11.581 2.42031 11.0668 2.44141 10.4397L2.47754 9.35864C2.48797 9.04605 2.36228 8.74409 2.13379 8.53052L1.34375 7.79126C0.885964 7.36284 0.885757 6.63655 1.34375 6.20825L2.13379 5.46997C2.3624 5.25629 2.4881 4.95363 2.47754 4.64087L2.44141 3.56079C2.42022 2.93371 2.93446 2.41948 3.56152 2.44067L4.6416 2.47681C4.95412 2.48725 5.25615 2.36245 5.46973 2.13403L6.20801 1.34399ZM9.29102 5.09302C9.06634 4.93254 8.7533 4.9846 8.59277 5.20923L6.68848 7.87622C6.59009 8.01335 6.38652 8.01519 6.28516 7.88013L5.40039 6.70044C5.23478 6.47963 4.92109 6.43444 4.7002 6.59985C4.47948 6.76548 4.43423 7.07919 4.59961 7.30005L5.48535 8.48071C5.99258 9.15672 7.01046 9.14475 7.50195 8.45728L9.40723 5.79126C9.5677 5.5666 9.51561 5.25355 9.29102 5.09302Z"
        fill="currentColor"
      />
    </svg>
  );
}

const OPEN_DELAY = 150; // provider delay
const GROUP_TIMEOUT = 400; // hover another badge within this window: opens instantly
const SIDE_OFFSET = 4;
const SELECTOR = '[data-base-ui-tooltip-trigger][aria-label="Official app"]';

type Tip = { x: number; y: number; id: number };

/**
 * One tooltip for every "Official app" badge on the page (delegated): opens above the hovered or
 * focused badge after 150ms, scales/fades in and out over 150ms. Disabled on touch screens.
 */
export function OfficialBadgeTooltips() {
  const [tip, setTip] = useState<Tip | null>(null);
  const [phase, setPhase] = useState<"start" | "open" | "end">("start");
  const trigger = useRef<HTMLElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastClose = useRef(0);
  const counter = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const place = (el: HTMLElement, instant: boolean) => {
      const r = el.getBoundingClientRect();
      counter.current += 1;
      trigger.current?.removeAttribute("data-popup-open");
      trigger.current = el;
      el.setAttribute("data-popup-open", "");
      clearTimeout(closeTimer.current);
      setTip({ x: r.left + r.width / 2, y: r.top - SIDE_OFFSET, id: counter.current });
      setPhase(instant ? "open" : "start");
      if (!instant) requestAnimationFrame(() => requestAnimationFrame(() => setPhase("open")));
    };
    const show = (el: HTMLElement) => {
      clearTimeout(openTimer.current);
      if (trigger.current === el) return;
      const instant = Date.now() - lastClose.current < GROUP_TIMEOUT || trigger.current !== null;
      if (instant) place(el, trigger.current !== null);
      else openTimer.current = setTimeout(() => place(el, false), OPEN_DELAY);
    };
    const hide = () => {
      clearTimeout(openTimer.current);
      if (!trigger.current) return;
      trigger.current.removeAttribute("data-popup-open");
      trigger.current = null;
      lastClose.current = Date.now();
      setPhase("end");
      closeTimer.current = setTimeout(() => setTip(null), 150);
    };
    const over = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.(SELECTOR) as HTMLElement | null;
      if (el) show(el);
    };
    const out = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.(SELECTOR);
      const to = (e as MouseEvent).relatedTarget as Element | null;
      if (el && !(to && el.contains(to))) hide();
    };
    const blur = (e: FocusEvent) => {
      if ((e.target as Element | null)?.closest?.(SELECTOR)) hide();
    };
    const onScroll = () => hide();
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    document.addEventListener("focusin", over);
    document.addEventListener("focusout", blur);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("focusin", over);
      document.removeEventListener("focusout", blur);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!tip) return null;
  const state = phase === "start" ? { "data-starting-style": "" } : phase === "end" ? { "data-ending-style": "" } : {};
  return createPortal(
    <div role="presentation" style={{ position: "fixed", left: tip.x, top: tip.y, transform: "translate(-50%, -100%)", zIndex: 50 }}>
      <div
        role="tooltip"
        {...state}
        data-side="top"
        className="flex h-7 items-center justify-center rounded-lg border border-subtle-stroke bg-primary-background px-2 shadow-joshuattio-3 transition-[transform,scale,opacity] duration-150 ease-in-out data-starting-style:scale-90 data-starting-style:opacity-0 data-ending-style:scale-90 data-ending-style:opacity-0"
      >
        <p className="whitespace-nowrap text-xs">{"Official app"}</p>
      </div>
    </div>,
    document.body,
  );
}
