"use client";

import { useCallback, useEffect, useState, type ComponentProps } from "react";

// Radar wrapper: the scene is pure CSS keyframes; this pauses them while the
// radar is off screen or the tab is hidden, and remounts the scene when the
// lg breakpoint flips so the desktop / mobile sweep restarts from zero.
export function ReportingRadarScene(props: ComponentProps<"div">) {
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = () => setGeneration((g) => g + 1);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const ref = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    let visible = false;
    const sync = () => {
      el.dataset.paused = String(!visible || document.hidden);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <div key={generation} ref={ref} data-paused="true" aria-hidden="true" {...props} />;
}
