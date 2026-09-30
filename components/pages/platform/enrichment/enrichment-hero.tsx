"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from "react";
import { motion, useInView } from "motion/react";
import { SignalRays } from "@/components/shell/signal-rays";
import { CHAT, CHECK_SQUARE, CLOCK, DOC, DOLLAR, PERSON, PLUS, type Icon } from "./enrichment-icons";

// Enrichment hero: a four column pipeline board. Cards start as skeletons, each
// attribute flips through "Enriching..." into its value on a fixed schedule, then
// two cards travel to the next column. The stripe glow runs while enrichment is live.

type Ease = [number, number, number, number];
const EASE_OUT_CUBIC: Ease = [0.33, 1, 0.68, 1];
const EASE_IN_OUT_CUBIC: Ease = [0.65, 0, 0.35, 1];

const LABEL = "truncate font-medium text-[13px] leading-4.5 tracking-[-0.13px]";
const ICON_COLOR = "var(--color-black-700)";
const MUTED = "var(--color-black-600)";

type Card = { company: string; days: string; funding: string; headcount: string; location: string; revenue: string };
type Column = { cards: Card[]; dotColor: string; title: string };

const CORVINA: Card = { company: "Corvina Labs", days: "3h", funding: "$42M Series B", headcount: "120 employees", location: "Austin, TX", revenue: "$18M revenue" };
const NEW_LEADS: Column = {
  cards: [
    { company: "Brightloop", days: "1d", funding: "$4.5M Seed", headcount: "24 employees", location: "Portland, OR", revenue: "$2.4M revenue" },
    { company: "Halyard", days: "2d", funding: "$11M Series A", headcount: "65 employees", location: "Chicago, IL", revenue: "$8M revenue" },
  ],
  dotColor: "oklch(0.706 0.186 48.7)",
  title: "New leads",
};
const UNQUALIFIED: Column = {
  cards: [
    { company: "Vantora", days: "4d", funding: "$18M Series A", headcount: "85 employees", location: "Berlin, DE", revenue: "$12M revenue" },
    { company: "Fieldstone", days: "6d", funding: "$7.5M Seed", headcount: "32 employees", location: "Toronto, CA", revenue: "$4M revenue" },
  ],
  dotColor: "var(--color-blue-500)",
  title: "Unqualified",
};
const QUALIFIED: Column = {
  cards: [
    { company: "Lumenware", days: "9d", funding: "$64M Series C", headcount: "340 employees", location: "London, UK", revenue: "$52M revenue" },
    { company: "Pinelock", days: "12d", funding: "$12M Series A", headcount: "72 employees", location: "Denver, CO", revenue: "$9M revenue" },
  ],
  dotColor: "oklch(0.65 0.215 295)",
  title: "Qualified",
};
const CONTACTED: Column = {
  cards: [
    { company: "Northpeak", days: "21d", funding: "$95M Series C", headcount: "520 employees", location: "New York, NY", revenue: "$86M revenue" },
    { company: "Seabright", days: "17d", funding: "$24M Series B", headcount: "150 employees", location: "Sydney, AU", revenue: "$21M revenue" },
  ],
  dotColor: "var(--color-green-500)",
  title: "Contacted",
};

const MOVES = [
  { card: CORVINA, source: 1, target: 2 },
  { card: NEW_LEADS.cards[0], source: 0, target: 1 },
];
const COLUMNS = [NEW_LEADS, UNQUALIFIED, QUALIFIED, CONTACTED];
const STAYING = [NEW_LEADS.cards.slice(1), UNQUALIFIED.cards, QUALIFIED.cards, CONTACTED.cards];
const ALL = [...NEW_LEADS.cards, CORVINA, ...UNQUALIFIED.cards, ...QUALIFIED.cards, ...CONTACTED.cards];
// Per card, the second at which each of its four attributes resolves.
const REVEAL = ALL.map((_, t) =>
  t === 2 ? [1.9, 2.9, 2.4, 3.5] : t === 0 ? [2.35, 3.75, 3.15, 4.55] : [0, 1, 2, 3].map((e) => 1.55 + ((7 * t + 11 * e) % 23) * 0.11 + 0.13 * e),
);
const MOVE_AT = MOVES.map(({ card }) => Math.max(...REVEAL[ALL.indexOf(card)]) + 0.32 + 0.65);
const LAND_AT = MOVE_AT.map((e) => e + 0.85);
const TICKS = [...new Set([0.85, ...REVEAL.flat(), ...MOVE_AT, ...LAND_AT])].sort((a, b) => a - b);

