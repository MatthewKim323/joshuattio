import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { DataModel } from "@/components/pages/platform/data/00-data-model";
import { Block } from "@/components/pages/platform/data/01-block";
import { BlazinglyFastAmazinglyFlexible } from "@/components/pages/platform/data/02-blazingly-fast-amazingly-flexible";
import { Block3 } from "@/components/pages/platform/data/03-block-3";
import { ContextThatStaysCurrent } from "@/components/pages/platform/data/04-context-that-stays-current";
import { Block5 } from "@/components/pages/platform/data/05-block-5";
import { AutomaticEnrichmentAutomaticAdvantage } from "@/components/pages/platform/data/06-automatic-enrichment-automatic-advantage";
import { Block7 } from "@/components/pages/platform/data/07-block-7";
import { UnifyYourDataSources } from "@/components/pages/platform/data/08-unify-your-data-sources";
import { Block9 } from "@/components/pages/platform/data/09-block-9";
import { FromDataToDecisions } from "@/components/pages/platform/data/10-from-data-to-decisions";
import { Block11 } from "@/components/pages/platform/data/11-block-11";
import { JoshuattioPlugsInYou } from "@/components/pages/platform/data/12-joshuattio-plugs-in-you";
import { Cta } from "@/components/pages/platform/data/13-cta";

export const metadata: Metadata = {
  title: "Data structure & syncing | Joshuattio",
  description: "Model your data structure, get automatic enrichment, and syncing from your integrations. Joshuattio gives you complete control to build the perfect CRM.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "data-model": DataModel,
  "block": Block,
  "blazingly-fast-amazingly-flexible": BlazinglyFastAmazinglyFlexible,
  "block-3": Block3,
  "context-that-stays-current": ContextThatStaysCurrent,
  "block-5": Block5,
  "automatic-enrichment-automatic-advantage": AutomaticEnrichmentAutomaticAdvantage,
  "block-7": Block7,
  "unify-your-data-sources": UnifyYourDataSources,
  "block-9": Block9,
  "from-data-to-decisions": FromDataToDecisions,
  "block-11": Block11,
  "joshuattio-plugs-in-you": JoshuattioPlugsInYou,
  "cta": Cta,
} as const;

export default async function Page({ searchParams }: PageProps<"/platform/data">) {
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
