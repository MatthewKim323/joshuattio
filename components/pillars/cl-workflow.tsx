"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useAnimate, useInView } from "motion/react";
import { BLUR_ENTRANCE, EASE_UI, EASE_UI_EXIT, useReducedMotionSafe, withTempo } from "./gp-tempo";
import {
  CHECK_ICON,
  CUSTOM_AGENT_ICON,
  IF_ICON,
  RECORD_ICON,
  SEQUENCE_ICON,
  TRIGGER_ICON,
  WEB_AGENT_ICON,
} from "./cl-paths";

const EASE_BORDER = [0.45, 0, 0.55, 1] as const;
const EASE_LINE = [0.5, 1, 0.89, 1] as const;
const IDLE = "#CDCED2";
const ACTIVE = "#266df0";

const THEMES = {
  blue: { bg: "#e5eeff", border: "#d6e5ff", fg: "#266df0" },
  green: { bg: "#e0fced", border: "#cbf7e1", fg: "#02ad6e" },
  lavender: { bg: "#fdedff", border: "#fad6ff", fg: "#cd33de" },
  orange: { bg: "#feeee1", border: "#fee0c8", fg: "#c95908" },
  purple: { bg: "#f5f0ff", border: "#e8ddfe", fg: "#864aff" },
} as const;

const BADGE_POS = "absolute top-[-13px] right-[3px] lg:top-[-26px] lg:right-[6px]";

const L_TRIGGER = "M 384 132 L 541 132";
const H_TRIGGER = "M 536 127 L 541 132 L 536 137";
const L_WEB = "M 757 132 L 789 132 A 14 14 0 0 1 803 146 L 803 206 A 14 14 0 0 1 789 220 L 109 220 A 14 14 0 0 0 95 234 L 95 314 A 14 14 0 0 0 109 328 L 137 328";
const H_WEB = "M 132 323 L 137 328 L 132 333";
const L_AGENT = "M 353 328 L 416 328";
const H_AGENT = "M 411 323 L 416 328 L 411 333";
const L_IF = "M 632 376 L 688 376 A 14 14 0 0 0 702 362 L 702 342 A 14 14 0 0 1 716 328 L 742 328";
const H_IF = "M 737 323 L 742 328 L 737 333";
const L_OUT = "M 958 328 L 1044 328";

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function Glyph({ className, color, d, viewBox }: { className?: string; color?: string; d: string; viewBox: string }) {
  return (
    <svg viewBox={viewBox} fill="currentColor" aria-hidden="true" className={cx("block shrink-0", className)} style={color ? { color } : undefined}>
      <path d={d} />
    </svg>
  );
}

// "Running" pill: rises in, then drops out and unmounts.
function RunningBadge() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [done, setDone] = useState(false);
  useEffect(() => {
    const controls = animate([
      [
        scope.current,
        { opacity: 1, y: 0 },
        { opacity: { duration: 0.5, ease: EASE_UI }, y: { duration: 0.5, ease: EASE_UI } },
      ],
      [
        scope.current,
        { opacity: 0, scale: 0.8, y: 30 },
        {
          at: 1,
          opacity: { delay: 0.3, duration: 0.3, ease: EASE_UI_EXIT },
          scale: { duration: 0.5, ease: EASE_UI_EXIT },
          y: { duration: 1, ease: [0.64, -0.37, 0.1, 0.6] },
        },
      ],
    ]);
    controls.then(() => setDone(true));
    return () => controls.stop();
  }, [animate, scope]);
  if (done) return null;
  return (
    <motion.div ref={scope} className={BADGE_POS} initial={{ opacity: 0, y: 40 }}>
      <div className="flex h-[10px] items-center gap-[1.5px] rounded-[3px] border border-[#e8ddfe] bg-[#f5f0ff] px-[2px] lg:h-[20px] lg:gap-[3px] lg:rounded-[6px] lg:px-[4px]">
        <div className="size-[6px] animate-spin lg:size-[12px]">
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="block size-full">
            <circle cx="6" cy="6" r="4.5" stroke="#e8ddfe" strokeWidth="1.5" />
            <path d="M6 1.5A4.5 4.5 0 0 1 10.5 6" stroke="#9162f9" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span className="px-px font-medium text-[#9162f9] text-[6px] leading-[8px] lg:text-[12px] lg:leading-[16px]">
          {"Running"}
        </span>
      </div>
    </motion.div>
  );
}

