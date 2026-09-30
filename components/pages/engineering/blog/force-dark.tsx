"use client";

import { useLayoutEffect } from "react";

// This route is always dark: swap the root theme class as the page mounts and
// restore the light theme when leaving.

export function ForceDark() {
  useLayoutEffect(() => {
    const d = document.documentElement;
    d.classList.remove("light");
    d.classList.add("dark");
    d.style.colorScheme = "dark";
    return () => {
      d.classList.remove("dark");
      d.classList.add("light");
      d.style.colorScheme = "light";
    };
  }, []);
  return null;
}
