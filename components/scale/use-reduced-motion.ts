"use client";

import { useEffect, useState } from "react";

// Reduced-motion preference resolved after mount, so the server markup and the
// first client render always agree (false), then it flips if the user asks.
export function useResolvedReducedMotion() {
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
