"use client";

import { useEffect, type ReactNode } from "react";
import { setPeriod, usePeriod } from "./pricing-state";

const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

// Monthly / Annual segmented control. The white thumb slides 500ms ease-in-out,
// labels cross-fade color 500ms emphasized. The active option is disabled.
export function PeriodSwitcher({ className }: { className?: string }) {
  const period = usePeriod();
  // The period lives with the page: leaving the route resets it to annual.
  useEffect(() => () => setPeriod("annual"), []);
  const btn =
    "isolate rounded-[10px] px-5 py-2 text-sm transition-colors duration-500 ease-emphasized-in-out";
  return (
    <div className={cx("rounded-xl bg-surface-subtle p-0.5", className)}>
      <div className="relative grid grid-cols-[1fr_1fr] gap-x-0.5">
        <div
          className={cx(
            "absolute top-0 left-0 h-full w-[calc((100%-2px)/2)] rounded-[10px] bg-primary-background transition-transform duration-500 ease-in-out shadow-[0px_4px_4px_-2px_rgba(24,_39,_75,_0.06),_0px_2px_4px_-2px_rgba(24,_39,_75,_0.02),0px_0px_2px_0px_#E0E0E0]",
            period === "annual" && "translate-x-[calc(100%+2px)]",
          )}
        />
        <button
          type="button"
          className={cx(btn, period !== "monthly" ? "cursor-pointer text-black-700" : "text-black-400")}
          disabled={period === "monthly"}
          onClick={() => setPeriod("monthly")}
        >
          {"Monthly"}
        </button>
        <button
          type="button"
          className={cx(btn, period !== "annual" ? "cursor-pointer text-black-700" : "text-black-400")}
          disabled={period === "annual"}
          onClick={() => setPeriod("annual")}
        >
          {"Annual"}
        </button>
      </div>
    </div>
  );
}

// Two stacked values in one grid cell, cross-faded 150ms when the period flips.
export function PeriodValue({
  monthly,
  annual,
  className,
}: {
  monthly: ReactNode;
  annual: ReactNode;
  className?: string;
}) {
  const period = usePeriod();
  const fade = monthly !== annual && "transition-opacity duration-150 ease-in-out";
  return (
    <span className={cx("inline-grid", className)}>
      <span className={cx("col-start-1 row-start-1", period === "monthly" ? "opacity-100" : "opacity-0", fade)}>
        {monthly}
      </span>
      <span className={cx("col-start-1 row-start-1", period === "annual" ? "opacity-100" : "opacity-0", fade)}>
        {annual}
      </span>
    </span>
  );
}

// Big card price: the outgoing number drops out below / rises out above while the
// incoming one slides in, 500ms ease-out, inside an overflow-y clip.
export function CardPriceAmount({ monthly, annual }: { monthly: string; annual: string }) {
  const period = usePeriod();
  const move = monthly !== annual && "transition duration-500 ease-out";
  const on = "translate-y-0 opacity-100";
  return (
    <span className="inline-grid overflow-y-hidden text-heading-md">
      <span className={cx("col-1 row-1", period === "monthly" ? cx(move, on) : cx("translate-y-full opacity-0", move))}>
        {monthly}
      </span>
      <span
        className={cx(
          "top-0 left-0 col-1 row-1",
          period === "annual" ? cx(move, on) : cx("-translate-y-full opacity-0", move),
        )}
      >
        {annual}
      </span>
    </span>
  );
}

// "Save N%" pill, only shown for annual billing. Leaves with a 150ms / 100ms
// delay, enters without delay on a longer 600ms translate.
export function SaveBadge({ className, children }: { className?: string; children: ReactNode }) {
  const visible = usePeriod() === "annual";
  return (
    <div
      className={cx(
        "rounded-lg border border-blue-200 bg-blue-100 px-[7px] py-[3px] text-center text-blue-450 text-xs",
        visible
          ? "translate-y-0 opacity-100 [transition:_opacity_300ms_cubic-bezier(0,_0,_0,_1),_translate_600ms_cubic-bezier(0,_0,_0,_1)]"
          : "-translate-y-2 opacity-0 [transition:_opacity_300ms_150ms_cubic-bezier(0,_0,_0,_1),_translate_500ms_100ms_cubic-bezier(0,_0,_0,_1)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
