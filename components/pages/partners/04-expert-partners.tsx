import { QuotesAccordion, type PartnerQuote } from "./shared/quotes-accordion";

const QUOTES: PartnerQuote[] = [
  {
    name: "Riya Grover",
    role: "Co-founder & CEO, Sequence",
    company: "Riya",
    overline: "App Partners",
    quote:
      "Joshuattio’s developer experience is a breath of fresh air. The team is outstanding to work with, we’re thrilled for Sequence to be part of the Joshuattio App store.",
    avatar: "/img/img-5f2bde2111.avif",
    features: [
      { title: "Deals", icon: "/img/img-11c6bb5901.svg" },
      { title: "Workflows", icon: "/img/img-7e5cf1b1c4.svg" },
      { title: "Notes", icon: "/img/img-a28d770140.svg" },
    ],
  },
  {
    name: "Daniel Hull",
    role: "Founder, 80x",
    company: "Daniel",
    overline: "Creator Partners",
    quote:
      "The Joshuattio creator program is a wellspring of new connections, genuine inspiration, and next-gen GTM insight I haven’t found elsewhere.",
    avatar: "/img/img-baa3b71f42.avif",
    features: [
      { title: "Workflows", icon: "/img/img-7e5cf1b1c4.svg" },
      { title: "Integrations", icon: "/img/img-e58140b2ee.svg" },
      { title: "Communication intelligence", icon: "/img/img-62ee6b955f.svg" },
    ],
  },
  {
    name: "Giacomo Caranese",
    role: "Co-founder, novlini",
    company: "Giacomo",
    overline: "Expert Partners",
    quote:
      "Joshuattio connects me with teams that value speed, structure, and scale. Building flexible, high-impact systems on such a powerful product is a pleasure.",
    avatar: "/img/img-8eb82ba96b.avif",
    features: [
      { title: "Email & calendar sync", icon: "/img/img-2af8ff007e.svg" },
      { title: "API", icon: "/img/img-85c0c2f66a.svg" },
      { title: "Mobile app", icon: "/img/img-0c24436279.svg" },
    ],
  },
];

export function ExpertPartners() {
  return <QuotesAccordion quotes={QUOTES} initialIndex={2} />;
}
