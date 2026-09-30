"use client";
import { useEffect } from "react";

/** Mirrors the page's scroll position onto <html data-scrolled> for the overscroll background colors. */
export function ScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => root.setAttribute("data-scrolled", String(window.scrollY > window.innerHeight / 2));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return null;
}
