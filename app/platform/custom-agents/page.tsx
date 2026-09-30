import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { CustomAgents } from "@/components/pages/platform/custom-agents/00-custom-agents";
import { Block } from "@/components/pages/platform/custom-agents/01-block";
import { Logos } from "@/components/pages/platform/custom-agents/02-logos";
import { Block3 } from "@/components/pages/platform/custom-agents/03-block-3";
import { YouChooseHowIt } from "@/components/pages/platform/custom-agents/04-you-choose-how-it";
import { Block5 } from "@/components/pages/platform/custom-agents/05-block-5";
import { TheJudgmentCallsOnly } from "@/components/pages/platform/custom-agents/06-the-judgment-calls-only";
import { AlreadyDoingTheWork } from "@/components/pages/platform/custom-agents/07-already-doing-the-work";
import { Block8 } from "@/components/pages/platform/custom-agents/08-block-8";
import { WatchYourAgentWork } from "@/components/pages/platform/custom-agents/09-watch-your-agent-work";
import { Block10 } from "@/components/pages/platform/custom-agents/10-block-10";
import { EveryAccountSameStandard } from "@/components/pages/platform/custom-agents/11-every-account-same-standard";
import { AskMoreFromCrm } from "@/components/pages/platform/custom-agents/12-ask-more-from-crm";

export const metadata: Metadata = {
  title: "Custom agents | Joshuattio",
  description: "Custom agents run the judgment calls only your team knows how to make, on every record, around the clock",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "custom-agents": CustomAgents,
  "block": Block,
  "logos": Logos,
  "block-3": Block3,
  "you-choose-how-it": YouChooseHowIt,
  "block-5": Block5,
  "the-judgment-calls-only": TheJudgmentCallsOnly,
  "already-doing-the-work": AlreadyDoingTheWork,
  "block-8": Block8,
  "watch-your-agent-work": WatchYourAgentWork,
  "block-10": Block10,
  "every-account-same-standard": EveryAccountSameStandard,
  "ask-more-from-crm": AskMoreFromCrm,
} as const;

export default async function Page({ searchParams }: PageProps<"/platform/custom-agents">) {
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
