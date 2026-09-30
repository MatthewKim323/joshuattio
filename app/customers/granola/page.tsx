import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { HowGranolaTurnsProduct } from "@/components/pages/customers/granola/00-how-granola-turns-product";
import { TheCrmBehindThousands } from "@/components/pages/customers/granola/01-the-crm-behind-thousands";

export const metadata: Metadata = {
  title: "Granola's Story | Joshuattio",
  description: "How Granola turns product signals into revenue at scale",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "how-granola-turns-product": HowGranolaTurnsProduct,
  "the-crm-behind-thousands": TheCrmBehindThousands,
} as const;

export default async function Page({ searchParams }: PageProps<"/customers/granola">) {
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
