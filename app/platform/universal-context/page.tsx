import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { UniversalContext } from "@/components/pages/platform/universal-context/00-universal-context";
import { Block } from "@/components/pages/platform/universal-context/01-block";
import { Logos } from "@/components/pages/platform/universal-context/02-logos";
import { Block3 } from "@/components/pages/platform/universal-context/03-block-3";
import { AllOfTheSignals } from "@/components/pages/platform/universal-context/04-all-of-the-signals";
import { Block5 } from "@/components/pages/platform/universal-context/05-block-5";
import { TheEngineBehindEvery } from "@/components/pages/platform/universal-context/06-the-engine-behind-every";
import { Block7 } from "@/components/pages/platform/universal-context/07-block-7";
import { TrustEveryAnswerControl } from "@/components/pages/platform/universal-context/08-trust-every-answer-control";
import { Block9 } from "@/components/pages/platform/universal-context/09-block-9";
import { BuiltLikeInfrastructure } from "@/components/pages/platform/universal-context/10-built-like-infrastructure";
import { Block11 } from "@/components/pages/platform/universal-context/11-block-11";
import { AWinInEvery } from "@/components/pages/platform/universal-context/12-a-win-in-every";
import { Block13 } from "@/components/pages/platform/universal-context/13-block-13";
import { AskMoreFromCrm } from "@/components/pages/platform/universal-context/14-ask-more-from-crm";

export const metadata: Metadata = {
  title: "Universal Context | Joshuattio",
  description: "Every live signal captured and ready to act on. The deepest context layer in agentic revenue.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "universal-context": UniversalContext,
  "block": Block,
  "logos": Logos,
  "block-3": Block3,
  "all-of-the-signals": AllOfTheSignals,
  "block-5": Block5,
  "the-engine-behind-every": TheEngineBehindEvery,
  "block-7": Block7,
  "trust-every-answer-control": TrustEveryAnswerControl,
  "block-9": Block9,
  "built-like-infrastructure": BuiltLikeInfrastructure,
  "block-11": Block11,
  "a-win-in-every": AWinInEvery,
  "block-13": Block13,
  "ask-more-from-crm": AskMoreFromCrm,
} as const;

export default async function Page({ searchParams }: PageProps<"/platform/universal-context">) {
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
