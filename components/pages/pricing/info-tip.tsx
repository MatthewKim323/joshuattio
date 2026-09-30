"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

const SHADOW =
  "0px 4px 4px -2px rgba(24, 39, 75, 0.06), 0px 2px 4px -2px rgba(24, 39, 75, 0.02), 0px 0px 2px 0px #E0E0E0";

function InfoIcon({ className }: { className: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5 7C13.5 10.5899 10.5899 13.5 7 13.5C3.41015 13.5 0.5 10.5899 0.5 7C0.5 3.41015 3.41015 0.5 7 0.5C10.5899 0.5 13.5 3.41015 13.5 7ZM6.5 7V9.5C6.5 9.77614 6.72386 10 7 10C7.27614 10 7.5 9.77614 7.5 9.5V7C7.5 6.72386 7.27614 6.5 7 6.5C6.72386 6.5 6.5 6.72386 6.5 7ZM6.25 4.75V4.75977C6.25 5.17398 6.58579 5.50977 7 5.50977C7.41421 5.50977 7.75 5.17398 7.75 4.75977V4.75C7.75 4.33579 7.41421 4 7 4C6.58579 4 6.25 4.33579 6.25 4.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Cross12() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.35355 3.35343C9.54882 3.15817 9.54882 2.84159 9.35355 2.64632C9.15829 2.45106 8.84171 2.45106 8.64645 2.64632L6 5.29277L3.35355 2.64632C3.15829 2.45106 2.84171 2.45106 2.64645 2.64632C2.45118 2.84159 2.45118 3.15817 2.64645 3.35343L5.29289 5.99988L2.64645 8.64632C2.45118 8.84159 2.45118 9.15817 2.64645 9.35343C2.84171 9.54869 3.15829 9.54869 3.35355 9.35343L6 6.70698L8.64645 9.35343C8.84171 9.54869 9.15829 9.54869 9.35355 9.35343C9.54882 9.15817 9.54882 8.84159 9.35355 8.64632L6.70711 5.99988L9.35355 3.35343Z"
        fill="currentColor"
      />
    </svg>
  );
}

// `(pointer: coarse)` switches the hover tooltip for a tap popover.
function useIsTouchScreen() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(pointer: coarse)");
    setTouch(mq.matches);
    const on = (e: MediaQueryListEvent) => setTouch(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return touch;
}

type Placement = { side: "top"; align: "start" | "center"; sideOffset: number; alignOffset: number };

// Places floating content above its trigger, flipping below when it would leave
// the viewport and shifting horizontally to stay inside it.
function usePlacement(
  open: boolean,
  trigger: React.RefObject<HTMLElement | null>,
  content: React.RefObject<HTMLElement | null>,
  p: Placement,
) {
  const [pos, setPos] = useState<{ x: number; y: number; side: "top" | "bottom" } | null>(null);
  const place = useCallback(() => {
    const t = trigger.current;
    const c = content.current;
    if (!t || !c) return;
    const r = t.getBoundingClientRect();
    const w = c.offsetWidth;
    const h = c.offsetHeight;
    const vw = document.documentElement.clientWidth;
    let x = p.align === "start" ? r.left + p.alignOffset : r.left + r.width / 2 - w / 2;
    let y = r.top - h - p.sideOffset;
    let side: "top" | "bottom" = "top";
    if (y < 0) {
      y = r.bottom + p.sideOffset;
      side = "bottom";
    }
    x = Math.max(0, Math.min(x, vw - w));
    setPos({ x, y, side });
  }, [trigger, content, p.align, p.alignOffset, p.sideOffset]);
  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);
  return pos;
}

// Keeps content mounted while its exit animation (animate-out, 150ms) plays.
function usePresence(open: boolean) {
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const id = window.setTimeout(() => setMounted(false), 200);
    return () => window.clearTimeout(id);
  }, [open]);
  return mounted || open;
}

const TOOLTIP_PLACEMENT: Placement = { side: "top", align: "start", sideOffset: -2, alignOffset: 8 };
const POPOVER_PLACEMENT: Placement = { side: "top", align: "center", sideOffset: 0, alignOffset: 0 };

type TipState = "closed" | "delayed-open" | "instant-open";

