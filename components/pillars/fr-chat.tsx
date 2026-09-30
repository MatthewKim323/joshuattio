"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { BLUR_CARD, BLUR_ENTRANCE, EASE_UI, cn, useResolvedReducedMotion, withTempo } from "./rs-motion";

const CHEVRON_DOWN =
  "M0.146447 0.146447C0.341709 -0.0488155 0.658216 -0.0488155 0.853478 0.146447L4 3.29293L7.14645 0.146447C7.34171 -0.0488155 7.65822 -0.0488155 7.85348 0.146447C8.04859 0.341721 8.04869 0.658266 7.85348 0.853478L4.35348 4.35348C4.15827 4.54869 3.84172 4.54859 3.64645 4.35348L0.146447 0.853478C-0.0488155 0.658216 -0.0488155 0.341709 0.146447 0.146447Z";
function Glyph({ className: e, d: a, viewBox: s }: { className?: string; d: string; viewBox: string }) {
  return (
    <svg
      viewBox={s}
      fill="currentColor"
      aria-hidden="true"
      className={cn("block shrink-0", e)}
    >
      <path d={a} />
    </svg>
  );
}
const EASE = EASE_UI,
  SQL_BLUE = "#266df0",
  SQL_INK = "#242629",
  SQL_TOKENS = [
    {
      color: SQL_BLUE,
      text: "SELECT",
    },
    {
      color: SQL_INK,
      text: "\n    record_id,\n    name,\n    value AS deal_value,\n    closed_won_date,\n    estimated_close_date,\n    (stage).title AS stage\n",
    },
    {
      color: SQL_BLUE,
      text: "FROM",
    },
    {
      color: SQL_INK,
      text: " deals\n",
    },
    {
      color: SQL_BLUE,
      text: "WHERE",
    },
    {
      color: SQL_INK,
      text: "\n  (\n",
    },
    {
      color: "rgba(0,0,0,0.4)",
      text: "    -- Closed-Won this week (week of June 15-21, 2026)\n",
    },
    {
      color: SQL_INK,
      text: "    (closed_won_date >= '2026-06-15' AND closed_won_date <= '2026-06-21')",
    },
  ],
  SQL_LENGTH = SQL_TOKENS.reduce((e, t) => e + t.text.length, 0);
