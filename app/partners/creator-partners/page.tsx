import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { CreatorPartners } from "@/components/pages/partners/creator-partners/00-creator-partners";
import { Divider } from "@/components/pages/partners/creator-partners/01-divider";
import { CreatorsShapeTheFuture } from "@/components/pages/partners/creator-partners/02-creators-shape-the-future";
import { Divider3 } from "@/components/pages/partners/creator-partners/03-divider-3";
import { PerksBenefits } from "@/components/pages/partners/creator-partners/04-perks-benefits";
import { Divider5 } from "@/components/pages/partners/creator-partners/05-divider-5";
import { CreatorPartnerApplicationsAre } from "@/components/pages/partners/creator-partners/06-creator-partner-applications-are";
import { Divider7 } from "@/components/pages/partners/creator-partners/07-divider-7";
import { Block } from "@/components/pages/partners/creator-partners/08-block";
import { Divider9 } from "@/components/pages/partners/creator-partners/09-divider-9";
import { FrequentlyAskedQuestions } from "@/components/pages/partners/creator-partners/10-frequently-asked-questions";
import { Divider11 } from "@/components/pages/partners/creator-partners/11-divider-11";
import { DifferentWaysToPartner } from "@/components/pages/partners/creator-partners/12-different-ways-to-partner";

export const metadata: Metadata = {
  title: "Creator Program | Joshuattio",
  description: "Our Creator Program empowers leading GTM voices like yours. Get exclusive resources, from a free workspace to boosted content.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "creator-partners": CreatorPartners,
  "divider": Divider,
  "creators-shape-the-future": CreatorsShapeTheFuture,
  "divider-3": Divider3,
  "perks-benefits": PerksBenefits,
  "divider-5": Divider5,
  "creator-partner-applications-are": CreatorPartnerApplicationsAre,
  "divider-7": Divider7,
  "block": Block,
  "divider-9": Divider9,
  "frequently-asked-questions": FrequentlyAskedQuestions,
  "divider-11": Divider11,
  "different-ways-to-partner": DifferentWaysToPartner,
} as const;

export default async function Page({ searchParams }: PageProps<"/partners/creator-partners">) {
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
