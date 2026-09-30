import "./legal-nav.css";

// Side list of every legal document; the current one is highlighted.
const DOCS = [
  { href: "/legal/acceptable-use", label: "Acceptable Use" },
  // retitled from the branded name so it wraps like the column expects: one line at 1440, two at 1024
  { href: "/legal/joshuattio-data-processing-addendum", label: "The Data Processing Addendum" },
  { href: "/legal/joshuattio-developer-terms", label: "Joshuattio Developer Terms" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/referral-gift-card-reward-policy", label: "Referral Gift Card Reward Policy" },
  { href: "/legal/services-agreement", label: "Services Agreement" },
  { href: "/legal/terms-and-conditions", label: "Terms and Conditions" },
  { href: "/legal/disclosure-policy", label: "Vulnerability Disclosure Policy" },
];

const LINK =
  "-mx-px rounded-sm px-px underline transition-colors duration-400 hover:duration-150 active:duration-50 decoration-transparent hover:text-link-strong-foreground hover:decoration-link-strong-foreground active:text-link-strong-foreground";

export function LegalNav({ current }: { current: string }) {
  return (
    <aside className="legal-nav flex flex-col gap-y-3 lg:sticky lg:top-[calc(var(--site-header-height)+48px)] lg:self-start">
      {DOCS.map((d) => (
        <a key={d.href} className={`${LINK} ${d.href === current ? "text-link-foreground" : "text-secondary-foreground"}`} href={d.href}>
          {d.label}
        </a>
      ))}
    </aside>
  );
}
