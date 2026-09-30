"use client";

import { useSyncExternalStore } from "react";

// Billing period shared by every block of the pricing route (hero cards, desktop
// comparison header, mobile comparison). Defaults to "annual", same as the
// provider on the reference page.
export type Period = "monthly" | "annual";

let period: Period = "annual";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function setPeriod(next: Period) {
  if (next === period) return;
  period = next;
  listeners.forEach((l) => l());
}

export function usePeriod(): Period {
  return useSyncExternalStore(
    subscribe,
    () => period,
    () => "annual",
  );
}
