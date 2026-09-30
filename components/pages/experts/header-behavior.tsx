"use client";

import { useEffect } from "react";

const toggleAttr = (el: Element | null, name: string, a: string, b: string) => {
  if (!el) return;
  el.setAttribute(name, el.getAttribute(name) === a ? b : a);
};

/**
 * Header behavior for the experts page frame. The frame is static markup whose state lives in classes and
 * data attributes, so this wires the same events onto it:
 * - hovering a top-level menu trigger opens the shared dropdown panel with that menu; leaving closes it
 *   unless the pointer went into the panel, and leaving the panel closes it;
 * - the burger toggles the mobile drawer, drawer headings toggle their accordion section;
 * - past 20px of scroll the header swaps its transparent border for the subtle one.
 */
export function HeaderBehavior() {
  useEffect(() => {
    const root = document.getElementById("custom-header");
    if (!root) return;
    const header = root.querySelector<HTMLElement>(".header");
    const panel = root.querySelector<HTMLElement>(".nav-dp");
    const toggle = root.querySelector<HTMLElement>(".h-toggle");
    const drawer = root.querySelector<HTMLElement>(".mobilenav");
    const triggers = Array.from(root.querySelectorAll<HTMLElement>("[data-nav-id]"));
    const headings = Array.from(root.querySelectorAll<HTMLElement>(".mobilenav h3"));
    const off: Array<() => void> = [];
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      el.addEventListener(type, fn as EventListener);
      off.push(() => el.removeEventListener(type, fn as EventListener));
    };

    const closePanel = () => {
      panel?.classList.remove("open");
      panel?.querySelectorAll("[data-nav]").forEach((n) => n.classList.remove("open"));
    };
    const openPanel = (id: string | null) => {
      panel?.classList.add("open");
      panel?.querySelector(`[data-nav="${id}"]`)?.classList.add("open");
    };
    for (const t of triggers) {
      on(t, "mouseenter", () => openPanel(t.getAttribute("data-nav-id")));
      on(t, "mouseleave", () => {
        openPanel(t.getAttribute("data-nav-id"));
        if (!panel?.matches(":hover")) closePanel();
      });
    }
    if (panel) on(panel, "mouseleave", closePanel);

    if (toggle) {
      on(toggle, "click", (e) => {
        e.preventDefault();
        toggle.classList.toggle("open");
        drawer?.classList.toggle("open");
      });
    }
    for (const h of headings) {
      on(h, "click", (e) => {
        e.preventDefault();
        const button = h.querySelector("button");
        const region = h.nextElementSibling;
        toggleAttr(h, "data-state", "closed", "open");
        toggleAttr(button, "data-state", "closed", "open");
        toggleAttr(button, "aria-expanded", "true", "false");
        toggleAttr(region, "data-state", "closed", "open");
        toggleAttr(h.parentElement, "data-state", "closed", "open");
        if (region) {
          if (region.hasAttribute("hidden")) region.removeAttribute("hidden");
          else region.setAttribute("hidden", "");
        }
      });
    }

    const onScroll = () => {
      if (!header) return;
      const past = window.scrollY > 20;
      header.classList.toggle("border-subtle", past);
      header.classList.toggle("border-transparent", !past);
    };
    on(window, "scroll", onScroll);
    onScroll();

    return () => {
      off.forEach((f) => f());
      closePanel();
    };
  }, []);
  return null;
}
