"use client";

import { AnimatePresence, motion, type Easing } from "motion/react";
import { useState } from "react";

export type PartnerQuote = {
  name: string;
  role: string;
  company: string;
  overline: string;
  quote: string;
  avatar: string;
  features: { title: string; icon: string }[];
};

export const easeInOutCubic: Easing = (e: number) => (e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2);

const WORD = {
  animate: { opacity: 1, transform: "translateY(0px)" },
  initial: { opacity: 0, transform: "translateY(36px)" },
};

// Blur-fade used by every piece of the open desktop panel.
function fade({ durationFactor, delayFactor }: { durationFactor: number; delayFactor: number }) {
  return {
    animate: {
      filter: "blur(0px)",
      opacity: 1,
      transition: { delay: 0.3 * delayFactor, duration: 0.3 * durationFactor, ease: easeInOutCubic },
    },
    exit: {
      filter: "blur(4px)",
      opacity: 0,
      transition: { duration: (2 / 3) * 0.3, ease: easeInOutCubic },
    },
    initial: { filter: "blur(1px)", opacity: 0 },
    layout: true,
  } as const;
}

function Img({ src, className }: { src: string; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      loading="lazy"
      width="900"
      height="1100"
      decoding="async"
      data-nimg="1"
      className={className}
      style={{ color: "transparent" }}
      srcSet={`${src} 1x, ${src} 2x`}
      src={src}
    />
  );
}

