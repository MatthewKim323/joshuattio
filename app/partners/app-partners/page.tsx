import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { AppPartners } from "@/components/pages/partners/app-partners/00-app-partners";
import { Divider } from "@/components/pages/partners/app-partners/01-divider";
import { AppSdk } from "@/components/pages/partners/app-partners/02-app-sdk";
import { Divider3 } from "@/components/pages/partners/app-partners/03-divider-3";
import { StartBuilding } from "@/components/pages/partners/app-partners/04-start-building";
import { Divider5 } from "@/components/pages/partners/app-partners/05-divider-5";
import { ExploreExistingApps } from "@/components/pages/partners/app-partners/06-explore-existing-apps";
import { Divider7 } from "@/components/pages/partners/app-partners/07-divider-7";
import { Block } from "@/components/pages/partners/app-partners/08-block";
import { Divider9 } from "@/components/pages/partners/app-partners/09-divider-9";
import { FrequentlyAskedQuestions } from "@/components/pages/partners/app-partners/10-frequently-asked-questions";
import { Divider11 } from "@/components/pages/partners/app-partners/11-divider-11";
import { DifferentWaysToPartner } from "@/components/pages/partners/app-partners/12-different-ways-to-partner";

export const metadata: Metadata = {
  title: "App Partner Program | Joshuattio",
  description: "Develop custom integrations to expand the Joshuattio ecosystem.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "app-partners": AppPartners,
  "divider": Divider,
  "app-sdk": AppSdk,
  "divider-3": Divider3,
  "start-building": StartBuilding,
  "divider-5": Divider5,
  "explore-existing-apps": ExploreExistingApps,
  "divider-7": Divider7,
  "block": Block,
  "divider-9": Divider9,
  "frequently-asked-questions": FrequentlyAskedQuestions,
  "divider-11": Divider11,
  "different-ways-to-partner": DifferentWaysToPartner,
} as const;

export default async function Page({ searchParams }: PageProps<"/partners/app-partners">) {
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
