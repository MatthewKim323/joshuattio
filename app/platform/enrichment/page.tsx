import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { Enrichment } from "@/components/pages/platform/enrichment/00-enrichment";
import { Block } from "@/components/pages/platform/enrichment/01-block";
import { ReadyBeforeYouAsk } from "@/components/pages/platform/enrichment/02-ready-before-you-ask";
import { Block3 } from "@/components/pages/platform/enrichment/03-block-3";
import { RecordsCarryTheReal } from "@/components/pages/platform/enrichment/04-records-carry-the-real";
import { PutYourOwnSpin } from "@/components/pages/platform/enrichment/05-put-your-own-spin";
import { Block6 } from "@/components/pages/platform/enrichment/06-block-6";
import { Block7 } from "@/components/pages/platform/enrichment/07-block-7";
import { Block8 } from "@/components/pages/platform/enrichment/08-block-8";
import { EnrichedDataThatGoes } from "@/components/pages/platform/enrichment/09-enriched-data-that-goes";
import { Block10 } from "@/components/pages/platform/enrichment/10-block-10";
import { JoshuattioPlugsInYou } from "@/components/pages/platform/enrichment/11-joshuattio-plugs-in-you";
import { Block12 } from "@/components/pages/platform/enrichment/12-block-12";
import { AskMoreFromCrm } from "@/components/pages/platform/enrichment/13-ask-more-from-crm";

export const metadata: Metadata = {
  title: "Enrichment | Joshuattio",
  description: "Joshuattio enriches every company and contact automatically, adds the relationship history your team already has, and keeps every record current without manual work.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "enrichment": Enrichment,
  "block": Block,
  "ready-before-you-ask": ReadyBeforeYouAsk,
  "block-3": Block3,
  "records-carry-the-real": RecordsCarryTheReal,
  "put-your-own-spin": PutYourOwnSpin,
  "block-6": Block6,
  "block-7": Block7,
  "block-8": Block8,
  "enriched-data-that-goes": EnrichedDataThatGoes,
  "block-10": Block10,
  "joshuattio-plugs-in-you": JoshuattioPlugsInYou,
  "block-12": Block12,
  "ask-more-from-crm": AskMoreFromCrm,
} as const;

export default async function Page({ searchParams }: PageProps<"/platform/enrichment">) {
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
