"use client";

import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, type MotionProps } from "motion/react";
import { BLUR_CARD, BLUR_ENTRANCE, EASE_UI, STREAM_MS_PER_CHAR, cn, useResolvedReducedMotion, withTempo } from "./rs-motion";

const EASE = EASE_UI,
  BLUE = "#266df0",
  GREEN = "#54d490",
  AMBER = "#f5a300",
  RED = "#ff5454",
  INK = "#242629",
  MUTED = "rgba(0,0,0,0.55)";
function ChartCard({ children: e, className: a }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("rounded-[12px] bg-white-100", a)}
      style={{
        boxShadow:
          "0 0 1px 1px rgba(0,22,62,0.01), 0 4px 12px -1px rgba(0,22,62,0.04), 0 1px 3px -1px rgba(0,22,62,0.18)",
      }}
    >
      {e}
    </div>
  );
}
function InfoIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="size-[12px] shrink-0"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="6"
        cy="6"
        r="5.25"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="1"
      />
      <circle cx="6" cy="3.6" r="0.7" fill="rgba(0,0,0,0.45)" />
      <rect
        x="5.4"
        y="5.2"
        width="1.2"
        height="3.4"
        rx="0.6"
        fill="rgba(0,0,0,0.45)"
      />
    </svg>
  );
}
function DotsIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      className="size-[14px] shrink-0"
      fill="rgba(0,0,0,0.4)"
      aria-hidden="true"
    >
      <circle cx="7" cy="3" r="1.1" />
      <circle cx="7" cy="7" r="1.1" />
      <circle cx="7" cy="11" r="1.1" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 8 5"
      className="h-[4.5px] w-[8px] shrink-0"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0.75 0.75L4 4L7.25 0.75"
        stroke="rgba(0,0,0,0.45)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CompanyIcon() {
  return (
    <span className="flex size-[24px] shrink-0 items-center justify-center rounded-[4.8px] border-[1.5px] border-[rgba(0,0,0,0.05)] bg-[#f8f9fa]">
      <svg
        viewBox="0 0 14 14"
        className="size-[12px]"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="2.5"
          y="2"
          width="9"
          height="10"
          rx="1"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="1"
        />
        <path
          d="M4.6 4.5h1M8.4 4.5h1M4.6 6.6h1M8.4 6.6h1M4.6 8.7h1M8.4 8.7h1M6.3 11.5v-1.4h1.4v1.4"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
function LegendDot({ color: e }: { color: string }) {
  return (
    <span
      className="size-[8px] shrink-0 rounded-full"
      style={{
        backgroundColor: e,
      }}
      aria-hidden="true"
    />
  );
}
function Caret() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-block h-0 w-0 overflow-visible align-baseline"
    >
      <motion.span
        className="absolute bottom-[-0.05em] left-px block h-[0.9em] w-[1.5px] bg-[#266df0]"
        animate={{
          opacity: [1, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
        }}
      />
    </span>
  );
}
const QUARTERS = ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2"],
  US_SERIES = [0.34, 0.4, 0.46, 0.55, 0.74, 0.86],
  EMEA_SERIES = [0.28, 0.3, 0.33, 0.36, 0.66, 0.62];
