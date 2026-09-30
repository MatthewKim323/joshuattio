"use client";

import { createContext, use, useCallback, useEffect, useState, type ReactNode } from "react";

// Page-wide toggle: pressing "h" flips it. Portrait backdrops and the prefooter read it.
type Ctx = { isEasterEggEnabled: boolean; toggleEasterEgg: () => void };
const EasterEggContext = createContext<Ctx | undefined>(undefined);

export function DevEasterEggProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const toggleEasterEgg = useCallback(() => setEnabled((v) => !v), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "h") toggleEasterEgg();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleEasterEgg]);
  return <EasterEggContext.Provider value={{ isEasterEggEnabled: enabled, toggleEasterEgg }}>{children}</EasterEggContext.Provider>;
}

const FALLBACK: Ctx = { isEasterEggEnabled: false, toggleEasterEgg: () => {} };

/** Safe outside the provider too (e.g. `?only=` renders), falls back to the off state. */
export function useDevEasterEgg(): Ctx {
  return use(EasterEggContext) ?? FALLBACK;
}
