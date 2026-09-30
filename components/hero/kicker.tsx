"use client";
import { useEffect, useMemo, useRef, useState, type SVGProps } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/components/hero/cn";

/** Gradient light that travels around the pill's border. */
function BorderTrace({ width: t, height: n, radius: i }: { width: number; height: number; radius: number }) {
  const { horizontalRatio: s, angleRatio: l, verticalRatio: c } = useMemo(() => {
    const e = t - 2 * i,
      r = n - 2 * i,
      a = (2 * Math.PI * i) / 4,
      o = 2 * e + 2 * r + 4 * a;
    return { angleRatio: a / o, horizontalRatio: e / o, verticalRatio: r / o };
  }, [t, n, i]);
  return (
    <motion.div
      className="absolute -inset-px"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <motion.div
        className={cn(
          "h-full w-full",
          "bg-[conic-gradient(from_var(--angle)_at_var(--x)_var(--y)_in_oklch,#A3ECE900,#A3ECE9_20deg,#709FF5_100deg,#709FF500_120deg)]",
        )}
        animate={{
          "--angle": ["-80deg", "-80deg", "10deg", "10deg", "100deg", "100deg", "190deg", "190deg", "280deg"],
          "--x": [`${i}px`, `${t - i}px`, `${t - i}px`, `${t - i}px`, `${t - i}px`, `${i}px`, `${i}px`, `${i}px`, `${i}px`],
          "--y": [`${i}px`, `${i}px`, `${i}px`, `${n - i}px`, `${n - i}px`, `${n - i}px`, `${n - i}px`, `${i}px`, `${i}px`],
        }}
        transition={{
          duration: 4,
          ease: "linear",
          repeat: Infinity,
          times: [
            0,
            s,
            s + l,
            s + l + c,
            s + 2 * l + c,
            2 * s + 2 * l + c,
            2 * s + 3 * l + c,
            2 * s + 3 * l + 2 * c,
            2 * s + 4 * l + 2 * c,
          ],
        }}
        style={{ borderRadius: i }}
      />
    </motion.div>
  );
}

function Chevron({ ...t }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...t}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.64646 2.64645C4.4512 2.84171 4.4512 3.15829 4.64646 3.35355L7.29291 6L4.64646 8.64645C4.4512 8.84171 4.4512 9.15829 4.64646 9.35355C4.84172 9.54882 5.15831 9.54882 5.35357 9.35355L8.35357 6.35355C8.54883 6.15829 8.54883 5.84171 8.35357 5.64645L5.35357 2.64645C5.15831 2.45118 4.84172 2.45118 4.64646 2.64645Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Measures an element's border box and keeps it in sync on resize. */
function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setSize((s) => (s.width === r.width && s.height === r.height ? s : { width: r.width, height: r.height }));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

export function AnimatedKicker({ badge: t, title: a, href }: { badge?: string; title: string; href: string }) {
  const c = useRef<HTMLDivElement>(null),
    f = useInView(c),
    [m, { width: p, height: g }] = useMeasure<HTMLAnchorElement>();
  return (
    <div ref={c} data-visual-test="blackout">
      <a
        ref={m}
        className={cn(
          "group relative",
          "block border border-weak-stroke active:border-subtle-stroke",
          "transition-colors duration-300 ease-in-out",
        )}
        style={{ borderRadius: 13 }}
        href={href}
      >
        {f && !!p && !!g && <BorderTrace width={p} height={g} radius={13} />}
        <div
          className={cn(
            "relative flex items-center gap-x-1",
            "py-[5px] pr-[7px] pl-[11px]",
            "bg-white-100 hover:bg-[#FBFBFC]",
            "transition-colors duration-300 ease-in-out",
            "font-medium text-[13px]/[18px] text-secondary-foreground",
          )}
          style={{ borderRadius: 13 }}
        >
          {t && t.length > 0 && <span className="text-blue-500">{t}</span>}
          <span className="text-balance">{a}</span>
          <Chevron className="transition-transform duration-300 ease-in-out group-hover:-translate-x-px group-hover:duration-50 group-active:translate-x-0 group-active:duration-50 motion-reduce:transition-none" />
        </div>
      </a>
    </div>
  );
}