const enterDelay = (column: number, row: number) => 0.05 * column + 0.12 + 0.045 * row;

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function useMediaQuery(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

function Glyph({ className, icon, style }: { className: string; icon: Icon; style?: CSSProperties }) {
  return (
    <svg viewBox={icon.vb} fill="currentColor" aria-hidden="true" className={cn("block shrink-0", className)} style={style}>
      <path d={icon.d} />
    </svg>
  );
}

function CompanyGlyph() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="block shrink-0 size-3.5" style={{ color: ICON_COLOR }}>
      <path d="M1.5 3.95v4.096c0 1.122 0 1.682.218 2.11a2 2 0 0 0 .874.874c.428.218.988.218 2.108.218h2.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874c.218-.428.218-.988.218-2.108v-4.1c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C8.98.748 8.42.748 7.3.748H4.7c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874c-.218.428-.218.988-.218 2.11h0Z M3.5 3.197h3.4 M5.1 5.648h3.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.285 11.012V9.288c0-.42 0-.63-.081-.79a.75.75 0 0 0-.328-.328c-.16-.082-.37-.082-.791-.082h-.17c-.421 0-.631 0-.792.082a.75.75 0 0 0-.327.328c-.082.16-.082.37-.082.79v1.724" stroke="currentColor" strokeLinejoin="round" />
    </svg>
  );
}

function PinGlyph() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className="block shrink-0 size-3.5" style={{ color: ICON_COLOR }}>
      <path d="M12 6.143C12 9.84 8.928 13 7 13S2 9.84 2 6.143C2 3.303 4.239 1 7 1s5 2.303 5 5.143Z" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="7" cy="6" r="1.75" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function Row({ children, className, icon }: { children: ReactNode; className?: string; icon: ReactNode }) {
  return (
    <div className={cn("flex h-7 min-w-0 items-center gap-2", className)}>
      {icon}
      {children}
    </div>
  );
}

function Value({ children }: { children: ReactNode }) {
  return (
    <span className={cn("min-w-0", LABEL)} style={{ color: "var(--color-black-100)" }}>
      {children}
    </span>
  );
}

function Enriching({ active }: { active: boolean }) {
  return (
    <motion.span
      className={cn("bg-clip-text text-transparent", LABEL)}
      style={{
        backgroundImage: "linear-gradient(131.88deg, oklch(0.735 0.097 359) 0%, var(--color-blue-400) 50%, oklch(0.735 0.097 359) 100%)",
        WebkitBackgroundClip: "text",
      }}
      initial={false}
      animate={{ opacity: active ? [0.55, 1, 0.55] : 0 }}
      transition={{ duration: 1.4, ease: "easeInOut", repeat: active ? Infinity : 0 }}
    >
      {"Enriching..."}
    </motion.span>
  );
}

function Swap({ from, revealed, thinking, to }: { from: ReactNode; revealed: boolean; thinking: boolean; to: ReactNode }) {
  const idle = !thinking && !revealed;
  const x = thinking ? 0 : revealed ? -4 : 4;
  return (
    <div className="relative flex h-full min-w-0 flex-1 items-center">
      <motion.div
        className="absolute inset-0 flex min-w-0 items-center"
        initial={false}
        data-skeleton-active={idle}
        animate={{ opacity: idle ? 1 : 0, x: idle ? 0 : -4 }}
        transition={{ duration: 0.22399999999999998, ease: "easeOut" }}
      >
        {from}
      </motion.div>
      <motion.div className="absolute inset-0 flex min-w-0 items-center" initial={false} animate={{ opacity: thinking ? 1 : 0, x }} transition={{ duration: 0.272, ease: EASE_OUT_CUBIC }}>
        <Enriching active={thinking} />
      </motion.div>
      <motion.div className="relative flex min-w-0 flex-1 items-center" initial={false} animate={{ opacity: revealed ? 1 : 0, x: revealed ? 0 : 4 }} transition={{ duration: 0.32, ease: EASE_OUT_CUBIC }}>
        {to}
      </motion.div>
    </div>
  );
}

function FooterIcon({ icon }: { icon: Icon }) {
  return (
    <div className="flex h-6 min-w-6 items-center justify-center rounded-[7px] px-1.5">
      <Glyph icon={icon} className="size-3" style={{ color: MUTED }} />
    </div>
  );
}

