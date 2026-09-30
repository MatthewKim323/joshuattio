"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

const IMAGES = [
  { id: "zoom", src: "/img/img-e6d534a415.avif" },
  { id: "meet", src: "/img/img-61466522aa.avif" },
  { id: "teams", src: "/img/img-71d3972035.avif" },
];

type Dir = "down" | "up";

function Orbiter({
  src,
  index,
  total,
  progress,
  dir,
  path,
}: {
  src: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  dir: Dir;
  path: RefObject<SVGCircleElement | null>;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const along = useSpring(useTransform(progress, [0, 0.15, 0.85, 1], [0.5, 0.75, 0.75, 1]), { bounce: 0.1, visualDuration: 0.6 });
  const offset = (index - (total - 1) / 2) * 0.0275;
  const place = useCallback(
    (v: number) => {
      setTimeout(
        () => {
          const el = path.current;
          const at = v + offset;
          const pt = el ? el.getPointAtLength(el.getTotalLength() * at) : { x: 0, y: 0 };
          x.set(pt.x);
          y.set(pt.y);
        },
        dir === "up" ? 60 * index : 120 - 60 * index,
      );
    },
    [offset, path, x, y, index, dir],
  );
  useMotionValueEvent(along, "change", place);
  useEffect(() => {
    const onResize = () => place(along.get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [along, place]);
  return (
    <motion.div className="absolute" style={{ x, y }}>
      <div className="border border-black-100/5 backdrop-blur-xs dark:border-white-100/5 absolute aspect-square size-16 -translate-x-1/2 -translate-y-1/2" style={{ borderRadius: "100%" }}>
        <div className="overflow-hidden bg-primary-background shadow-joshuattio-5 dark:bg-secondary-background" style={{ borderRadius: "calc(100% - 1px)", padding: "20px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" loading="lazy" width="136" height="136" decoding="async" className="size-full" style={{ color: "transparent" }} srcSet={`${src} 1x, ${src} 2x`} src={src} />
        </div>
      </div>
    </motion.div>
  );
}

// Meeting app icons ride a dashed 680px orbit; a spring on section scroll
// progress walks them from the side up to the crest and on past it.
export function CiIntegrations() {
  const deco = useRef<HTMLDivElement>(null);
  const path = useRef<SVGCircleElement>(null);
  const [dir, setDir] = useState<Dir>("down");
  const { scrollYProgress } = useScroll({ offset: ["start end", "end start"], target: deco });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setDir(v - (scrollYProgress.getPrevious() ?? 0) > 0 ? "down" : "up");
  });
  return (
    <div className="relative pt-3" style={{ maskImage: "linear-gradient(to bottom, black, black 50%, transparent 100%)" }}>
      <div className="absolute top-3 left-1/2 -translate-x-1/2">
        <svg width="100vw" height="1360px">
          <circle ref={path} cx="50%" cy="700" r="680" fill="none" stroke="var(--color-caption-foreground)" strokeDasharray="6 6" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0">
          {IMAGES.map((img, i) => (
            <Orbiter key={img.id} src={img.src} index={i} total={IMAGES.length} progress={scrollYProgress} dir={dir} path={path} />
          ))}
        </div>
      </div>
      <div ref={deco} aria-hidden="true" className="grid h-40 w-full grid-cols-12 overflow-hidden max-xl:h-30 max-lg:h-25">
        <div className="col-[2/-2] flex justify-between" />
      </div>
    </div>
  );
}
