"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

// One feature of the mobile comparison list: a collapsible that starts open.
// Height is measured into --radix-collapsible-content-height and animated with
// the collapsibleSlideDown / collapsibleSlideUp keyframes (300ms
// cubic-bezier(.65, 0, .35, 1)); the closed panel is hidden once the exit ends.
// The first paint suppresses the mount animation like the static snapshot.
export function MobileFeature({
  contentId,
  label,
  children,
}: {
  contentId: string;
  label: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const [present, setPresent] = useState(true);
  const [height, setHeight] = useState<number | null>(null);
  const [mountPrevented, setMountPrevented] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || !present) return;
    const prevAnim = node.style.animationName;
    node.style.animationName = "none";
    setHeight(node.getBoundingClientRect().height);
    node.style.animationName = prevAnim;
  }, [open, present]);

  const toggle = () => {
    if (mountPrevented) setMountPrevented(false);
    const next = !open;
    if (next) setPresent(true);
    setOpen(next);
  };

  const state = open ? "open" : "closed";
  const style: React.CSSProperties & Record<string, string> = mountPrevented
    ? { transitionDuration: "0s", animationName: "none" }
    : {};
  if (height !== null) style["--radix-collapsible-content-height"] = `${height}px`;

  return (
    <div data-state={state}>
      <div className="flex w-full items-center justify-between border-subtle-stroke border-b py-4">
        {label}
        <button
          type="button"
          className="group h-5 before:absolute before:size-8"
          aria-controls={contentId}
          aria-expanded={open}
          data-state={state}
          onClick={toggle}
        >
          <svg
            className="shrink-0 transition-transform group-data-open:-rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.2"
              d="M5.25 7.125 9 10.875l3.75-3.75"
            />
          </svg>
        </button>
      </div>
      <div
        ref={ref}
        data-state={state}
        id={contentId}
        hidden={!open && !present}
        className="overflow-hidden will-change-[height] data-closed:animate-collapsibleSlideUp data-open:animate-collapsibleSlideDown"
        style={style}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget && !open) setPresent(false);
        }}
      >
        {(open || present) && children}
      </div>
    </div>
  );
}
