export type Photo = { src: string; srcSet: string; width: number; height: number };

export type Testimonial = {
  id: string;
  name: string;
  countryCode: string;
  subtitle: string;
  quote: string;
  /** Shorter wording below md, where the brand name would push the quote onto a ninth line. */
  mobileQuote?: string;
  photo: Photo;
};

function photo(file: string, width: number, height: number, retina = true): Photo {
  const src = `/img/${file}.avif`;
  return { src, srcSet: retina ? `${src} 1x, ${src} 2x` : `${src} 1x`, width, height };
}

// Expert partner quotes, in their authored order (the avatar grid fills from the center out).
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "99787826-f74f-4180-9d30-816146d5fe63",
    name: "Giacomo",
    countryCode: "FR",
    subtitle: "Novlini",
    quote:
      "Joshuattio is built around a thoughtful UX that adapts to how fast-moving teams actually work. At Novlini, Joshuattio gives us a product powerful enough to design flexible RevOps systems.",
    photo: photo("img-f3de5cc8fa", 800, 800),
  },
  {
    id: "4c6ef0af-957e-4503-a140-29b3f789e8b0",
    name: "Nacho",
    countryCode: "DE",
    subtitle: "5050 Growth",
    quote:
      "Joshuattio moves at founder-speed. As an Expert partner, it lets me build automated GTM engines that connect to my clients' entire stack in days, not months.",
    photo: photo("img-cca250f997", 2000, 2000),
  },
  {
    id: "43ca5ea5-346c-491b-9b76-107b2bf52ea4",
    name: "Jason",
    countryCode: "US",
    subtitle: "Neon Deer Data Labs",
    quote:
      "We joined the Joshuattio partner program in December 2024, and it's quickly become the core of our business. We've grown the team to keep up with demand, and the Joshuattio team has been there the whole way. ",
    photo: photo("img-7404179764", 2803, 2803, false),
  },
  {
    id: "35b0d1a6-df7a-4e39-813a-c24cdc2e335f",
    name: "Daniel",
    countryCode: "GB",
    subtitle: "80x",
    quote:
      "The Experts program is more than a channel partnership - it's a wellspring of ideas at the frontier of CRM, where Joshuattio and its network of partners are shaping what this category becomes.",
    photo: photo("img-56cdc4d737", 800, 800),
  },
  {
    id: "714ba9e9-95a7-4129-aa03-43825c96f711",
    name: "Marco",
    countryCode: "IT",
    subtitle: "Mindstone Consulting",
    quote:
      "Joshuattio stands out as a CRM because it’s flexible and truly enables scalable growth. Being an Joshuattio Expert lets me collaborate with a great team and deliver solutions that go beyond what other CRMs can offer.",
    photo: photo("img-54126a468a", 769, 1024),
  },
  {
    id: "de5845e3-89f8-4612-b9bb-a056a7755396",
    name: "Alex",
    countryCode: "US",
    subtitle: "Attimize",
    quote:
      "I like Joshuattio because it delivers an exceptional user experience. The Experts program lets me help founders stand up clean reporting and dashboards quickly, without the complexity and overhead.",
    photo: photo("img-06586a3356", 500, 500),
  },
  {
    id: "57de9ea6-0a8e-438a-b4f0-0a073c1f80ae",
    name: "Alex",
    countryCode: "GB",
    subtitle: "Working Mono",
    quote:
      "As a founding Expert partner, we've deployed Joshuattio for dozens of AI-native companies. When we replaced our stack with custom AI tooling, Joshuattio was the only platform we kept. ",
    photo: photo("img-9fc2b6a364", 800, 800),
  },
  {
    id: "4d709891-c5c3-4100-9974-f12c7a7d78de",
    name: "Nick",
    countryCode: "GB",
    subtitle: "Fifty One Degrees",
    quote:
      "Fifty One Degrees is proud to be an Joshuattio Expert, supporting firms to implement Joshuattio for their client data. With Joshuattio, we support businesses to improve customer experience and close more sales.",
    photo: photo("img-049d036d1e", 497, 674),
  },
  {
    id: "e573bc10-1529-4896-ac62-82505603f50f",
    name: "Nick",
    countryCode: "US",
    subtitle: "Dialed Technologies",
    quote:
      "Partnering with Joshuattio has been transformative for our business. Joshuattio's SDK has enabled us to build solutions for unique industries. What stands out most is the team's commitment to partner success.",
    mobileQuote:
      "Partnering with Joshuattio has been transformative for our business. Its SDK has enabled us to build solutions for unique industries. What stands out most is the team's commitment to partner success.",
    photo: photo("img-a3b4b6eda8", 5568, 3712, false),
  },
  {
    id: "00e38859-2039-4359-86fe-c17f004432b6",
    name: "Kayla",
    countryCode: "CA",
    subtitle: "Revautex",
    quote:
      "I’ve had an excellent experience as an Joshuattio Expert partner. The Joshuattio team actively listens to partner feedback, and the Experts Directory has become a reliable source of inbound work.",
    photo: photo("img-ed85bc61db", 400, 400),
  },
  {
    id: "a1fe055e-a217-4ba8-8ae0-1422beb9ee2e",
    name: "Ben",
    countryCode: "AU",
    subtitle: "Crawl Walk Run",
    quote:
      "Despite being on the other side of the planet, it’s impossible to miss the energy radiating from the Joshuattio team. I’ve felt truly supported with deal collaboration. I’m excited for everything we’ll achieve together.",
    photo: photo("img-b6bbd5848b", 561, 561),
  },
  {
    id: "43a40c2e-07ad-4502-90af-411b0ac0ab2a",
    name: "Alfie",
    countryCode: "GB",
    subtitle: "Alaiso",
    quote:
      "Since partnering with Joshuattio, I've been able to deliver end-to-end GTM systems. But the real difference is the team behind it. With direct access to solutions engineers, they genuinely care about helping us win. ",
    mobileQuote:
      "Since partnering with Joshuattio, I've been able to deliver end-to-end GTM systems. But the real difference is the team behind it. With direct access to solutions engineers, they care about helping us win. ",
    photo: photo("img-573cddeb0a", 1875, 1875),
  },
  {
    id: "d73e36dc-a6b6-4381-802d-7cc4333dd42a",
    name: "Joe",
    countryCode: "CA",
    subtitle: "The Workflow Company",
    quote:
      "Joshuattio is the most extensible CRM in the market. It pairs especially nicely with AI-native GTM systems as you can build a revenue engine that’s custom-tailored to your specific business context.",
    photo: photo("img-7d5fb616c7", 1513, 1513),
  },
  {
    id: "7200468a-cb5f-44c1-ac55-916ca8e8b300",
    name: "Luke",
    countryCode: "US",
    subtitle: "Good Steward Network",
    quote:
      "As an Joshuattio Expert, I love using Joshuattio because it does exactly what great systems should do - it redeems time. We’re able to replace manual work with a CRM that actually adapts to how people think and operate.",
    photo: photo("img-e638b9d7dc", 3060, 2786, false),
  },
  {
    id: "80a9b68d-dc20-432b-b6dc-9305c3142534",
    name: "Maxime",
    countryCode: "FR",
    subtitle: "Kops",
    quote:
      "Being an Joshuattio Expert connects us with teams that bring a clear long-term vision. The partner program helps us stay at the highest technical standard, and the product itself is built to scale for the next decade.",
    photo: photo("img-a8b5c7eba0", 1000, 1000),
  },
  {
    id: "9f3e5bf2-f555-4c6f-a1b7-62791d2e7b31",
    name: "Will",
    countryCode: "GB",
    subtitle: "Sideways CRM",
    quote:
      "Joshuattio makes my clients' lives simpler. I'm able to design setups that perfectly suit my clients' way of doing business, making it significantly easier for them to grow.",
    photo: photo("img-e1170d74fc", 710, 710),
  },
  {
    id: "edb8ab5a-5603-4c70-9ac3-072246809ae2",
    name: "George",
    countryCode: "US",
    subtitle: "Crafft",
    quote:
      "My experience with the Experts program started very smoothly. The most important thing is to deliver the best service you can to clients. If you do this, the Joshuattio team will help you with all incoming requests.",
    photo: photo("img-d434d061b6", 640, 640),
  },
];
