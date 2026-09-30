"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";

// Listbox select: trigger button + popper content portalled to body, with the
// hidden native select kept in the form for autofill. Mirrors the source
// primitive: opens on mouse pointerdown (click for touch / keyboard), typeahead,
// arrow key focus, select on pointerup, focus returns to the trigger on close.

type Option = { value: string; label: string };

const SIDE_OFFSET = 6;
const COLLISION_PADDING = 10;
const OPEN_KEYS = [" ", "Enter", "ArrowUp", "ArrowDown"];

const VISUALLY_HIDDEN: CSSProperties = {
  position: "absolute",
  border: "0px",
  width: "1px",
  height: "1px",
  padding: "0px",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  whiteSpace: "nowrap",
  overflowWrap: "normal",
};

const TRIGGER_BASE =
  "flex w-full cursor-pointer items-center justify-between rounded-[10px] bg-primary-background py-2.5 pr-3 pl-3.25 text-secondary-foreground leading-6 outline-hidden transition-[border-color,background-color,text-color,box-shadow] duration-150 ease-in-out data-placeholder:text-black-700 data-placeholder:text-sm data-placeholder:leading-6 [&>span]:min-w-0 [&>span]:truncate";
const TRIGGER_OK =
  "border border-default-stroke hover:shadow-[0px_1px_4px_rgba(56,_62,_71,_0.1)] focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-300";
const TRIGGER_ERR =
  "border border-red-500 hover:border-red-[#CE2E4B] hover:shadow-[0px_1px_4px_rgba(56,_62,_71,_0.1)] focus-visible:border-[#CE2E4B] focus-visible:ring-[3px] focus-visible:ring-red-600/30";
const CONTENT_CLASS =
  "relative z-10 max-h-[var(--radix-select-content-available-height)] overflow-hidden rounded-[10px] bg-primary-background shadow-[0px_4px_8px_rgba(56,_62,_71,_0.25)] data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-1 data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=closed]:slide-out-to-bottom-1 data-[state=closed]:animate-out [&>.btn]:m-1 [&>.btn]:h-6 [&>.btn]:rounded-md [&>.btn:hover]:bg-surface [&>.btn]:bg-surface-subtle [&>.btn]:shadow-[0px_0px_4px_rgba(56,_62,_71,_0.25)]";
const ITEM_CLASS =
  "flex w-full cursor-pointer select-none items-center rounded-[6px] py-[6px] pl-[10px] text-black-700 text-sm outline-hidden focus:bg-white-400";
const VIEWPORT_STYLE_ID = "sales-select-viewport-style";

function ChevronDown14() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0" aria-hidden="true">
      <path d="M10.1465 5.14661C10.3418 4.95134 10.6583 4.95134 10.8536 5.14661C11.0487 5.34188 11.0488 5.65843 10.8536 5.85364L7.35358 9.35364C7.15837 9.54885 6.84182 9.54875 6.64655 9.35364L3.14655 5.85364C2.95128 5.65838 2.95128 5.34187 3.14655 5.14661C3.34181 4.95134 3.65831 4.95134 3.85358 5.14661L7.00006 8.29309L10.1465 5.14661Z" fill="currentColor" />
    </svg>
  );
}

function ChevronUp12() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.64646 7.85355C2.84172 8.04882 3.15831 8.04882 3.35357 7.85355L6.00002 5.20711L8.64646 7.85355C8.84172 8.04882 9.15831 8.04882 9.35357 7.85355C9.54883 7.65829 9.54883 7.34171 9.35357 7.14645L6.35357 4.14645C6.15831 3.95118 5.84172 3.95118 5.64646 4.14645L2.64646 7.14645C2.4512 7.34171 2.4512 7.65829 2.64646 7.85355Z" fill="currentColor" />
    </svg>
  );
}

