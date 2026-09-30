import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { AppsSearchScope } from "@/components/pages/apps/detail/search-scope";
import { AppsIntegrations } from "@/components/pages/apps/00-apps-integrations";
import { Divider } from "@/components/pages/apps/01-divider";
import { EverythingYouNeed } from "@/components/pages/apps/02-everything-you-need";
import { Divider3 } from "@/components/pages/apps/03-divider-3";
import { DiscoverApps } from "@/components/pages/apps/04-discover-apps";
import { Divider5 } from "@/components/pages/apps/05-divider-5";
import { BuildWithUs } from "@/components/pages/apps/06-build-with-us";

export const metadata: Metadata = {
  title: "App Store | Joshuattio",
  description: "Discover apps and integrations to help you do more with Joshuattio and scale your business.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "apps-integrations": AppsIntegrations,
  "divider": Divider,
  "everything-you-need": EverythingYouNeed,
  "divider-3": Divider3,
  "discover-apps": DiscoverApps,
  "divider-5": Divider5,
  "build-with-us": BuildWithUs,
} as const;

export default async function Page({ searchParams }: PageProps<"/apps">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><AppsSearchScope><One /></AppsSearchScope></main>;
  }
  return (
    <SiteShell>
      <AppsSearchScope>
        {Object.entries(SECTIONS).map(([name, S]) => <S key={name} />)}
      </AppsSearchScope>
    </SiteShell>
  );
}