function DoneBadge({ label, reduce }: { label: string; reduce: boolean }) {
  return (
    <motion.div
      className={BADGE_POS}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              opacity: { delay: 1.3, duration: 0.5, ease: EASE_UI },
              y: { delay: 1.3, duration: 0.5, ease: EASE_UI },
            }
      }
    >
      <div className="flex h-[10px] items-center gap-[1.5px] rounded-[3px] border border-[#cbf7e1] bg-[#e0fced] px-[2px] lg:h-[20px] lg:gap-[3px] lg:rounded-[6px] lg:px-[4px]">
        <Glyph d={CHECK_ICON} viewBox="0 0 8.46 6.964" className="h-[3.48px] w-[4.23px] text-[#007d53] lg:h-[6.96px] lg:w-[8.46px]" />
        <span className="px-px font-medium text-[#007d53] text-[6px] leading-[8px] lg:text-[12px] lg:leading-[16px]">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

function Port({ isActive, reduce, top }: { isActive: boolean; reduce: boolean; top: string }) {
  return (
    <span
      className={cx(
        "absolute right-[-3px] z-30 flex size-[6px] -translate-y-1/2 items-center justify-center rounded-full border-[#e6e7ea] border-[0.5px] bg-white-100 lg:right-[-6px] lg:size-[12px] lg:border",
        top,
      )}
    >
      <span
        className="size-[3px] rounded-full transition-colors lg:size-[6px]"
        style={{
          backgroundColor: isActive ? ACTIVE : IDLE,
          transitionDelay: reduce ? "0s" : isActive ? "1.7s" : "0s",
          transitionDuration: "0.3s",
        }}
      />
    </span>
  );
}

function borderPath(width: number, height: number, radius: number, startY = height / 2) {
  const w = width;
  const h = height;
  const r = radius;
  return `M ${w - 0.5} ${startY} L ${w - 0.5} ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h - 0.5} L ${r} ${h - 0.5} A ${r} ${r} 0 0 1 0.5 ${h - r} L 0.5 ${r} A ${r} ${r} 0 0 1 ${r} 0.5 L ${w - r} 0.5 A ${r} ${r} 0 0 1 ${w - 0.5} ${r} L ${w - 0.5} ${startY}`;
}

type Theme = keyof typeof THEMES;

function Node({
  badge,
  cardHeight = 74,
  cardWidth = 216,
  description,
  icon,
  iconViewBox = "0 0 14 14",
  isActive,
  isTrigger,
  onBorderComplete,
  position,
  reduce,
  showBranches,
  sizeClass = "h-[37px] lg:h-[74px]",
  theme,
  title,
  widthClass = "w-[108px] lg:w-[216px]",
}: {
  badge: string;
  cardHeight?: number;
  cardWidth?: number;
  description: string;
  icon: string;
  iconViewBox?: string;
  isActive: boolean;
  isTrigger?: boolean;
  onBorderComplete?: () => void;
  position: string;
  reduce: boolean;
  showBranches?: boolean;
  sizeClass?: string;
  theme: Theme;
  title: string;
  widthClass?: string;
}) {
  const t = THEMES[theme];
  return (
    <div className={cx("absolute z-20", widthClass, sizeClass, position)}>
      {isTrigger && (
        <div className="absolute top-[-11px] left-0 z-0 flex items-center gap-[1.5px] rounded-[5px] bg-[#266df0] pt-[1.5px] pr-[4px] pb-[13px] pl-[3px] lg:top-[-22px] lg:gap-[3px] lg:rounded-[10px] lg:pt-[3px] lg:pr-[8px] lg:pb-[26px] lg:pl-[6px]">
          <Glyph d={TRIGGER_ICON} viewBox="0 0 7.533 8.158" className="h-[4.08px] w-[3.77px] text-[#e5eeff] lg:h-[8.16px] lg:w-[7.53px]" />
          <span className="px-px font-medium text-[#e5eeff] text-[6px] leading-[8px] lg:text-[12px] lg:leading-[16px]">
            {"Trigger"}
          </span>
        </div>
      )}
      {isActive &&
        (reduce ? (
          <DoneBadge label={badge} reduce />
        ) : (
          <>
            <RunningBadge />
            <DoneBadge label={badge} reduce={false} />
          </>
        ))}
      <div
        className={cx(
          "relative z-10 flex h-full w-full flex-col gap-px rounded-[7px] border-[0.54px] bg-white-100 p-[3px] lg:rounded-[15px] lg:border-[1.08px] lg:p-[6.5px]",
          isTrigger ? "border-[#266df0]" : "border-transparent",
          "shadow-joshuattio-product-e1",
        )}
      >
        <div className="flex items-center gap-[4px] pt-[2px] pr-[1px] pl-[2px] lg:gap-[8px] lg:pt-[4px] lg:pr-[2px] lg:pl-[4px]">
          <div
            className="flex size-[12px] shrink-0 items-center justify-center rounded-[3.5px] border px-[2px] lg:size-[26px] lg:rounded-[7px] lg:border-[1.08px] lg:px-[4.32px]"
            style={{ backgroundColor: t.bg, borderColor: t.border }}
          >
            <Glyph d={icon} viewBox={iconViewBox} className="size-[6.5px] lg:size-[15px]" color={t.fg} />
          </div>
          <p className="min-w-0 flex-1 truncate font-medium text-[#242629] text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[15px] lg:leading-[21.6px] lg:tracking-[-0.15px]">
            {title}
          </p>
        </div>
        <div className="flex h-[14px] items-center rounded-[4px] px-[2px] lg:h-[28px] lg:rounded-[8px] lg:px-[4px]">
          <p className="min-w-0 flex-1 truncate font-medium text-[6px] text-[rgba(0,0,0,0.55)] leading-[8px] lg:text-[12px] lg:leading-[16px]">
            {description}
          </p>
        </div>
        {showBranches && (
          <>
            <div className="mt-[5px] flex items-center px-[2px] py-px lg:mt-[10px] lg:px-[4px]">
              <p className="flex-1 text-right font-medium text-[6px] text-[rgba(0,0,0,0.55)] leading-[8px] lg:text-[12px] lg:leading-[16px]">
                {"True"}
              </p>
            </div>
            <div className="flex items-center px-[2px] py-px lg:px-[4px]">
              <p className="flex-1 text-right font-medium text-[6px] text-[rgba(0,0,0,0.55)] leading-[8px] lg:text-[12px] lg:leading-[16px]">
                {"False"}
              </p>
            </div>
          </>
        )}
      </div>
      {isActive && (
        <svg
          viewBox={`0 0 ${cardWidth} ${cardHeight}`}
          fill="none"
          aria-hidden="true"
          preserveAspectRatio="none"
          className="absolute inset-0 z-20 h-full w-full overflow-visible"
        >
          <motion.path
            d={borderPath(cardWidth, cardHeight, 15, showBranches ? 0.7 * cardHeight : undefined)}
            fill="none"
            stroke={ACTIVE}
            strokeWidth={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1.01 }}
            onAnimationComplete={onBorderComplete}
            transition={reduce ? { duration: 0 } : { duration: 2, ease: EASE_BORDER }}
          />
        </svg>
      )}
      {showBranches ? (
        <>
          <Port isActive={isActive} reduce={reduce} top="top-[70%]" />
          <Port isActive={false} reduce={reduce} top="top-[88%]" />
        </>
      ) : (
        <Port isActive={isActive} reduce={reduce} top="top-1/2" />
      )}
    </div>
  );
}

