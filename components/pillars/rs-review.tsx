"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { EASE_UI_EXIT, STREAM_MS_PER_CHAR, cn, useResolvedReducedMotion, withTempo } from "./rs-motion";
import { CARD_BORDER as V, CardStack, PROOF_ENTER as S } from "./rs-deal-stack";

const RISKS = [
    "Forage - Negotiation, $29,288. Close date passed today with no signature. Jordan asked for a demo to share internally, a sign a new stakeholder needs convincing.",
    "Helix - Procurement/Signing, $18,280. Unsigned since June 1 despite a June 15 follow-up. Stalling in legal.",
  ],
  LINES = [
    "Deals at Risk",
    "These are in late stages but showing warning signs:",
    ...RISKS,
  ],
  LINE_STARTS: number[] = [0];
for (const e of LINES) LINE_STARTS.push((LINE_STARTS.at(-1) ?? 0) + e.length);
const TOTAL_CHARS = LINE_STARTS[LINES.length];
function ReviewText({ chars: e }: { chars: number }) {
  const a = (t: number) => {
      const a = LINES[t],
        s = Math.max(0, Math.min(a.length, e - LINE_STARTS[t]));
      return a.slice(0, s);
    },
    s = (t: number) => e > LINE_STARTS[t];
  return (
    <>
      <p className="mt-[6px] font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.07px] lg:mt-3 lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
        {s(0) ? "🚨 " : ""}
        {a(0)}
      </p>
      <p className="mt-[6px] font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.07px] lg:mt-3 lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
        {a(1)}
      </p>
      <ul className="mt-[5px] flex w-[215px] flex-col gap-[5px] lg:mt-[10px] lg:w-[430px] lg:gap-[10px]">
        {RISKS.map((e, r) => (
          <li
            key={e}
            className="relative pl-[9px] font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.07px] lg:pl-[18px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]"
          >
            {s(r + 2) ? (
              <span
                aria-hidden="true"
                className="absolute top-[4px] left-[2.5px] size-[1.5px] rounded-full bg-primary-foreground lg:top-[8px] lg:left-[5px] lg:size-[3px]"
              />
            ) : null}
            {a(r + 2)}
          </li>
        ))}
      </ul>
    </>
  );
}
export function ReviewPanel() {
  const e = useResolvedReducedMotion(),
    s = useRef<HTMLDivElement>(null),
    n = useInView(s, {
      amount: 0.4,
    }),
    [l, o] = useState<"think" | "stream" | "hold" | "exit">("think"),
    [d, x] = useState(0);
  useEffect(() => {
    let t: (() => void) | undefined;
    if (e) {
      (o("hold"), x(TOTAL_CHARS));
      return;
    }
    if (!n) return;
    let a = true,
      s = (e: number) =>
        new Promise<void>((a, s) => {
          const r = setTimeout(a, e);
          t = () => {
            (clearTimeout(r), s());
          };
        }),
      r = async () => {
        (o("think"), x(0), await s(withTempo(2200)), o("stream"));
        for (let e = 4; e < TOTAL_CHARS; e += 4)
          (x(e), await s(4 * STREAM_MS_PER_CHAR));
        (x(TOTAL_CHARS),
          o("hold"),
          await s(withTempo(4500)),
          o("exit"),
          await s(withTempo(550) + 100));
      };
    return (
      (async () => {
        for (; a;)
          try {
            await r();
          } catch {
            return;
          }
      })(),
      () => {
        ((a = false), t?.());
      }
    );
  }, [e, n]);
  const p = "think" === l && !e;
  return (
    <div
      ref={s}
      aria-hidden="true"
      className="mx-auto w-full max-w-[188px] p-[6px] lg:max-w-[376px] lg:p-[12px]"
      style={{
        maskImage: "linear-gradient(to right, #000 72%, transparent 98%)",
        WebkitMaskImage:
          "linear-gradient(to right, #000 72%, transparent 98%)",
      }}
    >
      <CardStack>
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-[6px] bg-primary-background p-[10px] lg:rounded-xl lg:p-5",
            V,
            S,
          )}
        >
          <div className="flex items-center gap-[2px] lg:gap-[4px]">
            <span className="relative font-medium text-[7px] text-tertiary-foreground leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
              {"Thinking"}
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 70%, rgba(255,255,255,0) 100%)",
                  backgroundSize: "250% 100%",
                }}
                initial={false}
                animate={
                  p
                    ? {
                        backgroundPosition: ["100% 0%", "0% 0%"],
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                      }
                }
                transition={
                  p
                    ? {
                        backgroundPosition: {
                          duration: 1.6,
                          ease: "linear",
                          repeat: Infinity,
                          repeatDelay: 0.4,
                        },
                        opacity: {
                          duration: 0.2,
                        },
                      }
                    : {
                        duration: 0.3,
                      }
                }
              >
                {"Thinking"}
              </motion.span>
            </span>
            <svg
              viewBox="0 0 14 14"
              className="size-[7px] text-tertiary-foreground lg:size-[14px]"
              aria-hidden="true"
            >
              <path
                d="m5.5 3.5 3.5 3.5-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <div className="relative">
            <div className="invisible flow-root">
              <ReviewText chars={TOTAL_CHARS} />
            </div>
            <motion.div
              className="absolute inset-0"
              style={{
                maskImage:
                  "linear-gradient(to bottom, #000 0%, #000 40%, transparent 60%, transparent 100%)",
                maskRepeat: "no-repeat",
                maskSize: "100% 250%",
              }}
              initial={false}
              animate={{
                maskPosition: "exit" === l ? "0% 100%" : "0% 0%",
              }}
              transition={
                "exit" === l
                  ? {
                      duration: 0.55,
                      ease: EASE_UI_EXIT,
                    }
                  : {
                      duration: 0,
                    }
              }
            >
              <ReviewText chars={d} />
            </motion.div>
          </div>
        </div>
      </CardStack>
    </div>
  );
}
