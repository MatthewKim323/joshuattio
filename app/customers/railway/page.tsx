import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { HowRailwayTurnedUsage } from "@/components/pages/customers/railway/00-how-railway-turned-usage";
import { TheCrmBehindThousands } from "@/components/pages/customers/railway/01-the-crm-behind-thousands";

export const metadata: Metadata = {
  title: "Railway's Story | Joshuattio",
  description: "How Railway turned usage data into revenue with Joshuattio",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "how-railway-turned-usage": HowRailwayTurnedUsage,
  "the-crm-behind-thousands": TheCrmBehindThousands,
} as const;

export default async function Page({ searchParams }: PageProps<"/customers/railway">) {
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
