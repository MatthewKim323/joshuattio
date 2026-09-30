import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { TalkToSales } from "@/components/pages/contact/sales/00-talk-to-sales";
import { TalkToSales1 } from "@/components/pages/contact/sales/01-talk-to-sales-1";

export const metadata: Metadata = {
  title: "Talk to Sales | Joshuattio",
  description: "See how Joshuattio can power your GTM motion with a product expert.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "talk-to-sales": TalkToSales,
  "talk-to-sales-1": TalkToSales1,
} as const;

export default async function Page({ searchParams }: PageProps<"/contact/sales">) {
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
