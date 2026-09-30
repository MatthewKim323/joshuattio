// The three expert tiers, lowest first.
export type TierVariant = "default" | "gray" | "dark";
export type Tier = { name: string; variant: TierVariant; benefits: string[] };

export const TIERS: Tier[] = [
  {
    name: "Core",
    variant: "default",
    benefits: [
      "Revenue share.",
      "Expert access.",
      "Expert workspace.",
      "Experts Directory listing.",
      "Private Experts community.",
    ],
  },
  {
    name: "Advanced",
    variant: "gray",
    benefits: [
      "All Core benefits.",
      "Experts slack group.",
      "Quarterly business reviews.",
      "Early access to Joshuattio alphas.",
      "Joshuattio team recommendations.",
    ],
  },
  {
    name: "Elite",
    variant: "dark",
    benefits: [
      "All Advanced benefits.",
      "Private slack channel.",
      "Sales team workshops.",
      "Co-marketing opportunities.",
      "Dedicated solutions engineer.",
    ],
  },
];