const FIELDS: { className?: string; icon: Icon; key: "location" | "revenue" | "headcount" | "funding"; width: string }[] = [
  { icon: DOLLAR, key: "location", width: "72%" },
  { className: "max-md:hidden", icon: DOLLAR, key: "revenue", width: "58%" },
  { icon: PERSON, key: "headcount", width: "64%" },
  { icon: DOLLAR, key: "funding", width: "48%" },
];

function RecordCard({ card, progress }: { card: Card; progress?: { revealed: boolean[]; thinking: number | undefined } }) {
  return (
    <div className="flex w-full flex-col rounded-[10px] border bg-white-100 pt-1.25 max-md:pb-1.25" style={{ borderColor: "color-mix(in oklab, var(--color-black-0) 6%, transparent)" }}>
      <div className="flex flex-col pr-1.5 pl-2.5">
        <Row icon={<CompanyGlyph />}>
          <Value>{card.company}</Value>
        </Row>
        {FIELDS.map((f, i) => (
          <Row key={f.key} className={f.className} icon={f.key === "location" ? <PinGlyph /> : <Glyph icon={f.icon} className="size-3.5" style={{ color: ICON_COLOR }} />}>
            {progress ? (
              <Swap
                revealed={progress.revealed[i]}
                thinking={progress.thinking === i}
                from={<span className="card-module__xLmF0q__skeleton" style={{ width: f.width }} />}
                to={<Value>{card[f.key]}</Value>}
              />
            ) : (
              <Value>{card[f.key]}</Value>
            )}
          </Row>
        ))}
      </div>
      <div className="flex h-8 w-full items-center justify-between px-1 max-md:hidden">
        <div className="flex items-center gap-0.5">
          <FooterIcon icon={DOC} />
          <FooterIcon icon={CHECK_SQUARE} />
          <FooterIcon icon={CHAT} />
        </div>
        <div className="flex h-6 items-center gap-1 rounded-[5px] px-1.5">
          <Glyph icon={CLOCK} className="size-2.5" style={{ color: ICON_COLOR }} />
          <span className="font-medium text-[11px] leading-3.5" style={{ color: ICON_COLOR }}>
            {card.days}
          </span>
        </div>
      </div>
    </div>
  );
}

function BoardColumn({ active, children, count, dotColor, index, instant, title }: { active: boolean; children: ReactNode; count: number; dotColor: string; index: number; instant?: boolean; title: string }) {
  return (
    <motion.div
      className="flex h-full min-w-0 max-w-75 flex-1 flex-col rounded-t-[12px] bg-secondary-background px-1.5 pt-1.5 max-md:last:hidden max-md:first:hidden"
      initial={!instant && { opacity: 0, y: 14 }}
      animate={instant || active ? { opacity: 1, y: 0 } : undefined}
      transition={{ delay: instant ? 0 : 0.05 * index, duration: 0.5 * Number(!instant), ease: EASE_OUT_CUBIC }}
    >
      <div className="flex h-9 shrink-0 items-center gap-1.5 px-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: dotColor }} />
          <span className="font-semibold text-[13px] leading-4.5 tracking-[-0.26px] max-lg:text-xs lg:truncate" style={{ color: "var(--color-black-100)" }}>
            {title}
          </span>
          <span
            className="flex h-4 min-w-4 items-center justify-center rounded-[5px] border px-1 font-medium text-[11px] leading-3.5"
            style={{
              backgroundColor: "color-mix(in oklab, var(--color-black-0) 4%, transparent)",
              borderColor: "color-mix(in oklab, var(--color-black-0) 6%, transparent)",
              color: MUTED,
            }}
          >
            {count}
          </span>
        </div>
        <div className="hidden size-5 items-center justify-center rounded-[6px] lg:flex">
          <Glyph icon={PLUS} className="size-3.5" style={{ color: MUTED }} />
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 pt-1.5">{children}</div>
    </motion.div>
  );
}

function BoardFrame({ children, ref }: { children: ReactNode; ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} aria-hidden="true" className="flex h-full w-full justify-center">
      <div className="flex h-full w-full max-w-320 gap-2 px-2 md:gap-2.5 md:px-5 md:max-lg:min-w-175 lg:gap-4 lg:px-8">{children}</div>
    </div>
  );
}

