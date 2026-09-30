import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { FromZeroToIpo } from "@/components/pages/pricing/00-from-zero-to-ipo";
import { Block } from "@/components/pages/pricing/01-block";
import { Free } from "@/components/pages/pricing/02-free";
import { FrequentlyAskedQuestions } from "@/components/pages/pricing/03-frequently-asked-questions";

export const metadata: Metadata = {
  title: "Plans & Pricing | Joshuattio",
  description: "Start for free. Whether you're a startup or enterprise, Joshuattio is the CRM for agentic revenue at every stage of growth.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "from-zero-to-ipo": FromZeroToIpo,
  "block": Block,
  "free": Free,
  "frequently-asked-questions": FrequentlyAskedQuestions,
} as const;

export default async function Page({ searchParams }: PageProps<"/pricing">) {
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
