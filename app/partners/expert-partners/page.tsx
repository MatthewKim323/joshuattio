import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { ExpertPartners } from "@/components/pages/partners/expert-partners/00-expert-partners";
import { Block } from "@/components/pages/partners/expert-partners/01-block";
import { WhoWeReLooking } from "@/components/pages/partners/expert-partners/02-who-we-re-looking";
import { Block3 } from "@/components/pages/partners/expert-partners/03-block-3";
import { RiseThroughTheTiers } from "@/components/pages/partners/expert-partners/04-rise-through-the-tiers";
import { Block5 } from "@/components/pages/partners/expert-partners/05-block-5";
import { YourPathToThe } from "@/components/pages/partners/expert-partners/06-your-path-to-the";
import { Block7 } from "@/components/pages/partners/expert-partners/07-block-7";
import { BecomeAnJoshuattioExpert } from "@/components/pages/partners/expert-partners/08-become-an-joshuattio-expert";
import { Block9 } from "@/components/pages/partners/expert-partners/09-block-9";
import { BeAnExpertAt } from "@/components/pages/partners/expert-partners/10-be-an-expert-at";
import { Block11 } from "@/components/pages/partners/expert-partners/11-block-11";
import { FrequentlyAskedQuestions } from "@/components/pages/partners/expert-partners/12-frequently-asked-questions";
import { Block13 } from "@/components/pages/partners/expert-partners/13-block-13";
import { JoinTheBuildersRedefining } from "@/components/pages/partners/expert-partners/14-join-the-builders-redefining";

export const metadata: Metadata = {
  title: "Experts Partner Program | Joshuattio",
  description: "Provide your services to activate Joshuattio customers. Get exclusive perks and resources to establish your business.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "expert-partners": ExpertPartners,
  "block": Block,
  "who-we-re-looking": WhoWeReLooking,
  "block-3": Block3,
  "rise-through-the-tiers": RiseThroughTheTiers,
  "block-5": Block5,
  "your-path-to-the": YourPathToThe,
  "block-7": Block7,
  "become-an-joshuattio-expert": BecomeAnJoshuattioExpert,
  "block-9": Block9,
  "be-an-expert-at": BeAnExpertAt,
  "block-11": Block11,
  "frequently-asked-questions": FrequentlyAskedQuestions,
  "block-13": Block13,
  "join-the-builders-redefining": JoinTheBuildersRedefining,
} as const;

export default async function Page({ searchParams }: PageProps<"/partners/expert-partners">) {
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
