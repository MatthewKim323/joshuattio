"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useMedia } from "@/components/pages/apps/detail/use-media";

type Logo = { src: string; width: number; height: number };

// Hero logo wall, in payload order. The grid shows the first 20 (12 below 992px, 18 below 768px).
const LOGOS: Logo[] = [
  { src: "/img/img-943973cfa5.svg", width: 34, height: 34 },
  { src: "/img/img-22d36cc0ab.svg", width: 34, height: 27 },
  { src: "/img/img-c4a703e9c7.svg", width: 35, height: 24 },
  { src: "/img/img-99e06f6f9d.svg", width: 35, height: 31 },
  { src: "/img/img-a60d7dfc66.svg", width: 32, height: 35 },
  { src: "/img/img-b41cf79a8a.svg", width: 31, height: 31 },
  { src: "/img/img-83deabdf38.svg", width: 32, height: 32 },
  { src: "/img/img-b70724fd2c.svg", width: 32, height: 26 },
  { src: "/img/img-fd4ffe32e2.svg", width: 32, height: 31 },
  { src: "/img/img-3bfce634c5.svg", width: 32, height: 33 },
  { src: "/img/img-8544c3c935.svg", width: 32, height: 32 },
  { src: "/img/img-a3aa0d7f3d.svg", width: 38, height: 23 },
  { src: "/img/img-46fa637add.svg", width: 32, height: 33 },
  { src: "/img/img-9d764e8bd3.svg", width: 32, height: 32 },
  { src: "/img/img-48b8c06608.svg", width: 31, height: 31 },
  { src: "/img/img-7b9081345d.svg", width: 32, height: 32 },
  { src: "/img/img-ecaddcfb41.svg", width: 34, height: 30 },
  { src: "/img/img-bfb8692e92.svg", width: 36, height: 32 },
  { src: "/img/img-e7c02e219f.svg", width: 32, height: 32 },
  { src: "/img/img-de193130dd.svg", width: 35, height: 23 },
];

function Line({ vertical = false, dashed = false, className }: { vertical?: boolean; dashed?: boolean; className?: string }) {
  return (
    <svg width={vertical ? "1" : "100%"} height={vertical ? "100%" : "1"} className={`text-subtle-stroke${className ? ` ${className}` : ""}`}>
      <line
        x1={vertical ? "0.5" : "0"}
        y1={vertical ? "0" : "0.5"}
        x2={vertical ? "0.5" : "100%"}
        y2={vertical ? "100%" : "0.5"}
        stroke="currentColor"
        strokeDasharray={dashed ? "4 6" : undefined}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Plus14({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path
        d="M7 2C7.27612 2 7.49996 2.22389 7.5 2.5V6.5H11.5C11.7761 6.5 12 6.72386 12 7C12 7.27614 11.7761 7.5 11.5 7.5H7.5V11.5C7.5 11.7761 7.27614 12 7 12C6.72386 12 6.5 11.7761 6.5 11.5V7.5H2.5C2.22386 7.5 2 7.27614 2 7C2 6.72386 2.22386 6.5 2.5 6.5H6.5V2.5C6.50004 2.22389 6.72388 2 7 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

const EASE = { duration: 1, ease: "easeOut" } as const;

export function AppsHeroGrid() {
  const isLg = useMedia("(max-width: 991.98px)");
  const count = useMedia("(max-width: 767.98px)") ? 18 : isLg ? 12 : 20;
  const cells = useMemo<(Logo | null)[]>(() => {
    const picked = LOGOS.slice(0, count);
    return [...picked, ...Array<null>(Math.max(0, count - picked.length)).fill(null)];
  }, [count]);
  const [order, setOrder] = useState<{ delays: number[]; indices: number[] } | null>(null);

  useEffect(() => {
    const indices = Array.from({ length: cells.length }, (_, i) => i).toSorted(() => Math.random() - 0.5);
    const filled = indices
      .map((cell, pos) => (cells[cell] ? pos : -1))
      .filter((pos) => pos !== -1)
      .toSorted(() => Math.random() - 0.5);
    const delays = Array<number>(cells.length).fill(1.5);
    filled.forEach((pos, rank) => {
      delays[pos] = 0.06 * rank;
    });
    setOrder({ delays, indices });
  }, [cells]);

  const indices = order?.indices ?? Array.from({ length: cells.length }, (_, i) => i);
  const delays = order?.delays ?? cells.map((c) => (c ? 0 : 1.5));
  const columns = Math.ceil(cells.length / 2) + 1;

  return (
    <div className="relative mt-5 grid grid-cols-12">
      <Line dashed className="absolute -top-px" />
      <Line dashed className="absolute -bottom-px" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, ...EASE }}>
        <div
          className="size-full text-surface-subtle absolute inset-0"
          style={{ backgroundImage: "repeating-linear-gradient(125deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)" }}
        />
      </motion.div>
      <motion.div
        initial={{ backgroundColor: "#FFFFFF00" }}
        animate={{ backgroundColor: "#FFFFFF" }}
        transition={{ delay: 1, ...EASE }}
        className="relative col-[2/-2] grid grid-cols-10 max-lg:col-span-full max-lg:grid-cols-6"
        data-visual-test="blackout"
      >
        <Line vertical dashed className="absolute -top-5 left-0 h-screen max-lg:hidden" />
        <Line vertical dashed className="absolute -top-5 right-0 h-screen max-lg:hidden" />
        {indices.map((cell, pos) => {
          const logo = cells[cell];
          return (
            <motion.div
              key={cell}
              initial={{ filter: "blur(1px)", opacity: 0, scale: logo ? 1.1 : 0.9 }}
              animate={{ filter: "blur(0px)", opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: delays[pos], ...EASE }}
              className={`relative flex aspect-square items-center justify-center ${logo ? "bg-white-100" : "bg-white-200"}`}
            >
              {logo ? (
                <img alt="" width={logo.width} height={logo.height} decoding="async" className="size-1/4 object-contain" style={{ color: "transparent" }} src={logo.src} />
              ) : (
                <Plus14 className="text-strong-stroke" />
              )}
            </motion.div>
          );
        })}
        <div className="absolute inset-0 flex justify-between">
          {Array.from({ length: columns }).map((_, i) => (
            <motion.div
              key={`v-line-${i}`}
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ delay: 0.1 * i, ...EASE }}
              className={`overflow-hidden max-lg:last:invisible max-lg:first:invisible${[1, 2, 3].includes(i) ? " max-md:hidden" : ""}`}
            >
              <Line vertical className="h-full" />
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-0 flex justify-between max-md:hidden">
          {Array.from({ length: columns }).map((_, i) => (
            <motion.div
              key={`v-dashed-line-${i}`}
              initial={{ height: 0 }}
              animate={{ height: "calc(100% + 96px)" }}
              transition={{ delay: 0.1 * i, ...EASE }}
              className={`overflow-hidden first:invisible last:invisible${[1, 2, 3].includes(i) ? " max-md:hidden" : ""}`}
            >
              <Line vertical dashed className="h-full" />
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-x-0 -inset-y-px flex flex-col justify-between">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={`h-line-${i}`}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.1 * i, ...EASE }}
              className="h-fit overflow-hidden md:last:hidden"
            >
              <Line />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
