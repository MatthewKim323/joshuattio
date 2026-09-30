"use client";

import { motion } from "motion/react";
import { clock, usePlayhead } from "./ci-hero-call";

// Coaching clip card: same 10:00 to 10:18 playhead loop as the hero call.
export function CiCoach() {
  const t = usePlayhead();
  const pct = (t - 600) / 2 + 37;
  return (
    <div className="flex h-full max-h-full scale-100 flex-col items-center justify-center max-md:scale-70 max-xl:scale-80">
      <div className="grid place-items-center gap-y-6">
        <div className="relative border border-black-100/5 backdrop-blur-xs dark:border-white-100/5 w-68 max-w-full" style={{"borderRadius":"12px"}}>
          <div className="overflow-hidden bg-primary-background shadow-joshuattio-5 dark:bg-secondary-background" style={{"borderRadius":"calc(12px - 1px)","padding":"6px"}}>
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <div className="absolute inset-0">
                <video aria-label="Call intelligence coaching preview video" className="h-full w-full object-cover" autoPlay loop muted playsInline preload="auto">
                  <source src="/media/vid-86b63d9a9d.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="mt-1.5 flex flex-col p-1">
              <span className="font-medium text-primary-foreground text-sm">
                {"Objections handling"}
              </span>
              <span className="text-accent-foreground text-xs">
                {clock(t)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-86 max-w-full items-center gap-x-1">
          <div className="h-1.5 grow-1 rounded-full bg-black-100" />
          <div className="relative flex h-1.5 grow-[0.37] items-center rounded-full bg-black-100/10">
            <motion.div className="absolute inset-y-0 rounded-full bg-black-100" animate={{ width: `${pct}%` }} />
            <motion.div
              className="absolute size-3.5 -translate-x-1/2 rounded-full border-3 border-white-200 bg-black-100"
              animate={{ boxShadow: "0 0 0 1px rgba(24, 39, 75, 0.04),0 4px 12px 0 rgba(24, 39, 75, 0.16)", left: `${pct}%` }}
            />
          </div>
          <div className="h-1.5 grow-[0.63] rounded-full bg-black-100/10" />
          <div className="h-1.5 grow-[0.37] rounded-full bg-black-100/10" />
          <div className="h-1.5 grow-[0.63] rounded-full bg-black-100/10" />
          <div className="h-1.5 grow-[0.25] rounded-full bg-black-100/10" />
        </div>
      </div>
    </div>
  );
}
