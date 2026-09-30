import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { Sequences } from "@/components/pages/platform/sequences/00-sequences";
import { Block } from "@/components/pages/platform/sequences/01-block";
import { StepInsideSequences } from "@/components/pages/platform/sequences/02-step-inside-sequences";
import { Block3 } from "@/components/pages/platform/sequences/03-block-3";
import { ZeroTouchFollowUps } from "@/components/pages/platform/sequences/04-zero-touch-follow-ups";
import { Block5 } from "@/components/pages/platform/sequences/05-block-5";
import { Block6 } from "@/components/pages/platform/sequences/06-block-6";
import { Block7 } from "@/components/pages/platform/sequences/07-block-7";
import { HandwrittenWarmth } from "@/components/pages/platform/sequences/08-handwritten-warmth";
import { Block9 } from "@/components/pages/platform/sequences/09-block-9";
import { EveryInteractionInJoshuattio } from "@/components/pages/platform/sequences/10-every-interaction-in-joshuattio";
import { Block11 } from "@/components/pages/platform/sequences/11-block-11";
import { JoshuattioPlugsInYou } from "@/components/pages/platform/sequences/12-joshuattio-plugs-in-you";
import { Cta } from "@/components/pages/platform/sequences/13-cta";

export const metadata: Metadata = {
  title: "Sequences | Joshuattio",
  description: "Go from first touch to final signature with perfectly crafted emails delivered right on cue.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "sequences": Sequences,
  "block": Block,
  "step-inside-sequences": StepInsideSequences,
  "block-3": Block3,
  "zero-touch-follow-ups": ZeroTouchFollowUps,
  "block-5": Block5,
  "block-6": Block6,
  "block-7": Block7,
  "handwritten-warmth": HandwrittenWarmth,
  "block-9": Block9,
  "every-interaction-in-joshuattio": EveryInteractionInJoshuattio,
  "block-11": Block11,
  "joshuattio-plugs-in-you": JoshuattioPlugsInYou,
  "cta": Cta,
} as const;

export default async function Page({ searchParams }: PageProps<"/platform/sequences">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><One /></main>;
  }
  return (
    <SiteShell>
      <>
        {Object.entries(SECTIONS).map(([name, S]) => <S key={name} />)}
      </>
    </SiteShell>
  );
}