function linePath(e: number[]) {
  let t = 504 / (e.length - 1),
    a = e.map((e, a) => ({
      x: 0 + a * t,
      y: 50 - 44 * e,
    })),
    s = `M ${a[0].x.toFixed(2)} ${a[0].y.toFixed(2)}`;
  for (let e = 0; e < a.length - 1; e++) {
    const t = a[e - 1] ?? a[e],
      r = a[e],
      i = a[e + 1],
      n = a[e + 2] ?? i,
      l = r.x + (i.x - t.x) / 6,
      o = r.y + (i.y - t.y) / 6,
      d = i.x - (n.x - r.x) / 6,
      c = i.y - (n.y - r.y) / 6;
    s += ` C ${l.toFixed(2)} ${o.toFixed(2)}, ${d.toFixed(2)} ${c.toFixed(2)}, ${i.x.toFixed(2)} ${i.y.toFixed(2)}`;
  }
  return s;
}
function areaPath(e: number[]) {
  return `${linePath(e)} L 504.00 56 L 0.00 56 Z`;
}
function BookSizeChart({ draw: e, instant: s }: { draw: boolean; instant: boolean }) {
  return (
    <div className="w-full px-[16px]">
      <div className="flex w-full gap-[6px]">
        <div className="flex h-[56px] w-[26px] shrink-0 flex-col justify-between py-[2px] text-[#9fa1a7] text-[10px] leading-[13px]">
          <span>{"1.4m"}</span>
          <span>{"0.7m"}</span>
          <span>{"0.0m"}</span>
        </div>
        <svg
          viewBox="0 0 512 56"
          className="h-[56px] min-w-0 flex-1"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="retain-us-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BLUE} stopOpacity="0.14" />
              <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="retain-emea-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity="0.16" />
              <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
            </linearGradient>
            <clipPath id="retain-line-clip">
              <motion.rect
                x="0"
                y="0"
                height={56}
                initial={
                  !s && {
                    width: 0,
                  }
                }
                animate={{
                  width: e || s ? 512 : 0,
                }}
                transition={{
                  duration: s ? 0 : withTempo(0.9),
                  ease: EASE,
                }}
              />
            </clipPath>
          </defs>
          {[6, 28, 50].map((e) => (
            <line
              key={e}
              x1={0}
              y1={e}
              x2={504}
              y2={e}
              stroke="#eeeff1"
              strokeWidth="1"
              strokeDasharray={28 === e ? "3 3" : undefined}
            />
          ))}
          <g clipPath="url(#retain-line-clip)">
            <path d={areaPath(EMEA_SERIES)} fill="url(#retain-emea-fill)" />
            <path d={areaPath(US_SERIES)} fill="url(#retain-us-fill)" />
            <path
              d={linePath(EMEA_SERIES)}
              fill="none"
              stroke={GREEN}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={linePath(US_SERIES)}
              fill="none"
              stroke={BLUE}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      </div>
      <div className="flex pt-[4px] pl-[32px]">
        {QUARTERS.map((e, a) => (
          <span
            key={`${e}-${a}`}
            className="flex-1 text-center text-[#75777c] text-[10px] leading-[13px]"
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}
const HEALTH = [
    {
      atRisk: 22,
      healthy: 45,
      month: "Jan",
      watch: 18,
    },
    {
      atRisk: 14,
      healthy: 49,
      month: "Feb",
      watch: 20,
    },
    {
      atRisk: 10,
      healthy: 49,
      month: "Mar",
      watch: 14,
    },
    {
      atRisk: 4,
      healthy: 60,
      month: "Apr",
      watch: 6,
    },
    {
      atRisk: 4,
      healthy: 80,
      month: "May",
      watch: 4,
    },
  ],
  HEALTH_TICKS = [0, 20, 40, 60, 80, 100];
function HealthChart({ draw: e, instant: s }: { draw: boolean; instant: boolean }) {
  const r = (e: number) => 230 - (e / 100) * 230;
  return (
    <div className="flex min-h-0 w-full flex-1 gap-[12px]">
      <div className="flex w-[20px] shrink-0 items-center justify-center">
        <span className="-rotate-90 whitespace-nowrap font-medium text-[#242629] text-[12px] leading-[16px]">
          {"Count"}
        </span>
      </div>
      <div className="flex h-full w-[24px] shrink-0 flex-col justify-between py-[2px] text-right font-medium text-[#242629] text-[12px] leading-[16px]">
        {[...HEALTH_TICKS].reverse().map((e) => (
          <span key={e}>{e}</span>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative min-h-0 flex-1">
          <svg
            viewBox="0 0 449 230"
            className="h-full w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {HEALTH_TICKS.map((e) => (
              <line
                key={e}
                x1="0"
                x2="449"
                y1={r(e)}
                y2={r(e)}
                stroke="var(--color-white-500)"
                strokeWidth="1"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {HEALTH.map((n, l) => {
              const o = 449 / HEALTH.length,
                d = o * l + o / 2 - 29,
                c = n.healthy + n.watch + n.atRisk,
                x = (n.healthy / 100) * 230,
                p = (n.watch / 100) * 230,
                u = (n.atRisk / 100) * 230,
                g = r(c),
                h = `retain-bar-clip-${l}`;
              return (
                <g key={n.month}>
                  <defs>
                    <clipPath id={h}>
                      <motion.rect
                        x={d}
                        width={58}
                        initial={
                          !s && {
                            height: 0,
                            y: 230,
                          }
                        }
                        animate={{
                          height: e || s ? 230 - g : 0,
                          y: e || s ? g : 230,
                        }}
                        transition={{
                          delay: s ? 0 : withTempo(0.05 * l),
                          duration: withTempo(0.55),
                          ease: EASE,
                        }}
                      />
                    </clipPath>
                  </defs>
                  <g clipPath={`url(#${h})`}>
                    <path
                      d={`M ${d} ${g + x}
                                         L ${d} ${g + 4}
                                         Q ${d} ${g} ${d + 4} ${g}
                                         L ${d + 58 - 4} ${g}
                                         Q ${d + 58} ${g} ${d + 58} ${g + 4}
                                         L ${d + 58} ${g + x} Z`}
                      fill={BLUE}
                    />
                    <rect x={d} y={g + x} width={58} height={p} fill={AMBER} />
                    <rect
                      x={d}
                      y={g + x + p}
                      width={58}
                      height={u}
                      fill={RED}
                    />
                    <rect
                      x={d}
                      y={g + x - 1}
                      width={58}
                      height={2}
                      fill="var(--color-white-100)"
                    />
                    <rect
                      x={d}
                      y={g + x + p - 1}
                      width={58}
                      height={2}
                      fill="var(--color-white-100)"
                    />
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="flex pt-[8px]">
          {HEALTH.map((e) => (
            <span
              key={e.month}
              className="flex-1 text-center font-medium text-[#242629] text-[12px] leading-[16px]"
            >
              {e.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
type Account = { action: string; actionLead: string; name: string; rank: number; riskSignals: string; tier: string; value: string };
const ACCOUNTS: Account[] = [
    {
      action:
        "Reach out today to fix the card on file, and check whether the usage drop signals broader churn",
      actionLead: "Action: ",
      name: "Brightloop",
      rank: 1,
      riskSignals:
        "Last two invoices failed in Stripe (card declined). Logins down 40% over 30 days.",
      tier: " Named T0",
      value: "$107,000",
    },
    {
      action:
        "Confirm renewal intent and clear the past-due balance before June 30.",
      actionLead: "Action: ",
      name: "Vela",
      rank: 2,
      riskSignals:
        "Subscription past due. Renews June 30 - two weeks out, no renewal call booked.",
      tier: " Named T1",
      value: "$86,000",
    },
  ],
  INTRO =
    "Here are the top 5 accounts at risk that CS should prioritize this week:",
  MS_PER_CHAR = STREAM_MS_PER_CHAR;
function accountParts(e: Account) {
  return {
    b1Body: e.riskSignals,
    b1Lead: "Risk Signals: ",
    b2: [
      ["CSM Tier:", INK],
      [e.tier, MUTED],
      [" - ", MUTED],
      [e.actionLead, INK],
      [e.action, MUTED],
    ] as Array<[string, string]>,
    chipName: e.name,
    headMain: `${e.rank}. ${e.name} - ${e.value} ARR `,
    headTail: " High",
  };
}
const ACCOUNT_STARTS: number[] = [],
  TOTAL_CHARS = (() => {
    let e = INTRO.length;
    for (const t of ACCOUNTS) {
      ACCOUNT_STARTS.push(e);
      const a = accountParts(t);
      for (const [t] of ((e += a.headMain.length + 5 + a.headTail.length),
      (e += 12 + a.chipName.length),
      (e += a.b1Lead.length + a.b1Body.length),
      a.b2))
        e += t.length;
    }
    return e;
  })(),
  TEXT_14 = "font-medium text-[14px] leading-[20px] tracking-[-0.14px]";
function typer(e: number, a: boolean, s: number) {
  let r = s;
  return {
    pos: () => r,
    seg: (s: string, i: string) => {
      const n = r;
      r += s.length;
      const l = a ? s.length : Math.max(0, Math.min(s.length, e - n)),
        o = !a && e >= n && e < r;
      return (
        <span
          style={{
            color: i,
          }}
        >
          {s.slice(0, l)}
          {o && <Caret />}
        </span>
      );
    },
    skip: (e: number) => {
      r += e;
    },
  };
}
const AccountBlock = memo(function AccountBlock({ account: e, instant: a, start: s, typed: r }: { account: Account; instant: boolean; start: number; typed: number }) {
  const i = accountParts(e),
    { pos: n, seg: l, skip: o } = typer(r, a, s),
    d = n(),
    c = l(i.headMain, INK),
    x = n();
  o(5);
  const p = l(i.headTail, INK),
    u = (
      <p
        className={TEXT_14}
        style={{
          opacity: +(!!a || r >= d),
          transition: "opacity 0.2s",
        }}
      >
        {c}
        <span
          className="mx-[2px] inline-block size-[10px] translate-y-[1px] rounded-full transition-opacity duration-200"
          style={{
            backgroundColor: RED,
            opacity: +(!!a || r >= x),
          }}
        />
        {p}
      </p>
    ),
    g = n();
  o(12);
  const h = l(i.chipName, INK),
    m = (
      <div
        className="flex w-[454px] items-center gap-[8.8px] rounded-[12px] bg-white-100 px-[8px] py-[6px] shadow-joshuattio-product-e1 transition-opacity duration-200"
        style={{
          opacity: +(!!a || r >= g),
        }}
      >
        <CompanyIcon />
        <p className={TEXT_14}>{h}</p>
      </div>
    ),
    C = n(),
    f = (
      <li
        style={{
          opacity: +(!!a || r >= C),
          transition: "opacity 0.2s",
        }}
      >
        {l(i.b1Lead, INK)}
        {l(i.b1Body, MUTED)}
      </li>
    ),
    y = n(),
    b = (
      <li
        style={{
          opacity: +(!!a || r >= y),
          transition: "opacity 0.2s",
        }}
      >
        {i.b2.map(([e, a]) => (
          <span key={e}>{l(e, a)}</span>
        ))}
      </li>
    );
  return (
    <div className="flex flex-col gap-[6px]">
      {u}
      {m}
      <ul
        className={cn(
          TEXT_14,
          "flex w-[454px] list-disc flex-col gap-[2px] pl-[20px]",
        )}
      >
        {f}
        {b}
      </ul>
    </div>
  );
});
function AgentAnswer({ typed: e, instant: a }: { typed: number; instant: boolean }) {
  const { seg: s } = typer(e, a, 0);
  return (
    <>
      <p
        className={cn(TEXT_14, "px-[2px]")}
        style={{
          color: MUTED,
        }}
      >
        {s(INTRO, MUTED)}
      </p>
      {ACCOUNTS.map((s, r) => {
        const i = ACCOUNT_STARTS[r],
          n = ACCOUNT_STARTS[r + 1] ?? TOTAL_CHARS;
        return (
          <AccountBlock
            key={s.name}
            account={s}
            instant={a}
            start={i}
            typed={Math.min(n, Math.max(i - 1, e))}
          />
        );
      })}
    </>
  );
}
function AgentPanel({ enter: e, step: s, instant: n }: { enter: (delay: number) => MotionProps; step: number; instant: boolean }) {
  let l: boolean,
    o = s >= 2,
    [d, c] = useState(0);
  return (
    useEffect(() => {
      if (n) return void c(TOTAL_CHARS);
      if (!o) return void c(0);
      let e = 0,
        t = 0,
        a = (s: number) => {
          const r = Math.min(TOTAL_CHARS, Math.floor((s - t) / MS_PER_CHAR));
          (c(r), r < TOTAL_CHARS && (e = requestAnimationFrame(a)));
        };
      return (
        (t = performance.now()),
        (e = requestAnimationFrame(a)),
        () => cancelAnimationFrame(e)
      );
    }, [o, n]),
    (
      <motion.div {...e(0.18)}>
        <ChartCard className="flex h-[538px] w-[486px] flex-col gap-[16px] overflow-hidden p-[16px]">
          <motion.div
            className="flex items-center gap-[4px] px-[2px]"
            {...((l = s >= 1),
            {
              animate:
                n || l
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
            })}
          >
            <span
              className="font-medium text-[14px] leading-[20px] tracking-[-0.14px]"
              style={{
                color: MUTED,
              }}
            >
              {"2 tools used"}
            </span>
            <ChevronIcon />
          </motion.div>
          <AgentAnswer typed={d} instant={n} />
        </ChartCard>
      </motion.div>
    )
  );
}
export function RetainBoard() {
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
      const e = a.offsetWidth;
      e > 0 && x(t.clientWidth / e);
    };
    r();
    const i = new ResizeObserver(r);
    return (i.observe(t), i.observe(a), () => i.disconnect());
  }, []);
  const [p, u] = useState(false),
    [g, h] = useState(false),
    [m, C] = useState(0);
  useEffect(() => {
    if (!l) return;
    if (n) {
      (u(true), h(true), C(2));
      return;
    }
    const e = [
      window.setTimeout(() => u(true), withTempo(650)),
      window.setTimeout(() => h(true), withTempo(850)),
      window.setTimeout(() => C(1), withTempo(600)),
      window.setTimeout(() => C(2), withTempo(850)),
    ];
    return () => {
      for (const t of e) window.clearTimeout(t);
    };
  }, [l, n]);
  const f = (e: number): MotionProps => ({
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
      y: 14,
    },
    transition: {
      delay: n ? 0 : withTempo(e),
      duration: withTempo(0.7),
      ease: EASE,
    },
  });
  return (
    <div
      ref={e}
      aria-hidden="true"
      className="relative aspect-[1044/654] w-full overflow-hidden bg-surface-subtle"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-surface-subtle" />
      <div
        ref={s}
        className="absolute top-0 left-0 h-[654px] w-[1044px] origin-top-left"
        style={{
          transform: `scale(${d})`,
        }}
      >
        <motion.div className="absolute top-[57.5px] left-[57.5px]" {...f(0)}>
          <ChartCard className="flex h-[159px] w-[569px] flex-col overflow-hidden">
            <div className="flex items-center justify-between pt-[12px] pr-[6px] pl-[16px]">
              <div className="flex items-center gap-[8px]">
                <p
                  className="font-medium text-[14px] leading-[20px] tracking-[-0.14px]"
                  style={{
                    color: INK,
                  }}
                >
                  {"Book Size - ARR"}
                </p>
                <InfoIcon />
              </div>
              <span className="flex size-[28px] items-center justify-center rounded-[8px]">
                <DotsIcon />
              </span>
            </div>
            <div className="flex items-center gap-[14px] px-[16px] pt-[6px]">
              <span className="flex items-center gap-[8px]">
                <LegendDot color={BLUE} />
                <span className="font-medium text-[#75777c] text-[12px] leading-[16px]">
                  {"US"}
                </span>
              </span>
              <span className="flex items-center gap-[8px]">
                <LegendDot color={GREEN} />
                <span className="font-medium text-[#75777c] text-[12px] leading-[16px]">
                  {"EMEA"}
                </span>
              </span>
            </div>
            <div className="mt-[8px] flex flex-1 flex-col justify-end pb-[4px]">
              <BookSizeChart draw={p} instant={n} />
            </div>
          </ChartCard>
        </motion.div>
        <motion.div
          className="absolute top-[240.5px] left-[57.5px]"
          {...f(0.12)}
        >
          <ChartCard className="flex h-[355px] w-[569px] flex-col">
            <div className="flex items-center justify-between pt-[12px] pr-[6px] pl-[16px]">
              <div className="flex items-center gap-[8px]">
                <p
                  className="font-medium text-[14px] leading-[20px] tracking-[-0.14px]"
                  style={{
                    color: INK,
                  }}
                >
                  {"Account Health"}
                </p>
                <InfoIcon />
              </div>
              <span className="flex size-[28px] items-center justify-center rounded-[8px]">
                <DotsIcon />
              </span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-[24px] p-[24px]">
              <div className="flex items-center justify-center gap-[20px]">
                {[
                  {
                    color: BLUE,
                    label: "Healthy",
                  },
                  {
                    color: AMBER,
                    label: "Watch",
                  },
                  {
                    color: RED,
                    label: "At risk",
                  },
                ].map((e) => (
                  <span key={e.label} className="flex items-center gap-[6px]">
                    <span
                      className="size-[10px] shrink-0 rounded-[4px]"
                      style={{
                        backgroundColor: e.color,
                      }}
                    />
                    <span
                      className="font-medium text-[14px] leading-[20px] tracking-[-0.28px]"
                      style={{
                        color: MUTED,
                      }}
                    >
                      {e.label}
                    </span>
                  </span>
                ))}
              </div>
              <HealthChart draw={g} instant={n} />
            </div>
          </ChartCard>
        </motion.div>
        <div className="absolute top-[57.5px] left-[651px]">
          <AgentPanel enter={f} step={m} instant={n} />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-[174px] bg-gradient-to-l from-white-300 to-transparent"
        />
      </div>
    </div>
  );
}