function ChevronDown12() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M9.35352 4.14645C9.15826 3.95119 8.84168 3.95118 8.64642 4.14645L5.99997 6.79289L3.35352 4.14645C3.15826 3.95118 2.84168 3.95118 2.64642 4.14645C2.45115 4.34171 2.45115 4.65829 2.64642 4.85355L5.64642 7.85355C5.84168 8.04882 6.15826 8.04882 6.35352 7.85355L9.35352 4.85355C9.54879 4.65829 9.54879 4.34171 9.35352 4.14645Z" fill="currentColor" />
    </svg>
  );
}

// Typeahead: accumulate keys for 1s, match item text from the current one on.
function useTypeahead(onChange: (search: string) => void) {
  const search = useRef("");
  const timer = useRef(0);
  const handle = useCallback(
    (key: string) => {
      const next = search.current + key;
      onChange(next);
      search.current = next;
      window.clearTimeout(timer.current);
      if (next !== "") timer.current = window.setTimeout(() => (search.current = ""), 1000);
    },
    [onChange],
  );
  const reset = useCallback(() => {
    search.current = "";
    window.clearTimeout(timer.current);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return [search, handle, reset] as const;
}

function findNextItem(options: Option[], search: string, current: Option | undefined) {
  const chars = search.length > 1 && Array.from(search).every((c) => c === search[0]) ? search[0] : search;
  const start = current ? options.indexOf(current) : -1;
  let wrapped = options.map((_, i) => options[(Math.max(start, 0) + i) % options.length]);
  if (chars.length === 1) wrapped = wrapped.filter((o) => o !== current);
  const next = wrapped.find((o) => o.label.toLowerCase().startsWith(chars.toLowerCase()));
  return next !== current ? next : undefined;
}

type Placement = {
  x: number;
  y: number;
  side: "bottom" | "top";
  availableHeight: number;
  availableWidth: number;
  anchorWidth: number;
  anchorHeight: number;
  floatingHeight: number;
};

export function SalesSelect({
  id,
  name,
  placeholder,
  options,
  value,
  isError,
  onChange,
  onBlur,
}: {
  id: string;
  name: string;
  placeholder: string;
  options: Option[];
  value: string | undefined;
  isError: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [scrollUp, setScrollUp] = useState(false);
  const [scrollDown, setScrollDown] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerTypeRef = useRef<string>("touch");
  const itemPointerTypeRef = useRef<string>("touch");
  const triggerPointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const contentId = `${id}-content`;
  const selected = options.find((o) => o.value === value);
  const hasValue = value !== undefined && value !== "";

  const handleOpen = (pos?: { x: number; y: number }) => {
    setOpen(true);
    resetTrigger();
    if (pos) triggerPointerDownPos.current = pos;
  };

  const close = useCallback(() => {
    setOpen(false);
    setPlacement(null);
  }, []);

  const [triggerSearch, handleTriggerSearch, resetTrigger] = useTypeahead((search) => {
    const next = findNextItem(options, search, selected);
    if (next) onChange(next.value);
  });

  const getItems = () =>
    Array.from(viewportRef.current?.querySelectorAll<HTMLElement>("[role=option]") ?? []);

  const [contentSearch, handleContentSearch] = useTypeahead((search) => {
    const items = getItems();
    const active = document.activeElement as HTMLElement | null;
    const current = options.find((o) => items.find((el) => el === active)?.dataset.value === o.value);
    const next = findNextItem(options, search, current);
    if (next) {
      const el = items.find((i) => i.dataset.value === next.value);
      window.setTimeout(() => el?.focus());
    }
  });

  // Position the popper (strategy fixed, side bottom, align start, flip when it does not fit).
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const content = contentRef.current;
    if (!trigger || !content) return;
    const rect = trigger.getBoundingClientRect();
    const vh = document.documentElement.clientHeight;
    const vw = document.documentElement.clientWidth;
    const height = content.scrollHeight;
    const below = vh - rect.bottom - SIDE_OFFSET - COLLISION_PADDING;
    const above = rect.top - SIDE_OFFSET - COLLISION_PADDING;
    let side: "bottom" | "top" = "bottom";
    if (height > below && (height <= above || above > below)) side = "top";
    const availableHeight = Math.max(0, side === "bottom" ? below : above);
    const floatingHeight = Math.min(height, availableHeight);
    const y = side === "bottom" ? rect.bottom + SIDE_OFFSET : rect.top - SIDE_OFFSET - floatingHeight;
    const width = Math.max(rect.width, content.offsetWidth);
    const x = Math.min(Math.max(rect.left, COLLISION_PADDING), Math.max(COLLISION_PADDING, vw - COLLISION_PADDING - width));
    setPlacement({
      x,
      y,
      side,
      availableHeight,
      availableWidth: vw - x - COLLISION_PADDING,
      anchorWidth: rect.width,
      anchorHeight: rect.height,
      floatingHeight,
    });
  }, [open]);

  // Once placed: focus the selected item (or the content), check scroll buttons.
  useEffect(() => {
    if (!open || !placement) return;
    const items = getItems();
    const sel = items.find((el) => el.dataset.value === value);
    (sel ?? contentRef.current)?.focus({ preventScroll: true });
    if (sel && viewportRef.current) {
      const vp = viewportRef.current;
      if (sel.offsetTop + sel.offsetHeight > vp.scrollTop + vp.clientHeight) vp.scrollTop = sel.offsetTop;
    }
    updateScrollButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, placement]);

  const updateScrollButtons = () => {
    const vp = viewportRef.current;
    if (!vp) return;
    setScrollUp(vp.scrollTop > 0);
    setScrollDown(Math.ceil(vp.scrollTop) < vp.scrollHeight - vp.clientHeight);
  };

  // Dismiss: outside pointerdown, escape, window blur / resize. Scroll lock and
  // outside pointer events disabled while open.
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const prevPointer = body.style.pointerEvents;
    const prevOverflow = body.style.overflow;
    body.style.pointerEvents = "none";
    body.style.overflow = "hidden";
    body.setAttribute("data-scroll-locked", "1");

    const onPointerDown = (e: PointerEvent) => {
      if (wrapperRef.current?.contains(e.target as Node)) return;
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (!viewportRef.current?.contains(e.target as Node)) e.preventDefault();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!viewportRef.current?.contains(e.target as Node)) e.preventDefault();
    };
    let pointerDelta = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const start = triggerPointerDownPos.current;
      if (!start) return;
      pointerDelta = { x: Math.abs(Math.round(e.pageX) - start.x), y: Math.abs(Math.round(e.pageY) - start.y) };
    };
    const onPointerUp = (e: PointerEvent) => {
      if (triggerPointerDownPos.current) {
        if (pointerDelta.x <= 10 && pointerDelta.y <= 10) e.preventDefault();
        else if (!contentRef.current?.contains(e.target as Node)) close();
      }
      document.removeEventListener("pointermove", onPointerMove);
      triggerPointerDownPos.current = null;
    };
    const timer = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointerDown);
    }, 0);
    if (triggerPointerDownPos.current) {
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp, { capture: true, once: true });
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("blur", close);
    window.addEventListener("resize", close);
    return () => {
      window.clearTimeout(timer);
      body.style.pointerEvents = prevPointer;
      body.style.overflow = prevOverflow;
      body.removeAttribute("data-scroll-locked");
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp, { capture: true });
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("blur", close);
      window.removeEventListener("resize", close);
      const trigger = triggerRef.current;
      window.setTimeout(() => trigger?.focus({ preventScroll: true }), 0);
    };
  }, [open, close]);

  // Inject the viewport scrollbar-hiding rule once.
  useEffect(() => {
    if (!open || document.getElementById(VIEWPORT_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = VIEWPORT_STYLE_ID;
    style.textContent =
      "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}";
    document.head.appendChild(style);
  }, [open]);

  const select = (next: string) => {
    onChange(next);
    close();
  };

  const onTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    const typeahead = triggerSearch.current !== "";
    if (!(e.ctrlKey || e.altKey || e.metaKey) && e.key.length === 1) handleTriggerSearch(e.key);
    if (typeahead && e.key === " ") return;
    if (OPEN_KEYS.includes(e.key)) {
      handleOpen();
      e.preventDefault();
    }
  };

  const onTriggerPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    pointerTypeRef.current = e.pointerType;
    const target = e.target as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) target.releasePointerCapture(e.pointerId);
    if (e.button === 0 && e.ctrlKey === false && e.pointerType === "mouse") {
      handleOpen({ x: Math.round(e.pageX), y: Math.round(e.pageY) });
      e.preventDefault();
    }
  };

  const onContentKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const modifier = e.ctrlKey || e.altKey || e.metaKey;
    if (e.key === "Tab") e.preventDefault();
    if (!modifier && e.key.length === 1) handleContentSearch(e.key);
    if (["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
      let candidates = getItems();
      if (["ArrowUp", "End"].includes(e.key)) candidates = candidates.slice().reverse();
      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        const idx = candidates.indexOf(e.target as HTMLElement);
        candidates = candidates.slice(idx + 1);
      }
      window.setTimeout(() => {
        for (const c of candidates) {
          c.scrollIntoView({ block: "nearest" });
          c.focus({ preventScroll: true });
          if (document.activeElement === c) break;
        }
      });
      e.preventDefault();
    }
  };

  const wrapperStyle = {
    position: "fixed",
    left: 0,
    top: 0,
    transform: placement ? `translate(${Math.round(placement.x)}px, ${Math.round(placement.y)}px)` : "translate(0, -200%)",
    minWidth: "max-content",
    zIndex: 10,
    "--radix-popper-transform-origin": placement
      ? placement.side === "bottom"
        ? "0% 0px"
        : `0% ${placement.floatingHeight}px`
      : undefined,
    "--radix-popper-available-width": placement ? `${placement.availableWidth}px` : undefined,
    "--radix-popper-available-height": placement ? `${placement.availableHeight}px` : undefined,
    "--radix-popper-anchor-width": placement ? `${placement.anchorWidth}px` : undefined,
    "--radix-popper-anchor-height": placement ? `${placement.anchorHeight}px` : undefined,
  } as CSSProperties;

  const contentStyle = {
    boxSizing: "border-box",
    "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
    "--radix-select-content-available-width": "var(--radix-popper-available-width)",
    "--radix-select-content-available-height": "var(--radix-popper-available-height)",
    "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
    "--radix-select-trigger-height": "var(--radix-popper-anchor-height)",
    display: "flex",
    flexDirection: "column",
    outline: "none",
    pointerEvents: "auto",
    animation: placement ? undefined : "none",
  } as CSSProperties;

  const scrollBy = (dir: 1 | -1) => {
    const vp = viewportRef.current;
    const first = getItems()[0];
    if (vp && first) vp.scrollTop += dir * first.offsetHeight;
  };
  const autoScroll = useRef<number | null>(null);
  const stopAutoScroll = () => {
    if (autoScroll.current !== null) window.clearInterval(autoScroll.current);
    autoScroll.current = null;
  };
  const startAutoScroll = (dir: 1 | -1) => {
    if (autoScroll.current === null) autoScroll.current = window.setInterval(() => scrollBy(dir), 50);
  };
  useEffect(() => stopAutoScroll, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-controls={open ? contentId : undefined}
        aria-expanded={open}
        aria-autocomplete="none"
        dir="ltr"
        data-state={open ? "open" : "closed"}
        data-placeholder={hasValue ? undefined : ""}
        id={id}
        className={`${TRIGGER_BASE} ${isError ? TRIGGER_ERR : TRIGGER_OK}`}
        onClick={(e) => {
          e.currentTarget.focus();
          if (pointerTypeRef.current !== "mouse") handleOpen({ x: Math.round(e.pageX), y: Math.round(e.pageY) });
        }}
        onPointerDown={onTriggerPointerDown}
        onKeyDown={onTriggerKeyDown}
        onBlur={onBlur}
      >
        <span style={{ pointerEvents: "none" }}>{selected ? selected.label : placeholder}</span>
        <ChevronDown14 />
      </button>
      <select
        aria-hidden="true"
        tabIndex={-1}
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        style={VISUALLY_HIDDEN}
      >
        {!hasValue ? <option value="" /> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {open
        ? createPortal(
            <div ref={wrapperRef} data-radix-popper-content-wrapper="" dir="ltr" style={wrapperStyle}>
              <div
                ref={contentRef}
                role="listbox"
                id={contentId}
                data-state="open"
                data-side={placement?.side ?? "bottom"}
                data-align="start"
                dir="ltr"
                tabIndex={-1}
                className={CONTENT_CLASS}
                style={contentStyle}
                onKeyDown={onContentKeyDown}
                onContextMenu={(e) => e.preventDefault()}
              >
                {scrollUp ? (
                  <div
                    aria-hidden="true"
                    className="btn z-20 mb-0! flex items-center justify-center"
                    style={{ flexShrink: 0 }}
                    onPointerDown={() => startAutoScroll(-1)}
                    onPointerMove={() => startAutoScroll(-1)}
                    onPointerLeave={stopAutoScroll}
                  >
                    <ChevronUp12 />
                  </div>
                ) : null}
                <div
                  ref={viewportRef}
                  data-radix-select-viewport=""
                  role="presentation"
                  className="z-10 min-w-[var(--radix-select-trigger-width)] p-1"
                  style={{ position: "relative", flex: 1, overflow: "hidden auto" }}
                  onScroll={updateScrollButtons}
                >
                  {options.map((o) => {
                    const isSelected = o.value === value;
                    return (
                      <div
                        key={o.value}
                        role="option"
                        aria-labelledby={`${id}-${o.value}-text`}
                        aria-selected={isSelected}
                        data-state={isSelected ? "checked" : "unchecked"}
                        data-value={o.value}
                        tabIndex={-1}
                        className={ITEM_CLASS}
                        onFocus={(e) => e.currentTarget.setAttribute("data-highlighted", "")}
                        onBlur={(e) => e.currentTarget.removeAttribute("data-highlighted")}
                        onClick={() => {
                          if (itemPointerTypeRef.current !== "mouse") select(o.value);
                        }}
                        onPointerUp={(e) => {
                          if (e.defaultPrevented) return;
                          if (itemPointerTypeRef.current === "mouse") select(o.value);
                        }}
                        onPointerDown={(e) => {
                          itemPointerTypeRef.current = e.pointerType;
                        }}
                        onPointerMove={(e) => {
                          itemPointerTypeRef.current = e.pointerType;
                          if (e.pointerType === "mouse" && document.activeElement !== e.currentTarget)
                            e.currentTarget.focus({ preventScroll: true });
                        }}
                        onPointerLeave={(e) => {
                          if (e.currentTarget === document.activeElement) contentRef.current?.focus({ preventScroll: true });
                        }}
                        onKeyDown={(e) => {
                          if (contentSearch.current !== "" && e.key === " ") return;
                          if (e.key === "Enter" || e.key === " ") {
                            select(o.value);
                            if (e.key === " ") e.preventDefault();
                          }
                        }}
                      >
                        <span id={`${id}-${o.value}-text`}>{o.label}</span>
                      </div>
                    );
                  })}
                </div>
                {scrollDown ? (
                  <div
                    aria-hidden="true"
                    className="btn z-20 mt-0! flex items-center justify-center"
                    style={{ flexShrink: 0 }}
                    onPointerDown={() => startAutoScroll(1)}
                    onPointerMove={() => startAutoScroll(1)}
                    onPointerLeave={stopAutoScroll}
                  >
                    <ChevronDown12 />
                  </div>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
