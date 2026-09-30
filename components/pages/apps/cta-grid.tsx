"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

// Build-with-us icon wall, 15 cells in payload order (all filled).
const ICONS = [
  "/img/img-cae4c7e161.svg",
  "/img/img-4e96c0b2ef.svg",
  "/img/img-3887494805.svg",
  "/img/img-241f8a1f63.svg",
  "/img/img-4516e9e50b.svg",
  "/img/img-0ab047c5ca.svg",
  "/img/img-c0e923491c.svg",
  "/img/img-3ff38cf529.svg",
  "/img/img-2af8ff007e.svg",
  "/img/img-402b11fafe.svg",
  "/img/img-c7a941edbb.svg",
  "/img/img-fdc33c69cf.svg",
  "/img/img-e29193209c.svg",
  "/img/img-0001fb126d.svg",
  "/img/img-7398d2699e.svg",
];
const CELLS: (string | null)[] = [...ICONS.slice(0, 15), ...Array<null>(Math.max(0, 15 - ICONS.length)).fill(null)];

function Line({ vertical = false, dashed = false, className }: { vertical?: boolean; dashed?: boolean; className?: string }) {
  return (
    <svg width={vertical ? "1" : "100%"} height={vertical ? "100%" : "1"} className={`text-subtle-stroke ${className}`}>
      <line x1={vertical ? "0.5" : "0"} y1={vertical ? "0" : "0.5"} x2={vertical ? "0.5" : "100%"} y2={vertical ? "100%" : "0.5"} stroke="currentColor" strokeDasharray={dashed ? "4 6" : undefined} strokeLinecap="round" />
    </svg>
  );
}

/** Icon wall that fades in cell by cell (shuffled, 80ms apart) the first time it scrolls into view. */
export function CtaGrid() {
  const [order, setOrder] = useState<{ delays: number[]; indices: number[] } | null>(null);
  useEffect(() => {
    const indices = Array.from({ length: 15 }, (_, i) => i).toSorted(() => Math.random() - 0.5);
    const filled = indices
      .map((cell, pos) => (CELLS[cell] ? pos : -1))
      .filter((pos) => pos !== -1)
      .toSorted(() => Math.random() - 0.5);
    const delays = Array<number>(15).fill(1.5);
    filled.forEach((pos, rank) => {
      delays[pos] = 0.08 * rank;
    });
    setOrder({ delays, indices });
  }, []);
  const indices = order?.indices ?? Array.from({ length: 15 }, (_, i) => i);
  const delays = order?.delays ?? CELLS.map((c) => (c ? 0 : 1.5));

  return (
    <div className="relative col-[8/-2] grid grid-cols-5 grid-rows-3 flex-col items-center max-xl:col-[7/-2] max-lg:col-[2/-2]">
      <Line dashed className="absolute top-0 left-1/2 w-screen -translate-x-1/2 -translate-y-1/2 lg:hidden" />
      <Line vertical dashed className="absolute top-1/2 left-0 h-screen -translate-x-1/2 -translate-y-1/2 max-lg:hidden" />
      <Line vertical dashed className="absolute top-1/2 right-0 h-screen translate-x-1/2 -translate-y-1/2 max-lg:hidden" />
      {indices.map((cell, pos) => {
        const icon = CELLS[cell];
        return (
          <motion.div
            key={cell}
            initial={{ filter: "blur(1px)", opacity: 0 }}
            whileInView={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ delay: delays[pos], duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`relative flex aspect-square items-center justify-center ${icon ? "bg-white-100" : "bg-white-200"}`}
          >
            <Line className="absolute inset-x-0 top-0 -translate-y-1/2" />
            <Line className="absolute inset-x-0 bottom-0 translate-y-1/2" />
            <Line vertical className="absolute inset-y-0 left-0 -translate-x-1/2" />
            <Line vertical className="absolute inset-y-0 right-0 translate-x-1/2" />
            {icon ? (
              <img alt="" loading="lazy" width="100" height="100" decoding="async" className="size-5 object-contain opacity-75" style={{ color: "transparent" }} src={icon} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-strong-stroke">
                <path d="M7 2C7.27612 2 7.49996 2.22389 7.5 2.5V6.5H11.5C11.7761 6.5 12 6.72386 12 7C12 7.27614 11.7761 7.5 11.5 7.5H7.5V11.5C7.5 11.7761 7.27614 12 7 12C6.72386 12 6.5 11.7761 6.5 11.5V7.5H2.5C2.22386 7.5 2 7.27614 2 7C2 6.72386 2.22386 6.5 2.5 6.5H6.5V2.5C6.50004 2.22389 6.72388 2 7 2Z" fill="currentColor" />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
