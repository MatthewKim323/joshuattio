"use client";
import { useLayoutEffect, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/components/hero/cn";

// Drops the base text color when the caller passes its own (the override wins, like a class merge would).
function hasTextColor(extra?: string) {
  return !!extra && /(^|\s)text-(\[#|white-|transparent|black-)/.test(extra);
}
function hasBorderColor(extra?: string) {
  return !!extra && /(^|\s)border-\[#/.test(extra);
}

type TextProps = { className?: string; style?: CSSProperties; children?: ReactNode };

export function TextBody({ className, style, children }: TextProps) {
  return (
    <span
      className={cn(
        "font-medium text-[7px] leading-[10px] tracking-[-0.14px]",
        "lg:text-[14px] lg:leading-5 lg:tracking-[-0.28px]",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

export function TextCaption({ className, style, children }: TextProps) {
  return (
    <span
      className={cn(
        hasTextColor(className)
          ? "font-medium text-[6px] leading-[8px] tracking-normal"
          : "font-medium text-[#232529] text-[6px] leading-[8px] tracking-normal",
        "lg:text-[12px] lg:leading-4",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

export function Tag({ className, style, children }: TextProps) {
  return (
    <TextCaption
      className={cn(
        hasBorderColor(className)
          ? "inline-flex items-center text-nowrap rounded-sm border-[0.5px] px-[2.5px] py-[0.5px] lg:rounded-lg lg:border lg:px-[5px] lg:py-px"
          : "inline-flex items-center text-nowrap rounded-sm border-[#E6E7EA] border-[0.5px] px-[2.5px] py-[0.5px] lg:rounded-lg lg:border lg:px-[5px] lg:py-px",
        className,
      )}
      style={style}
    >
      {children}
    </TextCaption>
  );
}

export function Badge({ className, children }: TextProps) {
  return (
    <TextCaption
      className={cn(
        "inline-flex items-center justify-center border-[#EEEFF1] bg-[#F4F5F6] text-center text-[#5C5E63]",
        "h-2 min-w-2 rounded-[2.5px] border-[0.5px] px-[1.5px]",
        "lg:h-4 lg:min-w-4 lg:rounded-[5px] lg:border lg:px-[3px]",
        className,
      )}
    >
      {children}
    </TextCaption>
  );
}

export function Control({ className, children }: TextProps) {
  return (
    <div
      className={cn(
        "rounded-sm bg-primary-background lg:rounded-lg",
        "shadow-[0px_0px_2px_0px_#E0E0E0,0px_2px_4px_-2px_rgba(24,39,75,0.02),0px_4px_4px_-2px_rgba(24,39,75,0.06)]",
        "lg:shadow-[0px_0px_1px_0px_#E0E0E0,0px_1px_2px_-1px_rgba(24,39,75,0.02),0px_2px_2px_-1px_rgba(24,39,75,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

type Rect = { x: number; y: number; width: number; height: number; top: number; left: number; bottom: number; right: number };
const EMPTY_RECT: Rect = { x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, bottom: 0, right: 0 };
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Measures an element's content rect with a ResizeObserver. */
export function useMeasure<T extends Element>(): [(el: T | null) => void, Rect] {
  const [el, setEl] = useState<T | null>(null);
  const [rect, setRect] = useState<Rect>(EMPTY_RECT);
  const observer = useMemo(
    () =>
      typeof window !== "undefined" && typeof window.ResizeObserver !== "undefined"
        ? new window.ResizeObserver((entries) => {
            const r = entries[0]?.contentRect;
            if (r) setRect({ x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, left: r.left, bottom: r.bottom, right: r.right });
          })
        : null,
    [],
  );
  useIsoLayoutEffect(() => {
    if (!el || !observer) return;
    observer.observe(el);
    return () => observer.disconnect();
  }, [el, observer]);
  return [setEl, rect];
}

/** Matches a media query; false on the server and on first render. */
export function useMedia(query: string, defaultState = false) {
  const [matches, setMatches] = useState(defaultState);
  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    const onChange = () => {
      if (mounted) setMatches(!!mql.matches);
    };
    mql.addEventListener("change", onChange);
    setMatches(mql.matches);
    return () => {
      mounted = false;
      mql.removeEventListener("change", onChange);
    };
  }, [query]);
  return matches;
}