function Line({ d, stroke = IDLE }: { d: string; stroke?: string }) {
  return <path d={d} stroke={stroke} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />;
}

function DrawnLine({
  head,
  length,
  line,
  onComplete,
  reduce,
}: {
  head?: string;
  length: number;
  line: string;
  onComplete?: () => void;
  reduce: boolean;
}) {
  const dur = Math.min(1.4, Math.max(0.32, length / 720));
  return (
    <>
      <motion.path
        d={line}
        stroke={ACTIVE}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        onAnimationComplete={head ? undefined : onComplete}
        transition={reduce ? { duration: 0 } : { duration: dur, ease: EASE_LINE }}
      />
      {head ? (
        <motion.path
          d={head}
          stroke={ACTIVE}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          onAnimationComplete={onComplete}
          transition={reduce ? { duration: 0 } : { delay: 0.82 * dur, duration: 0.3, ease: "easeOut" }}
        />
      ) : null}
    </>
  );
}

function Connectors({ onStep, reduce, step }: { onStep: (s: number) => void; reduce: boolean; step: number }) {
  return (
    <svg
      viewBox="0 0 1044 654"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
      className="absolute inset-0 z-10 h-full w-full overflow-visible"
    >
      <Line d={L_TRIGGER} />
      <Line d={H_TRIGGER} />
      <Line d={L_WEB} />
      <Line d={H_WEB} />
      <Line d={L_AGENT} />
      <Line d={H_AGENT} />
      <Line d={L_IF} />
      <Line d={H_IF} />
      <Line d="M 632 397 L 688 397 A 14 14 0 0 1 702 411 L 702 508 A 14 14 0 0 0 716 522 L 742 522" />
      <Line d="M 737 517 L 742 522 L 737 527" />
      <Line d={L_OUT} />
      <Line d="M 958 522 L 1044 522" />
      {step >= 2 && <DrawnLine line={L_TRIGGER} head={H_TRIGGER} length={157} onComplete={() => onStep(3)} reduce={reduce} />}
      {step >= 4 && <DrawnLine line={L_WEB} head={H_WEB} length={970} onComplete={() => onStep(5)} reduce={reduce} />}
      {step >= 6 && <DrawnLine line={L_AGENT} head={H_AGENT} length={63} onComplete={() => onStep(7)} reduce={reduce} />}
      {step >= 8 && <DrawnLine line={L_IF} head={H_IF} length={146} onComplete={() => onStep(9)} reduce={reduce} />}
      {step >= 10 && <DrawnLine line={L_OUT} length={86} reduce={reduce} />}
    </svg>
  );
}

