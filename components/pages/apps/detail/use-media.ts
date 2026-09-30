"use client";

import { useEffect, useState } from "react";

/** Media query hook: starts at `defaultState` (server and first client render), then tracks the query. */
export function useMedia(query: string, defaultState = false) {
  const [matches, setMatches] = useState(defaultState);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}
