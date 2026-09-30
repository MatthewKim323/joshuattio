"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Slide = { id: string; title: string; description: string; image: string };
type Dir = "positive" | "negative";

const SLIDES: Slide[] = [
  { id: "sales-pipeline", title: "Sales pipeline", description: "Stages, forecasts, win rates, and time to close, all tracked.", image: "/img/img-97bf217ac6.avif" },
  { id: "revenue-metrics", title: "Revenue metrics", description: "Monitor pipeline health, conversion rates, and revenue trends.", image: "/img/img-9b3cccb337.png" },
  { id: "product-growth", title: "Product growth", description: "Track signups, activation, usage, and expansion to accelerate your growth strategy.", image: "/img/img-ca8028f7e4.png" },
];

const BUTTON =
  "inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 gap-x-1.5 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-outline group relative border-subtle-stroke! hover:border-subtle-stroke! hover:bg-secondary-background! data-[active='true']:border-strong-stroke! data-[active='false']:text-tertiary-foreground! lg:text-secondary-foreground! lg:text-sm";

function VDashed({ className }: { className?: string }) {
  return (
    <svg width="1" height="100%" className={className ? `text-subtle-stroke ${className}` : "text-subtle-stroke"}>
      <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
    </svg>
  );
}

function HDashed({ className }: { className: string }) {
  return (
    <svg width="100%" height="1" className={`text-subtle-stroke ${className}`}>
      <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
    </svg>
  );
}

// Report tabs: picking a tab swaps the title, the description (4px nudge from
// the side of travel) and the artwork (slides in 100% from that side).
export function DataSlides() {
  const [dir, setDir] = useState<Dir>("positive");
  const [index, setIndex] = useState(0);
  const select = (i: number) => {
    setDir(i > index ? "positive" : "negative");
    setIndex(i);
  };
  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-[2/-2] pb-5 max-lg:items-center">
          <div className="flex gap-2 mx-lg:gap-1.5 max-lg:flex-wrap max-lg:justify-center">
            {SLIDES.map((s, i) => (
              <button key={s.id} className={i === index ? `${BUTTON} pointer-events-none` : BUTTON} data-active={i === index ? "true" : "false"} onClick={() => select(i)}>
                <span>{s.title}</span>
              </button>
            ))}
            <a
              className="inline-flex cursor-pointer items-center justify-center text-nowrap border transition-colors duration-300 ease-in-out hover:duration-50 active:duration-50 disabled:pointer-events-none disabled:cursor-default h-8 rounded-[10px] px-2.5 text-xs has-[>svg:last-child,>img:last-child]:pr-1.5 has-[>svg:first-child,>img:first-child]:pl-1.5 button-ghost group relative gap-1 text-tertiary-foreground! hover:bg-secondary-background! lg:text-sm"
              href="/platform/reporting"
            >
              <span>{"Learn more"}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.3536 6.35356C10.5488 6.1583 10.5488 5.84171 10.3536 5.64645L7.85355 3.14645C7.65829 2.95118 7.34171 2.95118 7.14645 3.14645C6.95118 3.34171 6.95118 3.65829 7.14645 3.85355L8.79289 5.5L2 5.50001C1.72386 5.50001 1.5 5.72386 1.5 6.00001C1.5 6.27615 1.72386 6.50001 2 6.50001L8.79289 6.5L7.14645 8.14645C6.95118 8.34171 6.95118 8.65829 7.14645 8.85355C7.34171 9.04882 7.65829 9.04882 7.85355 8.85355L10.3536 6.35356Z" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="relative grid w-full grid-cols-12 mt-5 max-lg:mt-0">
        <div aria-hidden="true" className="grid h-40 w-full grid-cols-12 overflow-hidden max-xl:h-30 max-lg:h-25 absolute -top-5 h-5! max-lg:hidden">
          <div className="col-[2/-2] flex justify-between">
            <VDashed />
            <VDashed />
          </div>
        </div>
        <HDashed className="absolute top-0 left-1/2 w-screen -translate-x-1/2" />
        <HDashed className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2" />
        <div className="relative col-[2/-2] flex w-full border border-subtle-stroke max-xl:col-[2/-2] max-lg:col-span-full max-lg:aspect-video max-lg:border-x-0 max-md:aspect-5/4">
          <div className="relative my-px bg-white-100 w-3/10 max-lg:hidden">
            <VDashed className="absolute inset-y-0 right-0" />
            {SLIDES.map((s, i) => (
              <AnimatePresence key={s.id} initial={false}>
                {index === i && (
                  <motion.div
                    key={s.id}
                    initial={{ filter: "blur(2px)", opacity: 0, x: dir === "positive" ? "4px" : "-4px" }}
                    animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                    exit={{ filter: "blur(3px)", opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute top-12 left-10 flex items-center gap-2 max-xl:top-12 max-xl:left-7.5"
                  >
                    <div className="flex flex-col gap-3">
                      <h3 className="max-w-[20em] text-balance pr-6 font-display font-semibold text-2xl">{s.title}</h3>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
            <div className="absolute inset-x-10 bottom-10 max-xl:inset-x-7.5 max-xl:bottom-7.5">
              {SLIDES.map((s, i) => (
                <AnimatePresence key={s.id} initial={false}>
                  {index === i && (
                    <motion.div
                      key={s.id}
                      initial={{ filter: "blur(1.5px)", opacity: 0, x: dir === "positive" ? "4px" : "-4px" }}
                      animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                      exit={{ filter: "blur(2px)", opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute bottom-0 flex max-w-sm flex-col text-balance text-tertiary-foreground"
                    >
                      <p className="mb-3 text-balance text-tertiary-foreground">{s.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </div>
          <div className="relative flex overflow-hidden bg-secondary-background max-lg:aspect-video max-lg:w-full max-lg:justify-center max-md:aspect-square aspect-golden w-7/10">
            <svg width="100%" height="100%" className="text-muted-strong-background mask-[radial-gradient(circle,transparent_00%,black_100%)] absolute inset-0">
              <defs>
                <pattern id="_R_1laqnpfiv9f9k7ivb_" width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect x="5.5" y="5.5" width="1" height="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#_R_1laqnpfiv9f9k7ivb_)" />
            </svg>
            {SLIDES.map((s, i) => (
              <AnimatePresence key={s.id} initial={false}>
                {index === i && (
                  <motion.div
                    key={i}
                    initial={{ filter: "blur(2px)", opacity: 0, x: dir === "positive" ? "100%" : "-100%" }}
                    animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                    exit={{ filter: "blur(3px)", opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="" loading="eager" width="2264" height="2080" decoding="async" data-nimg="1" className="size-full object-contain" style={{ color: "transparent" }} srcSet={`${s.image} 1x`} src={s.image} />
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
