"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export type ProcedureItem = { id: string; title: string; description: ReactNode };

const VIEWPORT = { amount: 0.3, once: true } as const;

function DashedLine({ className }: { className: string }) {
  return (
    <svg width="100%" height="1" className={`text-subtle-stroke ${className}`}>
      <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
    </svg>
  );
}

// Numbered steps that write themselves in: number, connector line, title letter by letter, then copy.
export function ProcedureItems({ items }: { items: ProcedureItem[] }) {
  return (
    <div className="relative grid auto-rows-fr">
      {items.map((item, n) => {
        const base = 0.4 * n + 0.1;
        const label = `0${n + 1}`;
        const last = n === items.length - 1;
        return (
          <div key={item.id} className="min-h-30">
            <div className="relative grid h-full grid-cols-12 gap-y-2 py-5 max-lg:grid-rows-[auto_1fr] lg:grid-cols-20">
              <div className="col-[2/3] flex items-start pt-1 max-lg:row-span-2 lg:col-[2/3] lg:pt-1.5">
                <span className="relative inline-block h-full text-overline text-primary-foreground">
                  <motion.span
                    initial={{ opacity: 0.4 }}
                    whileInView={{ opacity: 1, transition: { delay: 0.4 * n + 0.2, duration: 0.2, ease: "easeInOut" } }}
                    viewport={VIEWPORT}
                  >
                    {label}
                  </motion.span>
                  <span
                    className={`absolute top-6 left-1/2 ${last ? "" : "block "}h-full w-px -translate-x-1/2 bg-subtle-stroke${last ? " hidden" : ""}`}
                  >
                    <motion.span
                      className="block h-full w-full bg-black-100"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1, transition: { delay: 0.4 * n + 0.2, duration: 0.3, ease: "easeInOut" } }}
                      viewport={VIEWPORT}
                      style={{ transformOrigin: "top center" }}
                    />
                  </span>
                </span>
              </div>
              <div className="col-[3/-2] max-lg:pl-2 lg:col-[3/10]">
                <h3 className="font-semibold text-base lg:text-lg">
                  <span className="sr-only">{item.title}</span>
                  <motion.span className="inline-block">
                    {item.title.split("").map((ch, r) => {
                      const delay = 1 - Math.sqrt(1 - r / item.title.length) + base;
                      return (
                        <motion.span
                          key={`${item.title}-${r}`}
                          className="inline-flex"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1, transition: { delay, duration: 0.01, ease: "easeInOut" } }}
                          viewport={VIEWPORT}
                        >
                          {ch === " " ? " " : ch}
                        </motion.span>
                      );
                    })}
                  </motion.span>
                </h3>
              </div>
              <p aria-hidden="true" className="col-11 text-center text-overline leading-5 max-lg:hidden">
                {"//"}
              </p>
              <div className="col-[3/-2] max-w-xs max-lg:pl-2 lg:col-[13/-2]">
                <motion.p
                  className="text-pretty text-accent-foreground text-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1, transition: { delay: base, duration: 0.24, ease: "easeInOut" } }}
                  viewport={VIEWPORT}
                >
                  {item.description}
                </motion.p>
              </div>
              <DashedLine className={`absolute top-0 col-[3/-1] lg:col-[3/-1]${n === 0 ? " hidden" : ""}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
