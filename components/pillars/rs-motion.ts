"use client";

import { useEffect, useLayoutEffect, useState } from "react";

// Shared motion tokens for the late pillar chapters.
export const BLUR_CARD = 2;
export const BLUR_ENTRANCE = 2.5;
export const EASE_REVEAL: [number, number, number, number] = [0, 0, 0.58, 1];
export const EASE_UI: [number, number, number, number] = [0.33, 1, 0.68, 1];
export const EASE_SWITCH = EASE_UI;
export const EASE_UI_EXIT: [number, number, number, number] = [0.32, 0, 0.67, 0];
export const STREAM_MS_PER_CHAR = 6;
export const withTempo = (v: number) => 0.85 * v;

export const cn = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function useMediaQuery(query: string) {
  const [match, setMatch] = useState(false);
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

// Reduced-motion preference, resolved after mount so server and first client render agree.
export function useResolvedReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

// True below the lg breakpoint.
export function useBelowLg() {
  return useMediaQuery("(max-width: 991.98px)");
}
