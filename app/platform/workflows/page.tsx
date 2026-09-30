import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { Workflows } from "@/components/pages/platform/workflows/00-workflows";
import { Block } from "@/components/pages/platform/workflows/01-block";
import { Logos } from "@/components/pages/platform/workflows/02-logos";
import { Block3 } from "@/components/pages/platform/workflows/03-block-3";
import { CueTheAgents } from "@/components/pages/platform/workflows/04-cue-the-agents";
import { Block5 } from "@/components/pages/platform/workflows/05-block-5";
import { HireTheBestRep } from "@/components/pages/platform/workflows/06-hire-the-best-rep";
import { Block7 } from "@/components/pages/platform/workflows/07-block-7";
import { Block8 } from "@/components/pages/platform/workflows/08-block-8";
import { Block9 } from "@/components/pages/platform/workflows/09-block-9";
import { FromIdeaToLive } from "@/components/pages/platform/workflows/10-from-idea-to-live";
import { UniversalContextTm } from "@/components/pages/platform/workflows/11-universal-context-tm";
import { BuiltForTheLong } from "@/components/pages/platform/workflows/12-built-for-the-long";
import { Block13 } from "@/components/pages/platform/workflows/13-block-13";
import { TrustByDefault } from "@/components/pages/platform/workflows/14-trust-by-default";
import { AskMoreFromCrm } from "@/components/pages/platform/workflows/15-ask-more-from-crm";

export const metadata: Metadata = {
  title: "Agents and automations | Joshuattio",
  description: "AI agents for every revenue motion, built in minutes and running on the deepest context layer in any agentic CRM.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "workflows": Workflows,
  "block": Block,
  "logos": Logos,
  "block-3": Block3,
  "cue-the-agents": CueTheAgents,
  "block-5": Block5,
  "hire-the-best-rep": HireTheBestRep,
  "block-7": Block7,
  "block-8": Block8,
  "block-9": Block9,
  "from-idea-to-live": FromIdeaToLive,
  "universal-context-tm": UniversalContextTm,
  "built-for-the-long": BuiltForTheLong,
  "block-13": Block13,
  "trust-by-default": TrustByDefault,
  "ask-more-from-crm": AskMoreFromCrm,
} as const;

export default async function Page({ searchParams }: PageProps<"/platform/workflows">) {
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
