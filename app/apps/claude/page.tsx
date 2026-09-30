import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { AppsSearchScope } from "@/components/pages/apps/detail/search-scope";
import { Claude } from "@/components/pages/apps/claude/00-claude";
import { Block } from "@/components/pages/apps/claude/01-block";

export const metadata: Metadata = {
  title: "Claude Integration | Joshuattio",
  description: "Search, manage, and update Joshuattio from Claude",
};

// Top-level blocks of main, in page order. `?only=<name>` renders one block without the shell.
const SECTIONS = {
  "claude": Claude,
  "block": Block,
} as const;

export default async function Page({ searchParams }: PageProps<"/apps/claude">) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><AppsSearchScope backdrop={false}><One /></AppsSearchScope></main>;
  }
  return (
    <SiteShell bare>
      <AppsSearchScope backdrop={false}>
        {Object.entries(SECTIONS).map(([name, S]) => <S key={name} />)}
      </AppsSearchScope>
    </SiteShell>
  );
}
