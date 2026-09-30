"use client";

import { useEffect, useState } from "react";

// Shared motion constants for the pillars demos.
export const EASE_UI = [0.33, 1, 0.68, 1] as const;
export const EASE_UI_EXIT = [0.32, 0, 0.67, 0] as const;
export const BLUR_CARD = 2;
export const BLUR_ENTRANCE = 2.5;
export const DUR_ENTRANCE = 0.8;
export const DUR_EXIT = 0.3;
export const DUR_REVEAL = 0.6;
export const STREAM_MS_PER_CHAR = 6;
export const withTempo = (v: number) => 0.85 * v;

// prefers-reduced-motion, false on the server and on the first client render
// so hydration always starts from the animated initial state.
export function useReducedMotionSafe() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduce;
}
