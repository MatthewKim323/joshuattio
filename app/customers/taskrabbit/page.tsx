import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { HowTaskrabbitIsScaling } from "@/components/pages/customers/taskrabbit/00-how-taskrabbit-is-scaling";
import { TheCrmBehindThousands } from "@/components/pages/customers/taskrabbit/01-the-crm-behind-thousands";

export const metadata: Metadata = {
  title: "Taskrabbit's Story | Joshuattio",
  description: "How Taskrabbit scales partnerships with Joshuattio.",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "how-taskrabbit-is-scaling": HowTaskrabbitIsScaling,
  "the-crm-behind-thousands": TheCrmBehindThousands,
} as const;

export default async function Page({ searchParams }: PageProps<"/customers/taskrabbit">) {
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