export function InfoTip({ tooltip, className }: { tooltip: string; className?: string }) {
  const touch = useIsTouchScreen();

  // Hover tooltip (delayDuration 100)
  const [tip, setTip] = useState<TipState>("closed");
  const tipTrigger = useRef<HTMLButtonElement>(null);
  const tipContent = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const tipOpen = tip !== "closed";
  const tipMounted = usePresence(tipOpen);
  const tipPos = usePlacement(tipMounted, tipTrigger, tipContent, TOOLTIP_PLACEMENT);

  const clearTimer = () => {
    if (timer.current !== undefined) window.clearTimeout(timer.current);
    timer.current = undefined;
  };
  const closeTip = useCallback(() => {
    if (timer.current !== undefined) window.clearTimeout(timer.current);
    timer.current = undefined;
    setTip("closed");
  }, []);

  useEffect(() => {
    if (!tipOpen) return;
    const onScroll = (e: Event) => {
      const t = e.target as Node | null;
      if (t && tipTrigger.current && (t as Node).contains?.(tipTrigger.current)) closeTip();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeTip();
    window.addEventListener("scroll", onScroll, { capture: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("keydown", onKey);
    };
  }, [tipOpen, closeTip]);
  useEffect(() => () => clearTimer(), []);

  // Tap popover
  const [pop, setPop] = useState(false);
  const popTrigger = useRef<HTMLButtonElement>(null);
  const popContent = useRef<HTMLDivElement>(null);
  const popMounted = usePresence(pop);
  const popPos = usePlacement(popMounted, popTrigger, popContent, POPOVER_PLACEMENT);
  useEffect(() => {
    if (!pop) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (popContent.current?.contains(t) || popTrigger.current?.contains(t)) return;
      setPop(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPop(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pop]);

  const tipId = `info-tip-${useId()}`;

  return (
    <>
      <button
        ref={tipTrigger}
        data-state={tip}
        aria-describedby={tipOpen ? tipId : undefined}
        className={cx(className, "group size-5 items-center", touch ? "hidden" : "flex")}
        onPointerMove={(e) => {
          if (e.pointerType === "touch" || tipOpen || timer.current !== undefined) return;
          timer.current = window.setTimeout(() => {
            timer.current = undefined;
            setTip("delayed-open");
          }, 100);
        }}
        onPointerLeave={(e) => {
          const to = e.relatedTarget as Node | null;
          if (to && tipContent.current?.contains(to)) return;
          closeTip();
        }}
        onPointerDown={closeTip}
        onFocus={() => setTip((s) => (s === "closed" ? "instant-open" : s))}
        onBlur={closeTip}
        onClick={closeTip}
      >
        <div className="relative flex items-center justify-center before:absolute before:size-8">
          <InfoIcon className="text-disabled-foreground trasition-colors duration-400 group-hover:text-caption-foreground group-hover:duration-150" />
        </div>
      </button>
      {tipMounted &&
        createPortal(
          <div
            data-radix-popper-content-wrapper=""
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              transform: tipPos ? `translate(${tipPos.x}px, ${tipPos.y}px)` : "translate(0, -200%)",
              minWidth: "max-content",
              zIndex: 3,
            }}
          >
            <div
              ref={tipContent}
              data-side={tipPos?.side ?? "top"}
              data-align="start"
              data-state={tip}
              className={cx(
                "z-3 max-w-64 rounded-md bg-black-300 p-2",
                "data-[state=delayed-open]:fade-in data-[state=delayed-open]:animate-in",
                "data-closed:fade-out data-closed:animate-out",
                touch && "hidden",
              )}
              style={{ boxShadow: SHADOW }}
              onPointerLeave={(e) => {
                const to = e.relatedTarget as Node | null;
                if (to && tipTrigger.current?.contains(to)) return;
                closeTip();
              }}
            >
              <p className="wrap-break-word text-pretty font-normal text-white-100 text-xs">{tooltip}</p>
              <span
                id={tipId}
                role="tooltip"
                style={{
                  position: "absolute",
                  border: 0,
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  overflowWrap: "normal",
                }}
              >
                {tooltip}
              </span>
            </div>
          </div>,
          document.body,
        )}
      <button
        ref={popTrigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={pop}
        data-state={pop ? "open" : "closed"}
        className={cx("group size-5 items-center", touch ? "flex" : "hidden", className)}
        onClick={() => setPop((o) => !o)}
      >
        <div className="relative flex items-center justify-center before:absolute before:size-8">
          <InfoIcon className="text-disabled-foreground group-data-open:text-caption-foreground" />
        </div>
      </button>
      {popMounted &&
        createPortal(
          <div
            data-radix-popper-content-wrapper=""
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              transform: popPos ? `translate(${popPos.x}px, ${popPos.y}px)` : "translate(0, -200%)",
              minWidth: "max-content",
              zIndex: 3,
            }}
          >
            <div
              ref={popContent}
              role="dialog"
              data-side={popPos?.side ?? "top"}
              data-align="center"
              data-state={pop ? "open" : "closed"}
              className={cx(
                "z-3 flex max-w-64 items-start gap-1 rounded-md bg-black-300 p-2",
                "data-open:fade-in data-open:animate-in",
                "data-closed:fade-out data-closed:animate-out",
                !touch && "hidden",
              )}
              style={{ boxShadow: SHADOW }}
            >
              <p className="wrap-break-word text-pretty font-normal text-white-100 text-xs">{tooltip}</p>
              <button
                type="button"
                className="text-white-900 active:text-white-800"
                onClick={() => setPop(false)}
              >
                <Cross12 />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
