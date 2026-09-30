import type { Metadata } from "next";
import { Header } from "@/components/sections/00-header";
import { Footer } from "@/components/sections/16-footer";
import { CookieBanner } from "@/components/shell/cookie-banner";
import { Divider } from "@/components/pages/changelog/00-divider";
import { WorkflowHistoryAndAgent } from "@/components/pages/changelog/01-workflow-history-and-agent";
import { Block } from "@/components/pages/changelog/02-block";
import { ArchiveHeader } from "@/components/pages/changelog/archive-header";

export const metadata: Metadata = {
  title: "2026 | Joshuattio Changelog",
  description: "All Joshuattio product updates, feature releases, and improvements from 2026.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "archive-header": ArchiveHeader,
  "divider": Divider,
  "workflow-history-and-agent": WorkflowHistoryAndAgent,
  "block": Block,
} as const;

export default async function Page({ searchParams }: PageProps<"/changelog">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><One /></main>;
  }
  // Same frame as the shared shell, but the archive header and the entry list
  // sit in two sibling containers and the list grid itself is the main element.
  return (
    <>
      <div className="flex min-h-screen max-w-screen flex-col justify-between overflow-x-clip">
        <Header />
        <ArchiveHeader />
        <div className="container flex flex-1 flex-col max-lg:contents">
          <div className="flex w-full flex-1 flex-col border-subtle-stroke border-x max-lg:border-none">
            <main className="grid min-h-[60vh] grid-cols-12 grid-rows-[auto_1fr_auto]">
              {Object.entries(SECTIONS)
                .filter(([name]) => name !== "archive-header")
                .map(([name, S]) => <S key={name} />)}
            </main>
          </div>
        </div>
        <Footer />
      </div>
      <CookieBanner />
    </>
  );
}
