"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { BLUR_CARD, cn, useResolvedReducedMotion } from "./rs-motion";

const CARD_SHADOW =
    "0 0 1px 1px rgba(0,22,62,0.01), 0 4px 12px -1px rgba(0,22,62,0.04), 0 1px 3px -1px rgba(0,22,62,0.18)",
  CARD_SURFACE = "rounded-[6px] bg-primary-background lg:rounded-xl",
  FADE_MASK = {
    maskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
  };
const LIKE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
function Avatar({ className: e, initial: a }: { className?: string; initial: string }) {
  return (
    <span
      className={cn(
        "grid size-[8px] shrink-0 place-items-center rounded-full border border-white-100 font-semibold text-[4px] text-white-100 leading-none lg:size-4 lg:text-[8px]",
        e,
      )}
    >
      {a}
    </span>
  );
}
function ActionButton({ children: e }: { children: ReactNode }) {
  return (
    <span className="grid size-[14px] place-items-center rounded-[4px] text-tertiary-foreground lg:size-7 lg:rounded-lg">
      {e}
    </span>
  );
}
type Play = { avatars: ReactNode; body: string; subject: string };
const PLAYS: Play[] = [
  {
    avatars: (
      <>
        <Avatar className="-mr-[2px] bg-blue-500 lg:-mr-1" initial="M" />
        <Avatar className="bg-[#a8623d]" initial="E" />
      </>
    ),
    body: "Hi Marcus, saw Quanta's usage jumped 42% this month. Looks like the team is scaling fast. Happy to add more seats on your plan so no one gets blocked.",
    subject: "Looking for more seats?",
  },
  {
    avatars: (
      <>
        <Avatar className="-mr-[2px] bg-[#266df0] lg:-mr-1" initial="J" />
        <Avatar className="bg-[#9b69ff]" initial="P" />
      </>
    ),
    body: "Hi Joshua, your renewal is coming up at the end of the month. Happy to review usage together beforehand and make sure the plan still fits where the team is headed.",
    subject: "Ahead of your renewal",
  },
];
function PlayCard({ play: e }: { play: Play }) {
  return (
    <div
      style={{
        boxShadow: CARD_SHADOW,
      }}
      className={cn("flex flex-col overflow-hidden", CARD_SURFACE)}
    >
      <div className="flex px-[6px] pt-[5px] lg:px-3 lg:pt-[10px]">
        <span className="font-medium text-[6px] text-tertiary-foreground leading-[8px] lg:text-[12px] lg:leading-4">
          {"Email suggestion"}
        </span>
      </div>
      <div className="flex flex-col gap-[1px] px-[6px] pt-[4px] pb-[5px] lg:gap-[2px] lg:px-3 lg:pt-2 lg:pb-[10px]">
        <div className="flex items-center gap-[6px] lg:gap-3">
          <span className="min-w-0 flex-1 truncate font-medium text-[7px] text-primary-foreground leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-5 lg:tracking-[-0.14px]">
            {e.subject}
          </span>
          <span className="flex shrink-0 items-center">{e.avatars}</span>
        </div>
        <p className="font-medium text-[6px] text-tertiary-foreground leading-[8px] lg:text-[12px] lg:leading-4">
          {e.body}
        </p>
      </div>
    </div>
  );
}
function LikeButton({ liked: e }: { liked: boolean }) {
  const s = useResolvedReducedMotion();
  return (
    <motion.span
      className={cn(
        "grid size-[14px] place-items-center rounded-[4px] lg:size-7 lg:rounded-lg",
        e ? "text-primary-foreground" : "text-tertiary-foreground",
      )}
      animate={{
        backgroundColor: e ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0)",
        scale: e && !s ? [1, 0.82, 1] : 1,
      }}
      transition={{
        duration: 0.32,
        ease: LIKE_EASE,
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 14 14"
        fill="none"
        className="size-[7px] lg:size-[14px]"
      >
        <path
          d="M4.4 12V6.4l2.4-4.2c.5-.8 1.7-.5 1.7.5v2.6h2.6c.7 0 1.2.6 1 1.3l-1 4c-.1.6-.7 1-1.3 1H4.4Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path
          d="M4.4 6.4H2.6V12h1.8"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    </motion.span>
  );
}
function PlayActions({ liked: e }: { liked: boolean }) {
  return (
    <div className="flex items-center gap-[0.5px] lg:gap-[1px]">
      <ActionButton>
        <svg
          aria-hidden="true"
          viewBox="0 0 14 14"
          fill="none"
          className="size-[7px] lg:size-[14px]"
        >
          <rect
            x="4.6"
            y="4.6"
            width="6.4"
            height="6.4"
            rx="1.6"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path
            d="M9.2 4.6V3.6A1.6 1.6 0 0 0 7.6 2H3.6A1.6 1.6 0 0 0 2 3.6v4A1.6 1.6 0 0 0 3.6 9.2h1"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      </ActionButton>
      <LikeButton liked={e} />
      <ActionButton>
        <svg
          aria-hidden="true"
          viewBox="0 0 14 14"
          fill="none"
          className="size-[7px] lg:size-[14px]"
        >
          <path
            d="M9.6 2v5.6l-2.4 4.2c-.5.8-1.7.5-1.7-.5V8.7H2.9c-.7 0-1.2-.6-1-1.3l1-4c.1-.6.7-1 1.3-1h5.4Z"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M9.6 7.6h1.8V2H9.6"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      </ActionButton>
      <ActionButton>
        <svg
          aria-hidden="true"
          viewBox="0 0 14 14"
          fill="none"
          className="size-[7px] lg:size-[14px]"
        >
          <path
            d="M11.4 7a4.4 4.4 0 1 1-1.3-3.1"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M11.6 1.8v2.6H9"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ActionButton>
    </div>
  );
}
const COLUMN =
    "mx-auto flex h-full w-full max-w-[165px] flex-col gap-[6px] overflow-hidden px-[4px] pt-2 lg:max-w-[330px] lg:gap-3 lg:px-2 lg:pt-4",
  PLAY_EASE: [number, number, number, number] = [0.45, 0.05, 0.15, 1];
function PlayItem({ active: e, liked: s, play: r }: { active: boolean; liked: boolean; play: Play }) {
  return (
    <motion.div
      layout={true}
      className="flex flex-col gap-[6px] lg:gap-3"
      initial={{
        filter: `blur(${BLUR_CARD}px)`,
        opacity: 0,
        y: 8,
      }}
      animate={{
        filter: "blur(0px)",
        opacity: e ? 1 : 0.55,
        y: 0,
      }}
      exit={{
        filter: `blur(${BLUR_CARD}px)`,
        opacity: 0,
        transition: {
          duration: 0.45,
          ease: PLAY_EASE,
        },
        y: -24,
      }}
      transition={{
        duration: 0.65,
        ease: PLAY_EASE,
      }}
    >
      <PlayCard play={r} />
      <motion.div
        initial={false}
        animate={{
          filter: e ? "blur(0px)" : `blur(${BLUR_CARD}px)`,
          opacity: +!!e,
        }}
        transition={{
          delay: 0.22 * +!!e,
          duration: 0.5,
          ease: PLAY_EASE,
        }}
      >
        <PlayActions liked={s} />
      </motion.div>
    </motion.div>
  );
}
export function PlaysFeed() {
  return useResolvedReducedMotion() ? (
    <div className={COLUMN} style={FADE_MASK}>
      <div className="flex flex-col gap-[6px] lg:gap-3">
        <PlayCard play={PLAYS[0]} />
        <PlayActions liked={true} />
      </div>
      <div className="opacity-55">
        <PlayCard play={PLAYS[1]} />
      </div>
    </div>
  ) : (
    <RollingPlays />
  );
}
function RollingPlays() {
  const e = useRef(PLAYS.length),
    [a, s] = useState(() =>
      PLAYS.map((e, t) => ({
        play: e,
        uid: String(t),
      })),
    ),
    i = useRef<HTMLDivElement>(null),
    n = useInView(i, {
      margin: "100px",
    }),
    [l, o] = useState(false);
  return (
    useEffect(() => {
      if (!n) return;
      let t = true,
        a: number[] = [],
        r = (e: number, s: () => void) => {
          a.push(window.setTimeout(() => t && s(), e));
        },
        i = (): void => {
          (r(1800, () => o(true)),
            r(2700, () => {
              (o(false),
                s((t) => {
                  const [a, ...s] = t;
                  return [
                    ...s,
                    {
                      play: a.play,
                      uid: String(e.current++),
                    },
                  ];
                }));
            }),
            r(3200, i));
        };
      return (
        r(1350, i),
        () => {
          ((t = false),
            a.forEach((e) => {
              clearTimeout(e);
            }));
        }
      );
    }, [n]),
    (
      <div ref={i} className={COLUMN} style={FADE_MASK}>
        <AnimatePresence initial={false} mode="popLayout">
          {a.map(({ play: e, uid: a }, s) => (
            <PlayItem key={a} active={0 === s} liked={0 === s && l} play={e} />
          ))}
        </AnimatePresence>
      </div>
    )
  );
}
