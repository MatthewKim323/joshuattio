import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { ReferAndEarn200 } from "@/components/pages/refer/00-refer-and-earn-200";
import { Block } from "@/components/pages/refer/01-block";
import { Block2 } from "@/components/pages/refer/02-block-2";
import { Block3 } from "@/components/pages/refer/03-block-3";
import { HowItWorks } from "@/components/pages/refer/04-how-it-works";
import { Block5 } from "@/components/pages/refer/05-block-5";
import { FrequentlyAskedQuestions } from "@/components/pages/refer/06-frequently-asked-questions";
import { Block7 } from "@/components/pages/refer/07-block-7";
import { StartReferringToday } from "@/components/pages/refer/08-start-referring-today";

export const metadata: Metadata = {
  title: "Referral Program | Joshuattio",
  description: "Get $200 for every valid referral you make.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "refer-and-earn-200": ReferAndEarn200,
  "block": Block,
  "block-2": Block2,
  "block-3": Block3,
  "how-it-works": HowItWorks,
  "block-5": Block5,
  "frequently-asked-questions": FrequentlyAskedQuestions,
  "block-7": Block7,
  "start-referring-today": StartReferringToday,
} as const;

export default async function Page({ searchParams }: PageProps<"/refer">) {
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