function useTypedCount(e: number, t: boolean, a: boolean, s: number) {
  const [i, n] = useState(0);
  return (
    useEffect(() => {
      if (a) return void n(e);
      if (!t) return void n(0);
      let r = 0,
        i = 0,
        l = (t: number) => {
          0 === i && (i = t);
          const a = Math.min(e, Math.round((t - i) / s));
          (n((e) => (e === a ? e : a)),
            a < e && (r = requestAnimationFrame(l)));
        };
      return ((r = requestAnimationFrame(l)), () => cancelAnimationFrame(r));
    }, [e, t, a, s]),
    i
  );
}
function TypedText({ charMs: e, play: a, reduce: s, text: r }: { charMs: number; play: boolean; reduce: boolean; text: string }) {
  const i = useTypedCount(r.length, a, s, e);
  return <>{r.slice(0, i)}</>;
}
function SqlCode({ play: e, reduce: a }: { play: boolean; reduce: boolean }) {
  let s = useTypedCount(SQL_LENGTH, e, a, 6),
    r = 0;
  return (
    <code>
      {SQL_TOKENS.map((e, a) => {
        const i = r;
        r += e.text.length;
        const n = Math.max(0, Math.min(e.text.length, s - i));
        return n <= 0 ? null : (
          <span
            key={a}
            style={{
              color: e.color,
            }}
          >
            {e.text.slice(0, n)}
          </span>
        );
      })}
    </code>
  );
}
const STEPS = [
  {
    at: 450,
    step: 1,
  },
  {
    at: 700,
    step: 2,
  },
  {
    at: 1900,
    step: 3,
  },
  {
    at: 2100,
    step: 4,
  },
  {
    at: 2350,
    step: 5,
  },
];
export function ForecastChat() {
  const e = useRef<HTMLDivElement>(null),
    s = useRef<HTMLDivElement>(null),
    n = useResolvedReducedMotion(),
    l = useInView(e, {
      amount: 0.4,
      once: true,
    }),
    [d, x] = useState(1);
  useEffect(() => {
    const t = e.current,
      a = s.current;
    if (!t || !a) return;
    const r = () => {
      const e = t.clientWidth - 48,
        s = a.offsetWidth;
      s > 0 && x(Math.min(1, e / s));
    };
    r();
    const i = new ResizeObserver(r);
    return (i.observe(t), i.observe(a), () => i.disconnect());
  }, []);
  const [p, u] = useState(0);
  useEffect(() => {
    if (!l) return;
    if (n) return void u(5);
    const e = STEPS.map(({ at: e, step: t }) =>
      window.setTimeout(() => u(t), withTempo(e)),
    );
    return () => {
      for (const t of e) window.clearTimeout(t);
    };
  }, [l, n]);
  const g = (e: number) => ({
      animate:
        l || n
          ? {
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
            }
          : undefined,
      initial: !n && {
        filter: `blur(${BLUR_ENTRANCE}px)`,
        opacity: 0,
        y: 16,
      },
      transition: {
        delay: withTempo(e),
        duration: withTempo(0.8),
        ease: EASE,
      },
    }),
    h = (e: boolean) => ({
      animate:
        n || e
          ? {
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
            }
          : undefined,
      initial: !n && {
        filter: `blur(${BLUR_CARD}px)`,
        opacity: 0,
        y: 8,
      },
      transition: {
        duration: withTempo(0.5),
        ease: EASE,
      },
    });
  return (
    <div
      ref={e}
      aria-hidden="true"
      className="relative h-[327px] w-full overflow-hidden bg-surface-subtle lg:h-[654px]"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-surface-subtle" />
      <div
        ref={s}
        className="absolute top-1/2 left-1/2 h-[327px] w-[522px] [-webkit-mask-image:linear-gradient(to_bottom,#000_78%,transparent_87%)] [mask-image:linear-gradient(to_bottom,#000_78%,transparent_87%)] lg:h-[654px] lg:w-[1044px] lg:[-webkit-mask-image:linear-gradient(to_bottom,#000_69%,transparent_87%)] lg:[mask-image:linear-gradient(to_bottom,#000_69%,transparent_87%)]"
        style={{
          transform: `translate(-50%, -50%) scale(${d})`,
          transformOrigin: "center",
        }}
      >
        <motion.div
          className="absolute top-[28px] right-[24px] lg:top-[56px] lg:right-[48px]"
          {...g(0)}
        >
          <div className="inline-flex items-center justify-center rounded-[5px] bg-[#e6e7ea] p-[2.5px] shadow-[0px_0px_1px_0px_rgba(28,40,64,0.18),0px_0.5px_1.5px_0px_rgba(0,0,0,0.04)] lg:rounded-[10px] lg:p-[5px] lg:shadow-joshuattio-product-e1">
            <div className="flex items-center px-[2.5px] py-[0.5px] lg:px-[5px] lg:py-px">
              <p className="whitespace-nowrap font-medium text-[#242629] text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                {"What is the estimate of this week’s closed-won deal value"}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="absolute top-[60px] left-[24px] w-[474px] rounded-t-[6px] shadow-[0px_0px_1px_0px_rgba(28,40,64,0.18),0px_0.5px_1.5px_0px_rgba(0,0,0,0.04)] lg:top-[120px] lg:left-[48px] lg:w-[948px] lg:rounded-t-[12px] lg:shadow-joshuattio-product-e1"
          {...g(0.28)}
        >
          <div className="overflow-hidden rounded-t-[6px] bg-white-100 lg:rounded-t-[12px]">
            <div className="flex flex-col gap-[6px] p-[12px] lg:gap-[12px] lg:p-[24px]">
              <motion.div
                className="flex h-[11px] items-center gap-[2px] px-[1px] lg:h-[22px] lg:gap-[4px] lg:px-[2px]"
                {...h(p >= 1)}
              >
                <span className="whitespace-nowrap font-medium text-[7px] text-[rgba(0,0,0,0.55)] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                  {"2 tools used"}
                </span>
                <span className="flex size-[7px] items-center justify-center lg:size-[14px]">
                  <Glyph
                    d={CHEVRON_DOWN}
                    viewBox="0 0 8 4.5"
                    className="h-[2.25px] w-[4px] text-[rgba(0,0,0,0.4)] lg:h-[4.5px] lg:w-[8px]"
                  />
                </span>
              </motion.div>
              <motion.div
                className="flex w-full flex-col px-[1px] py-[0.5px] lg:px-[2px] lg:py-px"
                {...h(p >= 2)}
              >
                <p className="min-h-[10px] w-full font-medium text-[7px] text-[rgba(0,0,0,0.55)] leading-[10px] tracking-[-0.07px] lg:min-h-[20px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]">
                  <TypedText
                    text="Let me query for deals that are either Closed-Won this week, or have an estimated close date this week."
                    play={p >= 2}
                    reduce={n}
                    charMs={13}
                  />
                </p>
              </motion.div>
              <motion.div
                className="flex h-[12px] max-w-[152px] items-center gap-[2px] rounded-[4px] border border-[#eeeff1] pr-[2.5px] pl-[3px] lg:h-[24px] lg:max-w-[304px] lg:gap-[4px] lg:rounded-[8px] lg:pr-[5px] lg:pl-[6px]"
                {...h(p >= 3)}
              >
                <span className="flex size-[7px] items-center justify-center lg:size-[14px]">
                  <Glyph
                    d="M3 0C4.10457 0 5 0.895431 5 2C5 3.10457 4.10457 4 3 4C1.89543 4 1 3.10457 1 2C1 0.895431 1.89543 0 3 0ZM3 1C2.44772 1 2 1.44772 2 2C2 2.55228 2.44772 3 3 3C3.55228 3 4 2.55228 4 2C4 1.44772 3.55228 1 3 1ZM9.5 0C10.6046 0 11.5 0.895431 11.5 2C11.5 3.10457 10.6046 4 9.5 4C8.39543 4 7.5 3.10457 7.5 2C7.5 0.895431 8.39543 0 9.5 0ZM9.5 1C8.94772 1 8.5 1.44772 8.5 2C8.5 2.55228 8.94772 3 9.5 3C10.0523 3 10.5 2.55228 10.5 2C10.5 1.44772 10.0523 1 9.5 1ZM3 6.5C4.10457 6.5 5 7.39543 5 8.5C5 9.60457 4.10457 10.5 3 10.5C1.89543 10.5 1 9.60457 1 8.5C1 7.39543 1.89543 6.5 3 6.5ZM3 7.5C2.44772 7.5 2 7.94772 2 8.5C2 9.05228 2.44772 9.5 3 9.5C3.55228 9.5 4 9.05228 4 8.5C4 7.94772 3.55228 7.5 3 7.5ZM9.5 6.5C10.6046 6.5 11.5 7.39543 11.5 8.5C11.5 9.60457 10.6046 10.5 9.5 10.5C8.39543 10.5 7.5 9.60457 7.5 8.5C7.5 7.39543 8.39543 6.5 9.5 6.5ZM9.5 7.5C8.94772 7.5 8.5 7.94772 8.5 8.5C8.5 9.05228 8.94772 9.5 9.5 9.5C10.0523 9.5 10.5 9.05228 10.5 8.5C10.5 7.94772 10.0523 7.5 9.5 7.5Z"
                    viewBox="0 0 12.328 10.5"
                    className="h-[5.25px] w-[6.16px] text-[rgba(0,0,0,0.55)] lg:h-[10.5px] lg:w-[12.33px]"
                  />
                </span>
                <span className="whitespace-nowrap font-medium text-[6px] leading-[8px] lg:text-[12px] lg:leading-[16px]">
                  <span className="text-[rgba(0,0,0,0.55)]">
                    {"Attributes searched:"}{" "}
                  </span>
                  <span className="text-[rgba(0,0,0,0.4)]">
                    {"19 results"}
                  </span>
                </span>
              </motion.div>
              <motion.div
                className="flex h-[12px] max-w-[152px] items-center gap-[2px] rounded-[4px] border border-[#eeeff1] pr-[2.5px] pl-[3px] lg:h-[24px] lg:max-w-[304px] lg:gap-[4px] lg:rounded-[8px] lg:pr-[5px] lg:pl-[6px]"
                {...h(p >= 4)}
              >
                <span className="flex size-[7px] items-center justify-center lg:size-[14px]">
                  <Glyph
                    d="M5.5 0C7.04266 0 8.41825 0.211688 9.42285 0.553223C9.92443 0.723772 10.366 0.937201 10.6973 1.20312C11.0265 1.46735 11.3036 1.83165 11.3037 2.30371V9.69629C11.3036 10.1684 11.0265 10.5326 10.6973 10.7969C10.366 11.0628 9.92443 11.2762 9.42285 11.4468C8.41825 11.7883 7.04266 12 5.5 12C3.95734 12 2.58175 11.7883 1.57715 11.4468C1.07557 11.2762 0.633986 11.0628 0.302734 10.7969C-0.0264881 10.5326 -0.303571 10.1684 -0.303711 9.69629V2.30371C-0.303571 1.83165 -0.0264881 1.46735 0.302734 1.20312C0.633986 0.937201 1.07557 0.723772 1.57715 0.553223C2.58175 0.211688 3.95734 0 5.5 0ZM0.696289 9.69629C0.696351 9.78248 0.745211 9.92322 0.927734 10.0697C1.11178 10.2174 1.40478 10.3691 1.79785 10.5029C2.5818 10.7696 3.78483 10.9701 5.5 10.9701C7.21517 10.9701 8.4182 10.7696 9.20215 10.5029C9.59522 10.3691 9.88822 10.2174 10.0723 10.0697C10.2548 9.92322 10.3036 9.78248 10.3037 9.69629V7.5293C10.0729 7.66 9.79933 7.77403 9.50195 7.87598C8.42655 8.24268 6.99996 8.46582 5.5 8.46582C4.00004 8.46582 2.57345 8.24268 1.49805 7.87598C1.20067 7.77403 0.927068 7.66 0.696289 7.5293V9.69629ZM0.696289 6.30371C0.696379 6.38985 0.745243 6.5305 0.927734 6.67676C1.11176 6.82435 1.40484 6.97681 1.79785 7.11035C2.58177 7.37702 3.7849 7.57617 5.5 7.57617C7.2151 7.57617 8.41823 7.37702 9.20215 7.11035C9.59516 6.97681 9.88824 6.82435 10.0723 6.67676C10.2548 6.5305 10.3036 6.38985 10.3037 6.30371V4.13672C10.0729 4.26742 9.79933 4.38145 9.50195 4.4834C8.42655 4.8501 6.99996 5.07324 5.5 5.07324C4.00004 5.07324 2.57345 4.8501 1.49805 4.4834C1.20067 4.38145 0.927068 4.26742 0.696289 4.13672V6.30371ZM5.5 1.0299C3.78483 1.0299 2.5818 1.23036 1.79785 1.49707C1.40478 1.63087 1.11178 1.78262 0.927734 1.93027C0.745211 2.07679 0.696351 2.21753 0.696289 2.30371C0.696351 2.38989 0.745211 2.53063 0.927734 2.67715C1.11178 2.8248 1.40478 2.97655 1.79785 3.11035C2.5818 3.37706 3.78483 3.57752 5.5 3.57752C7.21517 3.57752 8.4182 3.37706 9.20215 3.11035C9.59522 2.97655 9.88822 2.8248 10.0723 2.67715C10.2548 2.53063 10.3036 2.38989 10.3037 2.30371C10.3036 2.21753 10.2548 2.07679 10.0723 1.93027C9.88822 1.78262 9.59522 1.63087 9.20215 1.49707C8.4182 1.23036 7.21517 1.0299 5.5 1.0299Z"
                    viewBox="-0.5 0 11.5 12"
                    className="h-[6px] w-[5.5px] text-[rgba(0,0,0,0.55)] lg:h-[12px] lg:w-[11px]"
                  />
                </span>
                <span className="whitespace-nowrap font-medium text-[6px] leading-[8px] lg:text-[12px] lg:leading-[16px]">
                  <span className="text-[rgba(0,0,0,0.55)]">
                    {"SQL query executed:"}{" "}
                  </span>
                  <span className="text-[rgba(0,0,0,0.4)]">
                    {"1452 rows in 6.2s"}
                  </span>
                </span>
              </motion.div>
              <motion.div
                className="relative w-full overflow-hidden rounded-[6px] border border-[rgba(0,0,0,0.05)] bg-[#fbfbfb] lg:rounded-[12px]"
                {...h(p >= 5)}
              >
                <div className="flex h-[18px] items-start lg:h-[36px]">
                  <div className="flex flex-1 items-center gap-[2px] p-[5px] lg:gap-[4px] lg:p-[10px]">
                    <span className="px-[1px] font-medium text-[6px] text-[rgba(0,0,0,0.55)] leading-[8px] lg:px-[2px] lg:text-[12px] lg:leading-[16px]">
                      {"SQL"}
                    </span>
                  </div>
                  <div className="flex items-start justify-end px-[4px] pt-[4px] lg:px-[8px] lg:pt-[8px]">
                    <span className="flex size-[10px] items-center justify-center rounded-[3px] lg:size-[20px] lg:rounded-[6px]">
                      <Glyph
                        d="M8.50003 3.00003C9.19163 2.99999 9.74078 3.00009 10.1827 3.03617C10.6303 3.07274 11.0128 3.1491 11.3623 3.32718C11.9265 3.61476 12.3853 4.07357 12.6729 4.63773C12.851 4.98734 12.9273 5.36963 12.9639 5.81742C13 6.25937 13 6.80827 13 7.50003V9.1641C13 9.90862 13.0045 10.3799 12.8975 10.7784C12.6198 11.8119 11.8119 12.6197 10.7784 12.8975C10.3801 13.0045 9.90924 13 9.16507 13H7.50003C6.80841 13.0001 6.25931 13 5.81742 12.9639C5.36971 12.9273 4.9873 12.8509 4.63773 12.6729C4.07355 12.3853 3.61477 11.9265 3.32718 11.3623C3.14904 11.0127 3.07276 10.6304 3.03617 10.1827C3.00006 9.74071 3.00003 9.19179 3.00003 8.50003V7.02835C3.00004 6.11149 2.99363 5.53089 3.15531 5.04789C3.45424 4.15528 4.15527 3.45421 5.04788 3.15531C5.53084 2.99377 6.11166 3.00003 7.02835 3.00003H8.50003ZM7.02835 4.00003C6.03172 4.00004 5.65479 4.00674 5.36527 4.10355C4.7702 4.30282 4.30284 4.77021 4.10355 5.36527C4.00662 5.65483 4.00004 6.03137 4.00003 7.02835V8.50003C4.00003 9.20829 4.00025 9.70982 4.03226 10.1016C4.0638 10.4873 4.12349 10.7231 4.21781 10.9082C4.40955 11.2844 4.71562 11.5906 5.09183 11.7823C5.27691 11.8765 5.51284 11.9363 5.89847 11.9678C6.29022 11.9998 6.79192 12.0001 7.50003 12H9.16507C9.97328 12 10.2799 11.9957 10.5186 11.9317C11.2076 11.7465 11.7466 11.2077 11.9317 10.5186C11.9958 10.2798 12 9.97307 12 9.1641V7.50003C12 6.79173 11.9998 6.29027 11.9678 5.89847C11.9363 5.51271 11.8766 5.27694 11.7823 5.09183C11.5906 4.71564 11.2844 4.40955 10.9082 4.21781C10.7232 4.12352 10.4872 4.06379 10.1016 4.03226C9.70986 4.00028 9.20814 3.99999 8.50003 4.00003H7.02835ZM6.50003 3.40675e-05C6.94534 3.40398e-05 7.2268 -0.00132157 7.46976 0.0371434C7.96388 0.115481 8.41767 0.312996 8.79984 0.599643C9.027 0.77013 9.22993 0.973069 9.40042 1.20023C9.56581 1.42106 9.52054 1.73477 9.29984 1.90042C9.079 2.06576 8.76625 2.02054 8.60062 1.79984C8.48698 1.64844 8.35161 1.51409 8.20023 1.40042C7.94542 1.20924 7.64254 1.07672 7.31253 1.02445C7.16695 1.00145 6.98307 1.00003 6.50003 1.00003H4.02835C3.03148 1.00004 2.65482 1.00666 2.36527 1.10355C1.77024 1.30281 1.30286 1.77026 1.10355 2.36527C1.00667 2.65481 1.00004 3.03158 1.00003 4.02835V6.50003C1.00003 6.98296 1.00147 7.16697 1.02445 7.31253C1.07669 7.64241 1.20916 7.94532 1.40042 8.20023C1.51423 8.35179 1.64861 8.48711 1.79984 8.60062C2.02051 8.76623 2.06567 9.079 1.90042 9.29984C1.73478 9.52058 1.42108 9.56583 1.20023 9.40042C0.972883 9.2298 0.770979 9.02684 0.600619 8.79984C0.313868 8.41768 0.115529 7.9642 0.0371426 7.46976C-0.00130344 7.22682 3.14354e-05 6.94528 3.32571e-05 6.50003V4.02835C3.4914e-05 3.11162 -0.00630758 2.53085 0.155307 2.04789C0.454254 1.15533 1.15531 0.454206 2.04788 0.155308C2.53087 -0.00632032 3.11154 3.24745e-05 4.02835 3.40675e-05H6.50003Z"
                        viewBox="0 0 13 13"
                        className="size-[7px] text-[rgba(0,0,0,0.4)] lg:size-[14px]"
                      />
                    </span>
                  </div>
                </div>
                <div className="px-[6px] pb-[6px] lg:px-[12px] lg:pb-[12px]">
                  <pre className="min-h-[120px] overflow-hidden whitespace-pre font-light font-mono text-[6.5px] leading-[10px] tracking-[-0.065px] lg:min-h-[240px] lg:text-[13px] lg:leading-[20px] lg:tracking-[-0.13px]">
                    <SqlCode play={p >= 5} reduce={n} />
                  </pre>
                </div>
                <div className="pointer-events-none absolute bottom-[4px] left-1/2 -translate-x-1/2 lg:bottom-[8px]">
                  <span className="flex h-[10px] items-center justify-center gap-[1.5px] rounded-[3px] bg-white-100 px-[2px] shadow-[0px_0px_1px_0px_rgba(28,40,64,0.18),0px_0.5px_1.5px_0px_rgba(0,0,0,0.04)] lg:h-[20px] lg:gap-[3px] lg:rounded-[6px] lg:px-[4px] lg:shadow-joshuattio-product-e1">
                    <span className="px-[0.5px] font-medium text-[#242629] text-[6px] leading-[8px] lg:px-px lg:text-[12px] lg:leading-[16px]">
                      {"Show all"}
                    </span>
                    <Glyph
                      d={CHEVRON_DOWN}
                      viewBox="0 0 8 4.5"
                      className="h-[2px] w-[3.5px] text-[#242629] lg:h-[4px] lg:w-[7px]"
                    />
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
