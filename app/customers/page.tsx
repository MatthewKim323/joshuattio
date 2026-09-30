import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { Customers } from "@/components/pages/customers/00-customers";
import { Block } from "@/components/pages/customers/01-block";
import { Block2 } from "@/components/pages/customers/02-block-2";
import { S83FasterLeadTriage } from "@/components/pages/customers/03-83-faster-lead-triage";
import { Block4 } from "@/components/pages/customers/04-block-4";
import { Block5 } from "@/components/pages/customers/05-block-5";
import { Block6 } from "@/components/pages/customers/06-block-6";
import { Block7 } from "@/components/pages/customers/07-block-7";
import { TheCrmBehindThousands } from "@/components/pages/customers/08-the-crm-behind-thousands";

export const metadata: Metadata = {
  title: "Customers | Joshuattio",
  description: "Discover how thousands of companies use Joshuattio to scale their business.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "customers": Customers,
  "block": Block,
  "block-2": Block2,
  "83-faster-lead-triage": S83FasterLeadTriage,
  "block-4": Block4,
  "block-5": Block5,
  "block-6": Block6,
  "block-7": Block7,
  "the-crm-behind-thousands": TheCrmBehindThousands,
} as const;

export default async function Page({ searchParams }: PageProps<"/customers">) {
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
