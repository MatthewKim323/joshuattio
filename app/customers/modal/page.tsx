import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { HowModalUsesJoshuattio } from "@/components/pages/customers/modal/00-how-modal-uses-joshuattio";
import { TheCrmBehindThousands } from "@/components/pages/customers/modal/01-the-crm-behind-thousands";

export const metadata: Metadata = {
  title: "Modal's Story | Joshuattio",
  description: "How Modal uses Joshuattio to accelerate product-led growth.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "how-modal-uses-joshuattio": HowModalUsesJoshuattio,
  "the-crm-behind-thousands": TheCrmBehindThousands,
} as const;

export default async function Page({ searchParams }: PageProps<"/customers/modal">) {
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
