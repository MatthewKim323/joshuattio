"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { DUR_EXIT, DUR_REVEAL, EASE_UI, EASE_UI_EXIT, useReducedMotionSafe, withTempo } from "./gp-tempo";

const QUERY = "Show me outreach targets";
const SHADOW_IDLE =
  "0 0 1px 1px rgba(0,22,62,0.01), 0 4px 12px -1px rgba(0,22,62,0.04), 0 1px 3px -1px rgba(0,22,62,0.18)";
const SHADOW_TYPING =
  "0 0 1px 1px rgba(0,22,62,0.02), 0 2px 6px -1px rgba(0,22,62,0.06), 0 1px 2px -1px rgba(0,22,62,0.24)";

const RESULTS = [
  { logo: "/img/img-14301bfec9.avif", name: "Granola", reason: "Raised $125M Series C" },
  { logo: "/img/img-dc79872b60.avif", name: "Linear", reason: "Building out its sales team" },
  { logo: "/img/img-3f15547f28.avif", name: "Notion", reason: "New VP Sales from enterprise SaaS" },
  { logo: "/img/img-805af2e95e.avif", name: "OpenAI", reason: "Scaling faster than it can hire" },
  { logo: "/img/img-afb43f2cdd.avif", name: "Shopify", reason: "Doubling down on enterprise sales" },
  { logo: "/img/img-245e233f08.avif", name: "Dropbox", reason: "GTM reset under a new CRO" },
];

// "Ask something..." box: types a query, presses send, shows the results list, loops.
export function GpAsk() {
  const reduce = useReducedMotionSafe();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.4 });
  const [typed, setTyped] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (reduce) {
      setShowResults(true);
      setTyped("");
      return;
    }
    if (!inView) return;
    let alive = true;
    let cancel: (() => void) | undefined;
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const t = setTimeout(resolve, ms);
        cancel = () => {
          clearTimeout(t);
          reject();
        };
      });
    const cycle = async () => {
      setShowResults(false);
      setPressed(false);
      setTyped("");
      await wait(withTempo(900));
      for (let i = 1; i <= QUERY.length; i++) {
        setTyped(QUERY.slice(0, i));
        await wait(48);
      }
      await wait(withTempo(420));
      setPressed(true);
      await wait(140);
      setPressed(false);
      setShowResults(true);
      setTyped("");
      await wait(withTempo(6000));
      setShowResults(false);
      await wait(withTempo(700));
    };
    (async () => {
      while (alive) {
        try {
          await cycle();
        } catch {
          return;
        }
      }
    })();
    return () => {
      alive = false;
      cancel?.();
    };
  }, [reduce, inView]);

  const canSend = typed.length > 0 && !showResults;

  return (
    <div ref={root} className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-[196px] flex-col lg:max-w-[392px]">
        <div
          className="flex items-center gap-1 py-1 pr-1 pl-[7px] lg:gap-2 lg:py-2 lg:pr-2 lg:pl-3.5 border bg-primary-background rounded-[6px] border-transparent lg:rounded-xl"
          style={{
            boxShadow: typed ? SHADOW_TYPING : SHADOW_IDLE,
            transition: "box-shadow 0.26s cubic-bezier(0.33, 1, 0.68, 1)",
          }}
        >
          <span
            className={
              "flex-1 truncate font-medium text-[6.5px] leading-[9px] tracking-[-0.065px] lg:text-[13px] lg:leading-[18px] lg:tracking-[-0.13px] " +
              (typed ? "text-[#242629]" : "text-[rgba(0,0,0,0.4)]")
            }
          >
            {typed || "Ask something..."}
            {typed ? (
              <motion.span
                aria-hidden="true"
                className="ml-[1px] inline-block h-[7px] w-[1px] translate-y-[1px] bg-[#266df0] align-baseline lg:h-[13px] lg:w-[1.5px] lg:translate-y-[2px]"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
              />
            ) : null}
          </span>
          <motion.span
            aria-hidden="true"
            className="flex size-[14px] shrink-0 items-center justify-center rounded-[4px] border border-[rgba(0,0,0,0.1)] bg-[#266df0] shadow-[0_1px_2px_-1px_rgba(15,107,233,0.12),0_1.5px_3px_-1px_rgba(15,107,233,0.08)] lg:size-7 lg:rounded-lg lg:shadow-[0_2px_4px_-2px_rgba(15,107,233,0.12),0_3px_6px_-2px_rgba(15,107,233,0.08)]"
            initial={false}
            animate={{ opacity: reduce ? 0.4 : canSend ? 1 : 0.4, scale: pressed ? 0.86 : 1 }}
            transition={{ duration: withTempo(0.22), ease: pressed ? EASE_UI_EXIT : EASE_UI }}
          >
            <svg viewBox="0 0 14 14" fill="none" className="size-[7px] text-white-100 lg:size-3.5" aria-hidden="true">
              <path d="M7 10.5V3.5M7 3.5L4 6.5M7 3.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        </div>
        <AnimatePresence initial={false}>
          {showResults ? (
            <motion.div
              key="results"
              className="rounded-[6px] [--results-gap:6px] lg:rounded-xl lg:[--results-gap:12px]"
              initial={{ height: 0, marginTop: 0, opacity: 0 }}
              animate={{ height: "auto", marginTop: "var(--results-gap)", opacity: 1 }}
              exit={{ height: 0, marginTop: 0, opacity: 0 }}
              transition={{
                height: { duration: withTempo(DUR_REVEAL), ease: EASE_UI },
                marginTop: { duration: withTempo(DUR_REVEAL), ease: EASE_UI },
                opacity: { duration: withTempo(DUR_EXIT), ease: EASE_UI },
              }}
              style={{ boxShadow: SHADOW_IDLE, overflow: "hidden" }}
            >
              <div className="px-[3px] pt-[5px] pb-[3px] lg:px-1.5 lg:pt-2.5 lg:pb-1.5 border bg-primary-background rounded-[6px] border-transparent lg:rounded-xl">
                <span className="block px-1 pb-[3px] font-medium text-[5px] text-[rgba(0,0,0,0.55)] leading-[6.5px] lg:px-2 lg:pb-1.5 lg:text-[10px] lg:leading-[13px]">
                  {"10 accounts ready for outreach"}
                </span>
                <ul className="flex flex-col">
                  {RESULTS.map((r, i) => (
                    <motion.li
                      key={r.name}
                      className="flex items-center gap-[3px] rounded-[5px] px-1 py-[3px] lg:gap-1.5 lg:rounded-[10px] lg:px-2 lg:py-1.5"
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: withTempo(0.12 + 0.05 * i), duration: withTempo(0.34), ease: EASE_UI }}
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-[7.5px] shrink-0 items-center justify-center overflow-hidden rounded-[2.5px] border border-[rgba(0,0,0,0.05)] lg:size-[15px] lg:rounded-[5px]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="" loading="lazy" width={400} height={400} decoding="async" className="size-full object-cover" src={r.logo} />
                      </span>
                      <span className="flex min-w-0 items-baseline gap-[2px] whitespace-nowrap lg:gap-1">
                        <span className="shrink-0 font-medium text-[#242629] text-[6.5px] leading-[9px] tracking-[-0.065px] lg:text-[13px] lg:leading-[18px] lg:tracking-[-0.13px]">
                          {r.name}
                        </span>
                        <span className="truncate font-medium text-[5.5px] text-[rgba(0,0,0,0.4)] leading-[7.5px] lg:text-[11px] lg:leading-[15px]">
                          {r.reason}
                        </span>
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