function Dots({ id, size, className }: { id: string; size: number; className: string }): ReactNode {
  const half = size / 2 + 0.5;
  return (
    <svg width="100%" height="100%" className={className}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <rect x={half} y={half} width="1" height="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

// Lead workflow canvas: each node's border traces, its badge flips from
// Running to done, then the connector to the next node draws.
export function ClWorkflow() {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const inView = useInView(root, { amount: 0.4, once: true });
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (inView) setStep(reduce ? 10 : 1);
  }, [inView, reduce]);

  const onStep = (s: number) => setStep((prev) => Math.max(prev, s));

  return (
    <div ref={root} aria-hidden="true" className="@container relative h-[327px] w-full overflow-hidden bg-surface-subtle lg:h-[654px]">
      <div aria-hidden="true" className="absolute inset-0 bg-surface-subtle" />
      <Dots id="_R_kl25fiv9f9k7ivb_" size={8} className="absolute inset-0 text-white-800 lg:hidden" />
      <Dots id="_R_sl25fiv9f9k7ivb_" size={16} className="absolute inset-0 text-white-800 max-lg:hidden" />
      <div className="absolute inset-y-0 right-0 flex items-center">
        <div className="h-[327px] w-[522px] origin-right [transform:scale(min(1,calc(100cqw/522px)))] lg:h-[654px] lg:w-[1044px] lg:[transform:scale(min(1,calc(100cqw/1044px)))]">
          <motion.div
            className="h-full w-full"
            initial={{ filter: `blur(${BLUR_ENTRANCE}px)`, opacity: 0, y: 16 }}
            animate={inView || reduce ? { filter: "blur(0px)", opacity: 1, y: 0 } : undefined}
            transition={reduce ? { duration: 0 } : { duration: withTempo(0.8), ease: EASE_UI }}
          >
            <div className="relative h-full w-full overflow-hidden">
              <div className="absolute inset-0 translate-y-[12px] lg:translate-y-[24px]">
                <Connectors onStep={onStep} step={step} reduce={reduce} />
                <Node
                  position="left-[84px] top-[47.5px] lg:left-[168px] lg:top-[95px]"
                  title="Record created"
                  description="New record created"
                  icon={RECORD_ICON}
                  iconViewBox="0 0 16 16"
                  theme="blue"
                  badge="Triggered"
                  isTrigger
                  isActive={inView && step >= 1}
                  onBorderComplete={() => onStep(2)}
                  reduce={reduce}
                />
                <Node
                  position="left-[270.5px] top-[47.5px] lg:left-[541px] lg:top-[95px]"
                  title="Web agent"
                  description="Enrich lead with web research"
                  icon={WEB_AGENT_ICON}
                  iconViewBox="0 0 16 16"
                  theme="lavender"
                  badge="Completed"
                  isActive={inView && step >= 3}
                  onBorderComplete={() => onStep(4)}
                  reduce={reduce}
                />
                <Node
                  position="left-[68.5px] top-[145.5px] lg:left-[137px] lg:top-[291px]"
                  title="Custom agent"
                  description="Score lead for ICP fit"
                  icon={CUSTOM_AGENT_ICON}
                  iconViewBox="0 0 16 16"
                  theme="green"
                  badge="Completed"
                  isActive={inView && step >= 5}
                  onBorderComplete={() => onStep(6)}
                  reduce={reduce}
                />
                <Node
                  position="left-[208px] top-[147.5px] lg:left-[416px] lg:top-[295px]"
                  sizeClass="h-[58px] lg:h-[116px]"
                  cardHeight={116}
                  title="If"
                  description="Route lead by segment"
                  icon={IF_ICON}
                  iconViewBox="0 0 16 16"
                  theme="purple"
                  badge="Completed"
                  showBranches
                  isActive={inView && step >= 7}
                  onBorderComplete={() => onStep(8)}
                  reduce={reduce}
                />
                <Node
                  position="left-[371px] top-[145.5px] lg:left-[742px] lg:top-[291px]"
                  title="Enroll in sequence"
                  description="Enterprise sequence"
                  icon={SEQUENCE_ICON}
                  iconViewBox="0 0 16 16"
                  theme="orange"
                  badge="Completed"
                  isActive={inView && step >= 9}
                  onBorderComplete={() => onStep(10)}
                  reduce={reduce}
                />
                <Node
                  position="left-[371px] top-[242.5px] lg:left-[742px] lg:top-[485px]"
                  title="Enroll in sequence"
                  description="SMB sequence"
                  icon={SEQUENCE_ICON}
                  iconViewBox="0 0 16 16"
                  theme="orange"
                  badge="Completed"
                  isActive={false}
                  reduce={reduce}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