export function ControlledQuoteWordReveal({
  quote,
  isActive,
  duration,
  delay = 0,
  stagger = 0,
  className,
}: {
  quote: string;
  isActive: boolean;
  duration: number;
  delay?: number;
  stagger?: number;
  className: string;
}) {
  const words = ["“", ...`${quote}”`.split(" ")];
  return (
    <p className={`relative text-pretty ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-flex overflow-clip first:absolute first:top-0 first:left-0 first:-translate-x-full">
          <AnimatePresence>
            {isActive ? (
              <motion.span
                key={i}
                initial={WORD.initial}
                animate={WORD.animate}
                exit={{ opacity: 0, transition: { duration: duration && duration / 2, ease: easeInOutCubic } }}
                transition={{ delay: delay + stagger * i, duration, ease: easeInOutCubic }}
                className="will-change-transform"
              >
                {word}
              </motion.span>
            ) : null}
          </AnimatePresence>
          {i !== 0 ? " " : null}
        </span>
      ))}
    </p>
  );
}

function ExpansionIndicator({ active }: { active: boolean }) {
  const i = 12;
  const l = 1.5;
  const o = 1.6 * i;
  return (
    <svg width={o} height={i} strokeWidth={l} stroke="currentColor">
      <line x1="0" y1={l / 2} x2="20%" y2={l / 2} />
      <line x1={l / 2} y1="0" x2={l / 2} y2="100%" />
      <line x1="0" y1={i - l / 2} x2="20%" y2={i - l / 2} />
      <line x1={o / 2 - 0.3 * i} y1="50%" x2={o / 2 + 0.3 * i} y2="50%" />
      <line
        x1="50%"
        y1={i / 2 - 0.3 * i}
        x2="50%"
        y2={i / 2 + 0.3 * i}
        className={`origin-center transition-scale ease-in-out${active ? " scale-y-0" : ""}`}
        style={{ transitionDuration: "0.4s" }}
      />
      <line x1="80%" y1={l / 2} x2="100%" y2={l / 2} />
      <line x1={o - l / 2} y1="0" x2={o - l / 2} y2="100%" />
      <line x1="80%" y1={i - l / 2} x2="100%" y2={i - l / 2} />
    </svg>
  );
}

function DesktopQuote({ index, q, isActive, onClick }: { index: number; q: PartnerQuote; isActive: boolean; onClick: () => void }) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.44999999999999996, ease: easeInOutCubic }}
      className={`group relative w-full transition-colors duration-300 ${
        isActive ? "col-span-[18] bg-primary-background" : "col-span-3 cursor-pointer bg-secondary-background"
      }`}
      onClick={onClick}
    >
      <motion.div
        layout
        className="relative grid w-full grid-cols-10 grid-rows-[36px_300px_52px] items-center overflow-hidden pt-15 max-xl:grid-rows-[14px_300px_12px]"
      >
        <motion.div
          layout
          className={`absolute inset-0 row-[2/2] flex items-center justify-center ${isActive ? "col-[1/4]" : "col-[1/-1]"}`}
        >
          <motion.div layout className="flex items-center justify-center">
            <Img
              src={q.avatar}
              className={`max-h-60 min-h-full min-w-full max-w-60 object-contain max-xl:max-h-50 max-xl:max-w-50 transition-transform duration-400 ease-in-out${
                isActive ? "" : " group-hover:scale-[1.01] group-hover:duration-150"
              }`}
            />
          </motion.div>
        </motion.div>
        <AnimatePresence>
          {isActive && (
            <>
              <motion.h2 key="overline" {...fade({ delayFactor: 0, durationFactor: 1 })} className="col-[4/-1] w-fit shrink-0 whitespace-nowrap text-overline">
                {q.overline}
              </motion.h2>
              <div key="body" className="col-[4/-2] flex w-146 flex-col gap-7 max-xl:w-113">
                <AnimatePresence propagate>
                  <motion.div key={q.quote} {...fade({ delayFactor: 0, durationFactor: 2 })}>
                    <ControlledQuoteWordReveal
                      quote={q.quote}
                      isActive={isActive}
                      duration={0.6}
                      stagger={(1 / 24) * 0.3}
                      className="w-full text-quote max-xl:text-quote-sm"
                    />
                  </motion.div>
                  <motion.p key="byline" {...fade({ delayFactor: 2, durationFactor: 1.5 })} className="w-fit whitespace-nowrap text-sm">
                    <span className="font-bold">{q.name}</span>
                    {", "}
                    {q.role}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div key="features" className="contents max-xl:hidden">
                <motion.svg
                  {...fade({ delayFactor: 3, durationFactor: 1 })}
                  width="100%"
                  height="1"
                  className="absolute inset-x-0 top-0 col-[1/-1] row-[3/3] text-white-600"
                >
                  <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
                </motion.svg>
                <motion.p
                  {...fade({ delayFactor: 3, durationFactor: 1 })}
                  className="-translate-1/2 absolute top-1/2 left-1/2 col-[1/4] row-[3/3] flex w-fit items-center justify-evenly overflow-hidden whitespace-nowrap text-center font-semibold text-black-800 text-sm"
                >
                  {q.company}
                  {"’s favorite features"}
                </motion.p>
                <motion.div
                  {...fade({ delayFactor: 3, durationFactor: 1 })}
                  className="absolute inset-0 col-[4/-1] row-[3/3] flex w-fit items-center gap-8"
                >
                  {q.features.map((f) => (
                    <motion.div layout key={f.title} className="flex w-fit shrink-0 items-center gap-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" loading="lazy" width="18" height="18" decoding="async" data-nimg="1" className="size-4.5" style={{ color: "transparent" }} src={f.icon} />
                      <p className="truncate text-black-800 text-sm">{f.title}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div layout className={`absolute inset-y-0 left-0 -translate-x-1/2${index === 0 ? " hidden" : ""}`}>
        <svg width="1" height="100%" className="h-full text-[#7D87A533] backdrop-blur">
          <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="currentColor" strokeLinecap="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function MobileQuote({ q, isActive, onClick }: { q: PartnerQuote; isActive: boolean; onClick: () => void }) {
  const on = isActive ? 1 : 0;
  return (
    <motion.div
      initial={{ backgroundColor: "var(--color-secondary-background)", height: "60px" }}
      animate={{
        backgroundColor: isActive ? "var(--color-primary-background)" : "var(--color-secondary-background)",
        height: isActive ? "fit-content" : "60px",
        transition: { duration: 0.4, ease: easeInOutCubic },
      }}
      className={`relative grid w-full grid-cols-12 overflow-hidden${isActive ? "" : " cursor-pointer"}`}
      onClick={onClick}
    >
      <div className="col-[2/-2] flex w-full flex-col gap-y-6 pt-9">
        <motion.div
          layout
          initial={{ filter: "blur(1px)", opacity: 0 }}
          animate={{
            filter: isActive ? "blur(0px)" : "blur(1px)",
            opacity: on,
            transition: { delay: 0.2 * on, duration: isActive ? 0.4 : 0.1, ease: easeInOutCubic },
          }}
          className="flex w-30 items-center justify-center"
        >
          <Img src={q.avatar} className="size-full object-contain" />
        </motion.div>
        <div className="relative flex w-full flex-col overflow-hidden pb-20">
          <div className="flex w-full flex-col gap-6">
            <ControlledQuoteWordReveal
              quote={q.quote}
              isActive={isActive}
              stagger={isActive ? (1 / 24) * 0.2 : 0}
              duration={isActive ? 0.4 : 0.1}
              delay={0.2 * on}
              className="w-full text-quote-sm"
            />
            <motion.p
              animate={{
                filter: isActive ? "blur(0px)" : "blur(1px)",
                opacity: on,
                transition: { delay: 0.6000000000000001 * on, duration: isActive ? 0.4 : 0.1, ease: easeInOutCubic },
              }}
              className="truncate text-secondary-foreground text-sm"
            >
              <span className="font-bold">{q.name}</span>
              {", "}
              {q.role}
            </motion.p>
          </div>
        </div>
      </div>
      <div className="group absolute inset-x-0 bottom-0 grid h-15 w-full grid-cols-12 items-center text-overline mix-blend-multiply">
        <div
          className={`col-[2/-2] flex w-full items-center justify-between transition-colors duration-400 ease-in-out group-hover:text-black-800 group-hover:duration-150 group-active:text-black-800 group-active:duration-50${
            isActive ? " text-black-800" : ""
          }`}
        >
          <p>{q.overline}</p>
          <ExpansionIndicator active={isActive} />
        </div>
      </div>
    </motion.div>
  );
}

// Three partner portraits: desktop is a row of columns where the picked one widens
// into the full quote; below lg it becomes a stacked accordion. Starts on the third.
export function QuotesAccordion({ quotes, initialIndex = 2 }: { quotes: PartnerQuote[]; initialIndex?: number }) {
  const [active, setActive] = useState(initialIndex);
  return (
    <div className="bg-secondary-background">
      <div className="container">
        <div className="border-subtle-stroke border-x">
          <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] overflow-hidden max-lg:hidden">
            {quotes.map((q, i) => (
              <DesktopQuote key={i} index={i} q={q} isActive={active === i} onClick={() => setActive(i)} />
            ))}
          </div>
          <div className="flex flex-col items-stretch divide-y divide-subtle-stroke lg:hidden">
            {quotes.map((q, i) => (
              <MobileQuote key={i} q={q} isActive={active === i} onClick={() => setActive(i)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
