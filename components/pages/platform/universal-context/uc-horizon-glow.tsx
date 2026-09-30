"use client";
import { useEffect, useRef } from "react";
import { motion, useSpring } from "motion/react";
import { useResolvedReducedMotion } from "@/components/context/uc-hooks";

const GLOW_LAYERS = [
  { blur: 36, opacity: 0.24, width: 80 },
  { blur: 14, opacity: 0.48, width: 32 },
  { blur: 3, opacity: 0.75, width: 8 },
];

const ID = "_R_canpfiv9f9k7ivb_";
const RIM = `${ID}-rim`;
const GLOW = `${ID}-glow`;
const DIFFUSE = `${ID}-diffuse`;
const CORNER_FADE = `${ID}-corner-fade`;
const CORNER_MASK = `${ID}-corner-mask`;

/** Planet horizon under the hero: the rim glow brightens as the pointer nears the surface. */
export function UcHorizonGlow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<SVGCircleElement>(null);
  const reduce = useResolvedReducedMotion();
  const glow = useSpring(0.35, { damping: 24, stiffness: 100 });

  useEffect(() => {
    if (reduce) {
      glow.jump(0.35);
      return;
    }
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    function rest() {
      glow.set(0.25);
    }
    function move(ev: PointerEvent) {
      const box = rootRef.current?.parentElement;
      const surface = surfaceRef.current;
      if (!box || !surface) return;
      if (!fine.matches || ev.pointerType !== "mouse") {
        glow.set(0.35);
        return;
      }
      const b = box.getBoundingClientRect();
      if (ev.clientX < b.left || ev.clientX > b.right || ev.clientY < b.top || ev.clientY > b.bottom) {
        rest();
        return;
      }
      const s = surface.getBoundingClientRect();
      const cy = s.top + s.height / 2;
      const near = Math.min(
        1,
        Math.max(0, 1 - (Math.hypot(ev.clientX - (s.left + s.width / 2), ev.clientY - cy) - Math.max(0, cy - b.bottom)) / (s.width / 2)),
      );
      glow.set(0.25 + near ** 2 * 0.75);
    }
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", rest);
    window.addEventListener("scroll", rest, { capture: true, passive: true });
    document.documentElement.addEventListener("pointerleave", rest);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", rest);
      window.removeEventListener("scroll", rest, true);
      document.documentElement.removeEventListener("pointerleave", rest);
    };
  }, [glow, reduce]);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none relative -z-10 aspect-3/1 w-full shrink-0 grow">
      <div className="universal-context-horizon-enter absolute inset-x-0 bottom-0">
        <svg className="h-auto w-full overflow-visible" viewBox="0 0 1440 480" fill="none">
          <defs>
            <linearGradient id={CORNER_FADE} x1="0" x2="0" y1="416" y2="480" gradientUnits="userSpaceOnUse">
              <stop stopColor="currentColor" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
            <mask id={CORNER_MASK} maskUnits="userSpaceOnUse" x="-160" y="-160" width="1760" height="800" style={{ maskType: "alpha" }}>
              <rect x="-160" y="-160" width="1760" height="800" fill={`url(#${CORNER_FADE})`} />
            </mask>
            <radialGradient id={DIFFUSE}>
              <stop offset="0.78" stopColor="var(--color-primary-background)" />
              <stop offset="0.9" stopColor="var(--color-primary-background)" stopOpacity="0.9" />
              <stop offset="1" stopColor="var(--color-primary-background)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={RIM} x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--color-blue-500)" />
              <stop offset="0.35" stopColor="var(--color-blue-300)" />
              <stop offset="0.6" stopColor="oklch(0.78 0.1 285)" />
              <stop offset="1" stopColor="oklch(0.62 0.17 295)" />
            </linearGradient>
            {GLOW_LAYERS.map(({ blur }) => (
              <filter key={blur} id={`${GLOW}-${blur}`} filterUnits="userSpaceOnUse" x="-160" y="-160" width="1760" height="800">
                <feGaussianBlur stdDeviation={blur} />
              </filter>
            ))}
          </defs>
          <circle className="universal-context-horizon-diffuse" cx="720" cy="831" r="1040" fill={`url(#${DIFFUSE})`} />
          <g className="universal-context-horizon-glow" mask={`url(#${CORNER_MASK})`}>
            <motion.g style={{ opacity: glow }}>
              {GLOW_LAYERS.map(({ blur, width, opacity }) => (
                <circle key={blur} cx="720" cy="831" r="801" stroke={`url(#${RIM})`} strokeWidth={width} opacity={opacity} filter={`url(#${GLOW}-${blur})`} />
              ))}
            </motion.g>
          </g>
          <circle ref={surfaceRef} className="universal-context-horizon-surface" cx="720" cy="831" r="801" fill="var(--color-primary-background)" />
          <g className="universal-context-horizon-glow" mask={`url(#${CORNER_MASK})`}>
            <circle cx="720" cy="831" r="801" stroke={`url(#${RIM})`} strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.52" />
          </g>
        </svg>
      </div>
    </div>
  );
}
