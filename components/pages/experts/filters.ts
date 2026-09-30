// Directory filters, sort options and paging, as the directory defines them.

export type FilterOption = { slug: string; name: string };
export type FilterDef = { slug: "supported-regions" | "expert-location" | "languages" | "expert-tier"; name: string; multiple: boolean; options: FilterOption[] };

export const FILTERS: FilterDef[] = [
  {
    slug: "supported-regions",
    name: "Supported Regions",
    multiple: true,
    options: [
      { slug: "americas", name: "Americas" },
      { slug: "emea-2", name: "EMEA" },
      { slug: "apac", name: "APAC" },
    ],
  },
  {
    slug: "expert-location",
    name: "Expert Location",
    multiple: true,
    options: [
      { slug: "north-america", name: "North America" },
      { slug: "emea", name: "EMEA" },
      { slug: "apac-2", name: "APAC" },
    ],
  },
  {
    slug: "languages",
    name: "Languages",
    multiple: false,
    options: [
      { slug: "armenian", name: "Armenian" },
      { slug: "dutch", name: "Dutch" },
      { slug: "english", name: "English" },
      { slug: "finnish", name: "Finnish" },
      { slug: "french", name: "French" },
      { slug: "german", name: "German" },
      { slug: "greek", name: "Greek" },
      { slug: "italian", name: "Italian" },
      { slug: "latvian", name: "Latvian" },
      { slug: "portuguese", name: "Portuguese" },
      { slug: "russian", name: "Russian" },
      { slug: "spanish", name: "Spanish" },
      { slug: "swedish", name: "Swedish" },
    ],
  },
  {
    slug: "expert-tier",
    name: "Expert Tier",
    multiple: false,
    options: [
      { slug: "elite", name: "Elite" },
      { slug: "advanced", name: "Advanced" },
      { slug: "core", name: "Core" },
    ],
  },
];

export type SortValue = "name" | "tier" | "tier_reviews" | "rating" | "reviews";
export const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "name", label: "Name (A-Z)" },
  { value: "tier", label: "Tier" },
  { value: "tier_reviews", label: "Tier and review count" },
  { value: "rating", label: "Top rated" },
  { value: "reviews", label: "Reviews" },
];
export const DEFAULT_SORT: SortValue = "tier_reviews";

export const TIER_ORDER: Record<string, number> = { Elite: 0, Advanced: 1, Core: 2, Untiered: 3 };

/** Page size for "Load more results". */
export const PAGE_SIZE = 11;

/** Query parameter names the directory keeps in the url. */
export const QUERY = { page: "page", search: "search", sort: "sort", available: "only-experts-available" } as const;

export const PLACEHOLDER_MULTIPLE = "Select options";
export const PLACEHOLDER_SINGLE = "Select an option";
