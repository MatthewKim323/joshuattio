import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { PartnerPrograms } from "@/components/pages/partners/00-partner-programs";
import { Block } from "@/components/pages/partners/01-block";
import { S01AppPartners } from "@/components/pages/partners/02-01-app-partners";
import { Block3 } from "@/components/pages/partners/03-block-3";
import { ExpertPartners } from "@/components/pages/partners/04-expert-partners";
import { Block5 } from "@/components/pages/partners/05-block-5";
import { KeepUpToDate } from "@/components/pages/partners/06-keep-up-to-date";

export const metadata: Metadata = {
  title: "Partner Programs | Joshuattio",
  description: "From building technology around our platform to creating content about Joshuattio, we have a program for every need.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "partner-programs": PartnerPrograms,
  "block": Block,
  "01-app-partners": S01AppPartners,
  "block-3": Block3,
  "expert-partners": ExpertPartners,
  "block-5": Block5,
  "keep-up-to-date": KeepUpToDate,
} as const;

export default async function Page({ searchParams }: PageProps<"/partners">) {
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
