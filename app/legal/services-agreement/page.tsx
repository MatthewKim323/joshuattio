import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { JoshuattioServicesAgreement } from "@/components/pages/legal/services-agreement/00-joshuattio-services-agreement";
import { Block } from "@/components/pages/legal/services-agreement/01-block";
import { Block2 } from "@/components/pages/legal/services-agreement/02-block-2";
import { S1Definitions } from "@/components/pages/legal/services-agreement/03-1-definitions";

export const metadata: Metadata = {
  title: "Services Agreement",
  description: "By logging into your Joshuattio account you agree to be bound by our Services Agreement.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "joshuattio-services-agreement": JoshuattioServicesAgreement,
  "block": Block,
  "block-2": Block2,
  "1-definitions": S1Definitions,
} as const;

export default async function Page({ searchParams }: PageProps<"/legal/services-agreement">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><One /></main>;
  }
  return (
    <SiteShell bare>
      <main className="container pt-10 pb-20 lg:pt-32 xl:pt-40 xl:pb-40">
        {Object.entries(SECTIONS).map(([name, S]) => <S key={name} />)}
      </main>
    </SiteShell>
  );
}
