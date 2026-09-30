import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { Reporting } from "@/components/pages/platform/reporting/00-reporting";
import { Block } from "@/components/pages/platform/reporting/01-block";
import { Logos } from "@/components/pages/platform/reporting/02-logos";
import { Block3 } from "@/components/pages/platform/reporting/03-block-3";
import { ReportingEngineForGtm } from "@/components/pages/platform/reporting/04-reporting-engine-for-gtm";
import { Block5 } from "@/components/pages/platform/reporting/05-block-5";
import { OpenTheNumber } from "@/components/pages/platform/reporting/06-open-the-number";
import { Block7 } from "@/components/pages/platform/reporting/07-block-7";
import { JoshuattioDoesTheMath } from "@/components/pages/platform/reporting/08-joshuattio-does-the-math";
import { Block9 } from "@/components/pages/platform/reporting/09-block-9";
import { Cta } from "@/components/pages/platform/reporting/10-cta";

export const metadata: Metadata = {
  title: "Reporting | Joshuattio",
  description: "Reporting for go-to-market teams. Forecasts you can trust, pipeline health that updates itself, and insights only possible in Joshuattio.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "reporting": Reporting,
  "block": Block,
  "logos": Logos,
  "block-3": Block3,
  "reporting-engine-for-gtm": ReportingEngineForGtm,
  "block-5": Block5,
  "open-the-number": OpenTheNumber,
  "block-7": Block7,
  "joshuattio-does-the-math": JoshuattioDoesTheMath,
  "block-9": Block9,
  "cta": Cta,
} as const;

export default async function Page({ searchParams }: PageProps<"/platform/reporting">) {
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