function StaticBoard({ mobile }: { mobile: boolean }) {
  return (
    <BoardFrame>
      {COLUMNS.map((col, r) => {
        const cards = [...MOVES.filter(({ target }, t) => target === r && (!mobile || t === 0)).map(({ card }) => card), ...STAYING[r]];
        return (
          <BoardColumn key={col.title} active={false} count={cards.length} dotColor={col.dotColor} index={r} instant title={col.title}>
            {cards.map((c) => (
              <RecordCard key={c.company} card={c} />
            ))}
          </BoardColumn>
        );
      })}
    </BoardFrame>
  );
}

function TimedCard({ card, time }: { card: Card; time: number }) {
  const at = REVEAL[ALL.indexOf(card)];
  const revealed = at.map((e) => time >= e);
  const next = at.indexOf(Math.min(...at.filter((e) => e > time)));
  return <RecordCard card={card} progress={{ revealed, thinking: time >= 0.85 ? next : undefined }} />;
}

function FadeIn({ active, children, delay }: { active: boolean; children: ReactNode; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : undefined} transition={{ delay, duration: 0.35, ease: EASE_OUT_CUBIC }}>
      {children}
    </motion.div>
  );
}

function TravelingCard({ card, index, landed, moved, playing, time, travel }: { card: Card; index: number; landed: boolean; moved: boolean; playing: boolean; time: number; travel: { x: number } }) {
  return (
    <motion.div className="relative z-10" initial={{ opacity: 0 }} animate={playing ? { opacity: 1 } : undefined} transition={{ delay: enterDelay(index, 0), duration: 0.5 }}>
      <motion.div initial={false} animate={{ transform: `translateX(${moved ? travel.x : 0}px)` }} transition={{ duration: 0.85 * Number(!landed), ease: EASE_IN_OUT_CUBIC }}>
        <motion.div
          className="relative rounded-[10px]"
          initial={false}
          animate={{ transform: moved ? ["translateY(0px)", "translateY(32px)", "translateY(0px)"] : "translateY(0px)" }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[10px]"
            style={{
              boxShadow:
                "0 14px 32px -12px color-mix(in oklab, var(--color-black-100) 18%, transparent), 0 4px 12px -5px color-mix(in oklab, var(--color-black-100) 10%, transparent)",
            }}
            initial={false}
            animate={{ opacity: moved ? [0, 0.8, 0] : 0 }}
            transition={{ duration: 0.85, ease: "easeInOut" }}
          />
          <div className="relative">
            <TimedCard card={card} time={time} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function PlayingBoard({ active, mobile, onActivityChange }: { active: boolean; mobile: boolean; onActivityChange: (v: boolean) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.2, once: true });
  const playing = active && inView;
  const [time, setTime] = useState(0);
  const movers = useRef<(HTMLDivElement | null)[]>([]);
  const stacks = useRef<(HTMLDivElement | null)[]>([]);
  const [travel, setTravel] = useState(MOVES.map(() => ({ step: 0, x: 0 })));
  const moved = MOVE_AT.map((e, t) => time >= e && (!mobile || t === 0));
  const landed = LAND_AT.map((e, t) => time >= e && (!mobile || t === 0));
  const landedCount = landed.filter((e, t) => e && (!mobile || t === 0)).length;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      setTravel(
        MOVES.map(({ target }, t) => {
          if (mobile && t !== 0) return { step: 0, x: 0 };
          const card = movers.current[t];
          const col = stacks.current[target];
          if (!card || !col) return { step: 0, x: 0 };
          const a = card.getBoundingClientRect();
          const b = col.getBoundingClientRect();
          return { step: a.height + 8, x: b.x - a.x };
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    movers.current.forEach((m) => {
      if (m) ro.observe(m);
    });
    return () => ro.disconnect();
  }, [mobile]);

  useEffect(() => {
    if (!playing) return;
    const timers = TICKS.map((t) => setTimeout(() => setTime(t), 1000 * t));
    return () => timers.forEach(clearTimeout);
  }, [playing]);

  const enriching = time >= 0.85 && landedCount < (mobile ? 1 : MOVES.length);
  useEffect(() => {
    onActivityChange(enriching);
    return () => onActivityChange(false);
  }, [enriching, onActivityChange]);

  return (
    <BoardFrame ref={root}>
      {COLUMNS.map((col, a) => {
        const src = MOVES.findIndex(({ source }, t) => source === a && (!mobile || t === 0));
        const dst = MOVES.findIndex(({ target }, t) => target === a && (!mobile || t === 0));
        const leaving = src >= 0 && moved[src];
        const shift = (dst >= 0 && moved[dst] ? travel[dst].step : 0) - (leaving ? travel[src].step : 0);
        const count = STAYING[a].length + Number(src >= 0 && !landed[src]) + (dst >= 0 && landed[dst] ? 1 : 0);
        return (
          <BoardColumn key={col.title} active={playing} count={count} dotColor={col.dotColor} index={a} title={col.title}>
            <div
              ref={(el) => {
                stacks.current[a] = el;
              }}
              className="flex flex-col gap-2"
            >
              {src >= 0 && (
                <div
                  ref={(el) => {
                    movers.current[src] = el;
                  }}
                >
                  <TravelingCard card={MOVES[src].card} index={a} landed={landed[src]} moved={moved[src]} playing={playing} time={time} travel={travel[src]} />
                </div>
              )}
              <motion.div className="flex flex-col gap-2" initial={false} animate={{ transform: `translateY(${shift}px)` }} transition={{ duration: 0.85, ease: EASE_IN_OUT_CUBIC }}>
                {STAYING[a].map((c, n) => (
                  <FadeIn key={c.company} active={playing} delay={enterDelay(a, n + Number(src >= 0))}>
                    <TimedCard card={c} time={time} />
                  </FadeIn>
                ))}
              </motion.div>
            </div>
          </BoardColumn>
        );
      })}
    </BoardFrame>
  );
}

function useReducedMotionPref() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

const STRIPES: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, transparent calc(50% - 0.5px), currentColor calc(50% - 0.5px) calc(50% + 0.5px), transparent calc(50% + 0.5px))",
  backgroundPosition: "center",
  backgroundRepeat: "repeat",
  backgroundSize: "8px 100%",
};

function HeroLines({ active, reduced }: { active: boolean; reduced: boolean }) {
  return (
    <div aria-hidden="true" className="enrichment-hero-lines pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 [-webkit-mask-composite:source-in] [-webkit-mask-image:var(--hero-lines-mask)] [mask-composite:intersect] [mask-image:var(--hero-lines-mask)]"
        style={{ "--hero-lines-mask": "radial-gradient(ellipse 95% 80% at 50% 50%, transparent 42%, #000 82%), linear-gradient(to bottom, #000 0%, #000 48%, transparent 78%)" } as CSSProperties}
      >
        <div aria-hidden="true" className="size-full text-subtle-stroke" style={STRIPES} />
        <motion.div className="absolute inset-0" initial={false} animate={{ opacity: active && !reduced ? 0.55 : 0 }} transition={{ duration: 0.8 * Number(!reduced), ease: [0.45, 0, 0.55, 1] }}>
          <div aria-hidden="true" className="size-full absolute inset-0 text-blue-400" style={STRIPES} />
          <div aria-hidden="true" className="size-full mask-l-from-0% mask-l-to-100% absolute inset-0 text-[oklch(0.65_0.16_290)]" style={STRIPES} />
          <div aria-hidden="true" className="size-full absolute inset-0 text-blue-400 opacity-60 blur-[3px]" style={STRIPES} />
        </motion.div>
        <SignalRays
          color="var(--color-black-900)"
          count={12}
          direction="up"
          easeDistance={0}
          gridAlignment="center"
          initialSpawn="staggered"
          maxWidth={1}
          minSpeedFactor={1}
          minWidth={1}
          peakOpacity={0.55}
          terminusFromBottom={0}
        />
      </div>
    </div>
  );
}

export function EnrichmentHeroStage({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const reduced = useReducedMotionPref();
  const mobile = useMediaQuery("(width < 48rem)");
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 450);
    return () => clearTimeout(t);
  }, []);
  return (
    <section className="relative flex h-[calc(100svh-var(--site-header-height))] flex-col overflow-hidden max-md:min-h-fit">
      <HeroLines active={enriching} reduced={reduced} />
      <div className="relative z-10 px-6 motion-reduce:[&_*]:animate-none!">{children}</div>
      <div className={cn("enrichment-hero-board relative flex-1 md:min-h-0", !ready && "invisible motion-reduce:visible")}>
        {reduced ? <StaticBoard mobile={mobile} /> : <PlayingBoard active={ready} mobile={mobile} onActivityChange={setEnriching} />}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-t from-primary-background to-transparent" />
    </section>
  );
}
