import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { DownloadHero } from "@/components/pages/download/hero";
import { JoshuattioForDesktop } from "@/components/pages/download/00-joshuattio-for-desktop";
import { Divider } from "@/components/pages/download/01-divider";
import { JoshuattioForMobile } from "@/components/pages/download/02-joshuattio-for-mobile";
import { Divider3 } from "@/components/pages/download/03-divider-3";
import { JoshuattioExtension } from "@/components/pages/download/04-joshuattio-extension";
import { Divider5 } from "@/components/pages/download/05-divider-5";
import { JoshuattioForSlack } from "@/components/pages/download/06-joshuattio-for-slack";

export const metadata: Metadata = {
  title: "Downloads | Joshuattio",
  description: "Joshuattio is available for iOS, Android, and Chrome.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "joshuattio-for-desktop": JoshuattioForDesktop,
  "divider": Divider,
  "joshuattio-for-mobile": JoshuattioForMobile,
  "divider-3": Divider3,
  "joshuattio-extension": JoshuattioExtension,
  "divider-5": Divider5,
  "joshuattio-for-slack": JoshuattioForSlack,
} as const;

export default async function Page({ searchParams }: PageProps<"/download">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><One /></main>;
  }
  return (
    <SiteShell bare>
      <div className="flex max-w-screen flex-1 flex-col overflow-x-clip">
        <div className="container flex flex-1 flex-col">
          <DownloadHero />
          <svg width="100%" height="1" className="text-subtle-stroke relative max-lg:left-1/2 max-lg:w-screen max-lg:-translate-x-1/2">
            <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeLinecap="round" />
          </svg>
          <main className="relative w-full border-subtle-stroke border-x">
            {Object.entries(SECTIONS).map(([name, S]) => <S key={name} />)}
          </main>
        </div>
      </div>
    </SiteShell>
  );
}
