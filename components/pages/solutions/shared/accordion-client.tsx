"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

// Single, non-collapsible accordion beside an image that follows the open item.
// Content mechanics follow the collapsible primitive: on every open change the
// panel is measured with its animation suppressed into
// --radix-collapsible-content-height, then the slideDown / slideUp keyframes
// (300ms, cubic-bezier(.65, 0, .35, 1)) run; a closing panel stays mounted until
// its animation ends. The item open on load never animates.

export type AccordionClientImage = { src: string; width: number; height: number; srcSet?: string };
export type AccordionClientItem = {
  question: string;
  answer: ReactNode;
  image: AccordionClientImage;
  triggerId: string;
  contentId: string;
};

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const TRIGGER =
  "group -mx-2 flex w-[calc(100%+16px)] cursor-pointer justify-between space-x-5 rounded-xl px-2 pt-[7px] pb-[7px] text-left text-lg outline-hidden transition-shadow duration-200 ease-in-out focus-visible:ring-3";
const CONTENT = "overflow-hidden will-change-[height] data-closed:animate-slideUp data-open:animate-slideDown";
const NAV_KEYS = ["Home", "End", "ArrowDown", "ArrowUp"];

function ChevronDown() {
  return (
    <svg className="mt-1 shrink-0 transition-transform group-data-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M5.25 7.125 9 10.875l3.75-3.75" />
    </svg>
  );
}

function Content({ open, id, labelledBy, children }: { open: boolean; id: string; labelledBy: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [present, setPresent] = useState(open);
  const initial = useRef(true);
  const original = useRef<{ transitionDuration: string; animationName: string } | null>(null);
  const shown = open || present;

  useEffect(() => {
    const raf = requestAnimationFrame(() => (initial.current = false));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Opening mounts at once; closing keeps the panel until slideUp ends.
  useIsoLayoutEffect(() => {
    if (open) setPresent(true);
  }, [open]);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    original.current = original.current ?? { transitionDuration: el.style.transitionDuration, animationName: el.style.animationName };
    el.style.transitionDuration = "0s";
    el.style.animationName = "none";
    const rect = el.getBoundingClientRect();
    if (rect.height) el.style.setProperty("--radix-collapsible-content-height", `${rect.height}px`);
    if (rect.width) el.style.setProperty("--radix-collapsible-content-width", `${rect.width}px`);
    if (!initial.current) {
      el.style.transitionDuration = original.current.transitionDuration;
      el.style.animationName = original.current.animationName;
    }
    if (!open) {
      // no exit animation to wait for (reduced motion or a hidden panel)
      const name = getComputedStyle(el).animationName;
      if (!name || name === "none") setPresent(false);
    }
  }, [open, shown]);

  const onAnimationEnd = () => {
    if (!open) setPresent(false);
  };

  return (
    <div
      ref={ref}
      data-state={open ? "open" : "closed"}
      id={id}
      hidden={!shown}
      role="region"
      aria-labelledby={labelledBy}
      data-orientation="vertical"
      className={CONTENT}
      style={
        {
          "--radix-accordion-content-height": "var(--radix-collapsible-content-height)",
          "--radix-accordion-content-width": "var(--radix-collapsible-content-width)",
        } as React.CSSProperties
      }
      onAnimationEnd={onAnimationEnd}
    >
      {shown ? children : null}
    </div>
  );
}

export function AccordionClient({ items }: { items: AccordionClientItem[] }) {
  const [value, setValue] = useState(items[0].question);
  const index = Math.max(0, items.findIndex((it) => it.question === value));
  const image = items[index].image;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!NAV_KEYS.includes(e.key)) return;
    const triggers = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("[data-radix-collection-item]"));
    const i = triggers.indexOf(e.target as HTMLButtonElement);
    if (i === -1) return;
    e.preventDefault();
    const last = triggers.length - 1;
    let next = i;
    if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else if (e.key === "ArrowDown") next = i + 1 > last ? 0 : i + 1;
    else if (e.key === "ArrowUp") next = i - 1 < 0 ? last : i - 1;
    triggers[next % triggers.length]?.focus();
  };

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-10 xl:grid-cols-10">
      <div className="col-span-full lg:col-span-6 xl:col-span-4" data-orientation="vertical" onKeyDown={onKeyDown}>
        {items.map((item) => {
          const open = item.question === value;
          const state = open ? "open" : "closed";
          return (
            <div key={item.question} className="border-weak-stroke border-t pt-[23px] pb-[21px] last:border-b">
              <div data-state={state} data-orientation="vertical" className="-m-4 p-4">
                <h3 data-orientation="vertical" data-state={state}>
                  <button
                    type="button"
                    aria-controls={open ? item.contentId : undefined}
                    aria-expanded={open}
                    data-state={state}
                    aria-disabled={open || undefined}
                    data-orientation="vertical"
                    id={item.triggerId}
                    className={TRIGGER}
                    data-radix-collection-item=""
                    onClick={() => {
                      if (!open) setValue(item.question);
                    }}
                  >
                    <span>{item.question}</span>
                    <ChevronDown />
                  </button>
                </h3>
                <Content open={open} id={item.contentId} labelledBy={item.triggerId}>
                  <div className="pt-[5px] pb-[7px] text-tertiary-foreground">{item.answer}</div>
                </Content>
              </div>
            </div>
          );
        })}
      </div>
      <div className="col-span-full lg:col-span-6 xl:col-start-6 xl:col-end-11">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          loading="lazy"
          width={image.width}
          height={image.height}
          decoding="async"
          data-nimg="1"
          className="rounded-3xl"
          style={{ color: "transparent" }}
          srcSet={image.srcSet ?? `${image.src} 1x`}
          src={image.src}
        />
      </div>
    </div>
  );
}
