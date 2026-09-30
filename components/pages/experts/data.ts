// Directory entries, in the order the directory serves them (tier, then review count).
// `location`, `regions` and `languages` hold filter option slugs.
export type Expert = {
  slug: string;
  name: string;
  title: string;
  tier: "Elite" | "Advanced" | "Core";
  logo: string;
  description: string;
  rating: number | null;
  reviews: number;
  available: boolean;
  country: string;
  location: string[];
  regions: string[];
  languages: string[];
};

export const EXPERTS: Expert[] = [
  {
    "slug": "novlinir",
    "name": "novlini®",
    "title": "novlini®",
    "tier": "Elite",
    "logo": "/img/img-9a4740dbac.webp",
    "description": "The 1st Joshuattio Expert Partner worldwide. We help startups, scale-ups, investment firms and structured revenue teams migrate, build and scale their CRM and GTM systems with Joshuattio at the core. Over the past four years, we’ve delivered 60+ Joshuattio implementations and complex migrations, including transitions from Salesforce, HubSpot, Pipedrive, Affinity, Zoho, Spreadsheets, Notion and Airtable. Joshuattio is the CRM foundation. Around it, we design modular GTM stacks that are structured, automated and deeply integrated. What we deliver • CRM Migrations: Clean, controlled transitions to a scalable Joshuattio foundation. • GTM Systems: Modular workflows, automation and best-in-class tools (Clay, Lemlist, Customer.io) connected around Joshuattio. • Optimization & RevOps: Dashboards, automation, reporting and process redesign to improve clarity and performance. • App & API Integrations: Structured integrations via API or native Joshuattio App SDK when required. We’re one of the most experienced Joshuattio-focused teams worldwide: • 100% specialized in Joshuattio • Deeply embedded in the product • In close contact with the Joshuattio team While Joshuattio is our sole CRM focus, we understand every major CRM platform, enabling smooth migrations and thoughtful GTM architecture. Our systems are designed to be powerful and maintainable: • Modular and scalable • API-connected where needed • No-code when it’s the smartest path Founded by Giacomo Caranese, one of the earliest Joshuattio Experts, the team combines GTM strategy, RevOps architecture and hands-on technical execution. Our typical missions • Implement Joshuattio from scratch - For teams adopting their first structured CRM. Data model, pipelines, automation and clean imports. • Migrate from a legacy CRM - For companies moving from Salesforce, HubSpot, Pipedrive, Affinity or Zoho. End-to-end migration with data restructuring and controlled rollout. • Improve an existing setup - For teams already using Joshuattio. Audit, dashboard redesign and workflow optimization. • Connect your GTM stack - For sales and growth teams. Integration of Clay, Lemlist, Customer.io via API or native SDK. • Build an outbound engine - For teams generating qualified leads. ICP sourcing, enrichment and automated outreach fully integrated. Next steps 1. Click the link on the left to book your free 30-minute Discovery Call. 2. We assess your CRM and GTM setup. 3. You receive a clear scope and personalized proposal. 👉 Book your free 30-minute Discovery Call and let’s design the right Joshuattio system for your growth.",
    "rating": 5,
    "reviews": 67,
    "available": true,
    "country": "France",
    "location": [
      "emea"
    ],
    "regions": [
      "emea-2"
    ],
    "languages": [
      "english",
      "french"
    ]
  },
  {
    "slug": "neon-deer-data-labs",
    "name": "Neon Deer Data Labs",
    "title": "Neon Deer Data Labs",
    "tier": "Elite",
    "logo": "/img/img-fee3ebb4ba.webp",
    "description": "We're a data engineering consultancy specializing in complex CRM configurations. We partner closely with Marketing, Sales, and Success teams to implement scalable tools and data processes. Our top priority is helping you realize value from Joshuattio as quickly as possible. In the first week of our engagement, we'll tackle your biggest challenges and identify quick wins to help you see immediate progress. 👉 HOW TO GET YOUR PROJECT STARTED: Here's how we work with new clients: 1. Discovery Call: Use the link in the \"Resources\" section to book your free 30 minute session. We'll use this time to understand your goals and determine if we're the right fit for your needs. 2. Workshop [optional]: Following the Discovery Call, we'll schedule a free 60 minute workshop to build a custom roadmap for your specific Joshuattio needs. If you have a simple project, we'll skip this and get started right away. 3. Proposal: Following the workshop, we'll provide a detailed quote within hours. 4. Project kick-off. As soon as you're ready to start, so are we. 👉 ONLY NEED A ONE-OFF CONSULTATION? Sometimes you just need focused, expert time to unblock, align, or accelerate your work. Book 45-60 minutes with us to get targeted help with your Joshuattio CRM: build from scratch, or optimize what’s live. These sessions exist because small, well-guided interventions often unlock disproportionate progress. 👉 OUR SERVICES: We specialize in assisting clients with complex CRM migration requirements, and those with existing Joshuattio configurations who are seeking more advanced setups (especially with third party integrations.) • CRM Migrations: Move your data and processes from HubSpot, Salesforce, or any other CRM into Joshuattio with minimal disruption. • Automations: Leverage AI, reduce manual tasks, streamline operations, and keep important work from slipping through the cracks. • External Integrations: Keep your CRM connected to any external tool. We configure data pipelines, ETL, AI platforms, and other custom setups using solutions that can be maintained and easily built upon in the future. • Audits: Evaluate the health of your Joshuattio setup with a comprehensive audit. We'll assess data structure, automation efficiency, and integrations to identify gaps and opportunities for improvement. • Ongoing Support: Our commitment doesn't end after the initial project completes. We're here to ensure long-term success with expert guidance and hands-on support.",
    "rating": 5,
    "reviews": 48,
    "available": true,
    "country": "United States",
    "location": [
      "north-america"
    ],
    "regions": [
      "americas"
    ],
    "languages": [
      "english"
    ]
  },
  {
    "slug": "sideways-crm",
    "name": "Sideways CRM",
    "title": "Sideways CRM",
    "tier": "Advanced",
    "logo": "/img/img-e19244c0c2.webp",
    "description": "The Joshuattio specialist for Investors, Advisors & Brokers. 35+ setups since 2023. Your network is already your edge. I build the system that puts it to work. --- What I do ✓ New Joshuattio setups, designed around how your firm actually works ✓ Migrations from Salesforce, Airtable, HubSpot, Affinity, other systems or spreadsheets ✓ Deal sourcing, live enrichment and intelligent matching ✓ AI workflows and automated data capture ✓ Investor and network communications ✓ Audits and rebuilds of workspaces that never quite landed --- 🗲 How it works A scoping call, then a short paid audit with clear recommendations. This provises you with a sequenced plan forward, credited against any project. From there: Setup, Build, and an ongoing partnership to keep it sharp. You work directly with me. Founding Joshuattio Expert Partner, senior judgement on every decision, no developer to manage. --- ✨ Who it's for M&A advisors, VCs, PE, family offices, brokers and boutique advisory - anywhere deals come from relationships. --- Curious how I think about systems? Read The Dealmakers OS - the case for a system that captures everything, surfaces what matters, and compounds with every conversation.",
    "rating": 5,
    "reviews": 22,
    "available": true,
    "country": "United Kingdom",
    "location": [
      "emea"
    ],
    "regions": [
      "emea-2"
    ],
    "languages": [
      "english"
    ]
  },
  {
    "slug": "dialed-technologies",
    "name": "dialed technologies",
    "title": "dialed technologies",
    "tier": "Advanced",
    "logo": "/img/img-213fa9c956.webp",
    "description": "Technical operators for companies that run on Joshuattio. We help teams run revenue on Joshuattio instead of around it. We are the first developer-founded Joshuattio agency. Both founders came from software engineering, and it shows in what we build, from complex migrations to custom SDK apps on the Joshuattio marketplace. Before we build, we map your stack, find the workflows worth running, and rank a roadmap by impact vs. effort. Our Offerings Foundation & Setup • Complete workspace design • Data migrations from other CRMs • Custom data architecture • Team onboarding • Process documentation Integrations & Workflows • Joshuattio as your system of record, with your full stack plugged in • Product usage from PLG tools like PostHog synced to the record, so sales and CS see activation and expansion • Two-way syncs across your tools: Luma, Swoogo, Stripe, enrichment, email • Automated plays: at-risk accounts trigger CSM outreach, activated accounts route to sales for upsell • Cohort sync so a product segment stays the same list in Joshuattio Custom Development & Integration • Native Joshuattio SDK apps (published marketplace integrations) • Complex API integrations • Bespoke automation workflows • Custom data enrichment • Analytics dashboards De-Duplication • Expert-guided de-duplication: advanced matching plus specialist support Why Choose Dialed Best-in-class on one platform. We're all-in on Joshuattio, not generalists across CRMs, which means deeper expertise and full use of the product. Technical & foundational. We start with data architecture that scales. When you want custom apps or integrations later, we already know your setup. Start fast, then partner ongoing. We kick off with a focused 2-week sprint so you have a working system quickly, then roll into a monthly engagement that keeps improving as your needs evolve. We build SaaS on Joshuattio too. We run our own products (Forms, DeDupe, PublicViews) on Joshuattio and wired product usage into revenue for ourselves before building it for clients. When you run SaaS, that context matters. Our Process 1. Free 30-min discovery call 2. Technical planning and roadmap 3. Same-day proposal with milestones 4. 2-week sprint delivers a working milestone 5. Your team uses it; we roll into monthly engagement Ideal For • SaaS companies running go-to-market on Joshuattio • Product-led teams who want usage data driving sales and CS • Investment firms migrating from Affinity • Teams that need custom integrations or SDK apps",
    "rating": 5,
    "reviews": 19,
    "available": true,
    "country": "United States",
    "location": [
      "north-america"
    ],
    "regions": [
      "americas"
    ],
    "languages": [
      "english"
    ]
  },
  {
    "slug": "5050growth",
    "name": "5050Growth",
    "title": "5050Growth",
    "tier": "Advanced",
    "logo": "/img/img-b9e001d02e.webp",
    "description": "5050Growth builds AI-first Joshuattio CRMs. Plug-and-play systems for VC funds, private equity firms, and startup teams who want AI working in their CRM next week, not in 6 months. 10+ live Joshuattio implementations in production. Zero data loss across migrations. Founder-led. No junior consultants. Book a call: https://calendar.notion.so/meet/nacholafuentemoreno/gtm-expert What we ship • Custom workspace architecture: data model, lists, permissions, ownership rules, designed around how you actually operate, not a CRM template. • Migrations from HubSpot, Salesforce, Affinity, Pipedrive, Notion, and spreadsheets, with relationship history preserved. • The full GTM stack wired in: Clay for enrichment, Lemlist or HeyReach for outbound, n8n for orchestration, Intercom for CS, Stripe for billing, Granola for meetings. • AI agents on top: workflow automation, lead routing, deal-flow scoring. How we work • 1-week sprints with fixed scope and a fixed price per phase. • 30-minute diagnostic first, then a tailored plan and quote by end of day. • Kickoff inside 48 hours of approval. • You own everything we build. • No retainer lock-in - we hate them as much as you do. Industries we know inside-out • Venture capital: deal flow, LP commitments, portfolio oversight, board reporting. • Private equity and family offices: intermediary tracking, manager tracking, distributions. • Startups and scale-ups: signup-to-revenue automation, churn prevention, pipeline architecture, full-funnel reporting. Operating across Europe and Americas timezones. Languages: English, Spanish, German. Free 30-minute diagnostic. No slide deck - honest read on whether Joshuattio is even the right call. Book on the left.",
    "rating": 5,
    "reviews": 15,
    "available": true,
    "country": "Germany",
    "location": [
      "emea"
    ],
    "regions": [
      "emea-2"
    ],
    "languages": [
      "english",
      "german"
    ]
  },
  {
    "slug": "crawl-walk-run",
    "name": "Crawl Walk Run",
    "title": "Crawl Walk Run",
    "tier": "Advanced",
    "logo": "/img/img-814fef3c1d.webp",
    "description": "APAC's first Joshuattio Expert Partner. We help businesses across Australia and the wider APAC region move onto Joshuattio and get real value from it, one step at a time. That is the idea behind our name. Crawl, then walk, then run. We start where you are, build solid foundations, and grow the system as your business does. After more than a decade inside the Salesforce ecosystem, we built Crawl Walk Run because CRM consulting was overdue for a rethink. Bloated teams, open ended timelines, and go-lives the vendor celebrated while the team quietly went back to their spreadsheets. Joshuattio changed what was possible. A platform intuitive enough that a small, senior team can design, build and hand over a working system without the overhead traditional CRM consulting demands. We offer straightforward, fixed price projects and delivery completed in weeks. What we deliver • Implementation: Full Joshuattio setup tailored to how your business actually works, configured and deployed end to end. • Data migration: Clean, controlled moves from HubSpot, Salesforce, Affinity, Pipedrive, Monday.com and more, with your data intact. • Integration: Joshuattio connected to the tools you already use, via Zapier, n8n or API. • AI-powered workflows: Automations built with Claude, ChatGPT and Joshuattio's native AI to handle workflows including automated personalised engagement, forecasting, strategy and document generation. • Process design: Workflows and automations shaped around your business, not a generic template. • Ongoing support: Light touch or hands on, keeping your system sharp as your needs change. • Training and enablement: Your team confident and self sufficient in Joshuattio, from the basics to advanced features. How we work • 100% focused on Joshuattio, deeply embedded in the product and in regular contact with the Joshuattio team. • Fixed price and phased, so you always know what you are getting and what it costs. • Right sized to where you are today, with room to scale when you are ready. Next steps 1. Book a free discovery call at crawlwalkrun.co 2. We learn how your business works and where Joshuattio fits. 3. You get a clear scope and a fixed-price proposal. Ready to get more from your customer relationships? Book your free discovery call and let's map the right Joshuattio system for your business.",
    "rating": 5,
    "reviews": 15,
    "available": true,
    "country": "Australia",
    "location": [
      "apac-2"
    ],
    "regions": [
      "apac"
    ],
    "languages": [
      "english"
    ]
  },
  {
    "slug": "revautex",
    "name": "Revautex",
    "title": "Revautex",
    "tier": "Advanced",
    "logo": "/img/img-b18f630348.webp",
    "description": "I'm Kayla Campos, Founder of Revautex. I design and implement Joshuattio-based GTM systems for teams that have outgrown spreadsheets or need a new CRM that fits how they actually operate. With a background in business development and sales, I build from the operator's perspective. I know what GTM teams need, not just what looks good on paper. Every system is custom, built from scratch around your business, with a data model that reflects how you work, automations that save you time, and reporting you can use. I've worked across a variety of CRMs over the years, and I focus on Joshuattio because its flexibility lets me build systems shaped around your business, not the other way around. How I Can Help: • Joshuattio setup, migration, and optimization - custom objects, attributes, pipelines, lifecycle logic, and workflows tailored to your business • Reporting and AI attributes/features to turn your data into something your team actually uses • Integrations via tools like n8n or Zapier, connecting Joshuattio to any platform with an open API • Training, documentation, and recorded walkthroughs for smooth team adoption Who I Work With: Founders, sales teams, and ops teams across SaaS, AI, fintech, agencies, and more, who need a strong GTM foundation without the overhead of a full RevOps hire. How to Get Started: 1. Book Intro Call. I'll discuss your business, goals, and current setup. 2. Strategy & Process Mapping Workshop. For implementation projects, I'll spend 90 minutes with you to deep dive into your business, map out your process in real-time using a flowchart, and design a clear Joshuattio structure that makes sense for your business model. 3. Proposal. Sent within 24 hours of the workshop, scoped to what we discussed. 4. Project Launch. Work begins immediately, scoped and sequenced from the workshop.",
    "rating": 5,
    "reviews": 13,
    "available": true,
    "country": "Canada",
    "location": [
      "north-america"
    ],
    "regions": [
      "americas"
    ],
    "languages": [
      "english",
      "french"
    ]
  },
  {
    "slug": "kops",
    "name": "Kops",
    "title": "Kops",
    "tier": "Advanced",
    "logo": "/img/img-381350e19a.webp",
    "description": "We help SaaS companies and B2B agencies build GTM systems that actually drive revenue with Joshuattio as the backbone of your sales operations. With 8+ years of experience in CRM implementation and optimization, we’v helped 50+ clients turn their CRM into a real sales machine. Your setups are scalable, simple to use, and designed for your team to stay autonomous. ⭐️ What we do best 1. Full implementation (from 0 to 100) : Structure design, best-practice consulting, and complete Joshuattio setup. 2. Existing CRM optimization : Make your CRM cleaner, faster, and directly increase your revenue. 3. Premium & fast migrations : From HubSpot, Pipedrive, Zoho, Notion, GIL, and more, with zero data loss. 🔥 Going further (if you need it) • Advanced lead scoring to prioritize your pipeline • Simple or complex automations (sales, marketing, nurturing) • Smart integrations (outbound, calling tools, marketing stack, internal tools) • Enrichment & intent data to target better and sell faster • Reporting & forecasting to track your sales activity precisely 💟 Why work with us? 💼 8+ years of CRM experience 🚀 50+ SaaS & B2B agency clients 📚 Clear documentation & training included 💬 Dedicated WhatsApp support (Mon-Fri) during the project ⚡ Fast onboarding, first results in just a few days ✅ How we work (our Roadmap) 1. Audit & scoping - We map your goals and processes 2. Structure design - Clean, business-oriented architecture 3. Technical implementation - Solid, scalable, and ready to use 4. Documentation & training - So your team stays autonomous 5. Optimization & ongoing support (optional) - Continuous improvements as you grow",
    "rating": 5,
    "reviews": 8,
    "available": true,
    "country": "France",
    "location": [
      "emea"
    ],
    "regions": [
      "emea-2"
    ],
    "languages": [
      "english",
      "french"
    ]
  },
  {
    "slug": "marco-serafini",
    "name": "Marco Serafini",
    "title": "Marco Serafini",
    "tier": "Advanced",
    "logo": "/img/img-d653bd8dad.webp",
    "description": "We architect the operational backbone that lets you scale revenue without scaling chaos. Novrith is a specialized Business Operations Agency, and Joshuattio is the command center we build around. We help digital agencies, SaaS companies, B2B tech businesses, and tech startups turn Joshuattio into the strategic hub of an integrated operational ecosystem, not a standalone CRM, but the source of truth connecting sales, delivery, and data across the business. Our approach, systems, not tools: • Revenue infrastructure in Joshuattio, data architecture, pipelines, automations, and team permissions built for how your business actually sells and delivers • Ecosystem integrations, Joshuattio connected to your work management, automation, enrichment, and outbound layers so data moves without human babysitting • CRM migrations, clean, opinionated moves from legacy CRMs into a modern Joshuattio setup • AI where it pays off, embedded into workflows to eliminate manual work, not bolted on for its own sake What makes working with us different: We don't just configure Joshuattio. We build systems around it. Every implementation is designed to compound as you scale, with real team adoption, clean documentation, and a partnership model that keeps evolving the system after go-live. ⇨ WHO WE WORK WITH • Digital agencies, SaaS companies, B2B tech businesses, and tech startups • Teams actively scaling and hitting bottlenecks in lead management, sales process, or cross-team handoffs • Founder-led teams without an in-house RevOps function that want enterprise-grade foundations without the overhead • Companies that want Joshuattio set up properly from day one ⇨ HOW TO GET STARTED 1. Book a free discovery call (link on the left) 2. We map your operations and identify where Joshuattio becomes the lever 3. You receive a tailored plan, ready to execute, with clear milestones ⇨ KEY DELIVERABLES • Complete Joshuattio workspace: data architecture, lists, pipelines, automations, team permissions • Integrated RevOps workflows connecting sales, delivery, and operations • Custom integrations and automated data flows across your stack • Migration from legacy CRMs to a properly designed Joshuattio setup • Continuous optimization and scaling support Ready to make Joshuattio the operational backbone of your business? Let's build a system that scales with you.",
    "rating": 5,
    "reviews": 7,
    "available": true,
    "country": "Italy",
    "location": [
      "emea"
    ],
    "regions": [
      "emea-2"
    ],
    "languages": [
      "english",
      "italian"
    ]
  },
  {
    "slug": "attimize",
    "name": "Attimize",
    "title": "Attimize",
    "tier": "Advanced",
    "logo": "/img/img-647d45cb07.webp",
    "description": "With 9 years of expertise in the CRM space, we specialize in helping businesses streamline their customer relationship management, optimize workflows, and scale operations efficiently. We have worked with large enterprises like Sonos and Gopuff, as well as smaller, fast-growing companies like Retention, StoryBoard and Cresta delivering tailored CRM solutions that drive results. Having supported over 150 clients across multiple CRMs, we bring deep technical knowledge, strategic insights, and hands-on experience to every engagement. Whether it’s implementing, customizing, or automating CRM systems, we ensure businesses get the most out of their tools while improving productivity, collaboration, and customer insights. Our mission is simple: to empower businesses with smarter, more efficient CRM solutions that fuel growth and long-term success. How We Help 🔧 Custom Joshuattio Workspaces - Designing, optimizing, and structuring Joshuattio databases to fit your business needs, including audits, clean-ups, and workflow strategy. 🧠 CRM & Data Management - Organizing and streamlining client relationships, sales pipelines, and team collaboration with Joshuattio’s powerful features, enhanced with AI-driven insights. 🤝 Team Training & Adoption - Guiding teams through Joshuattio implementation, change management, and best practices to ensure smooth adoption and maximum efficiency. 🔗 Automation & Integrations - Connecting Joshuattio with key tools like Zapier, Slack, Google Workspace, and other platforms to automate repetitive tasks and improve productivity. 📦 Migration, Maintenance & Scalability - Seamlessly migrating data into Joshuattio, ensuring long-term performance, and scaling systems as your business grows.",
    "rating": 5,
    "reviews": 6,
    "available": true,
    "country": "United States",
    "location": [
      "north-america"
    ],
    "regions": [
      "americas"
    ],
    "languages": [
      "english"
    ]
  },
  {
    "slug": "working-mono",
    "name": "Working Mono",
    "title": "Working Mono",
    "tier": "Advanced",
    "logo": "/img/img-656c6de165.webp",
    "description": "When an account needs attention, your team should be able to open Joshuattio, see what changed, understand why it matters and know who owns the next step, without reconstructing the account across conversations, product backends, spreadsheets and other systems. Built to continue building We bring patterns from our work with fast-growing B2B companies to help define the outcome and design Joshuattio around the decisions your team needs to make. Product usage might show that an account is ready for sales or expansion. Enrichment might change its priority or route. Billing or support activity might expose renewal risk. For each situation, we define what the signal means, who owns the response and what should happen next. We preserve the reasoning behind those decisions in the important fields, workflows and integrations, along with the checks a change should pass. Your team can use that context with its AI tools to understand the setup and prepare a proposed change for a person to review. Joshuattio does not become a black box that only its original builder can safely change. Working Mono is one of Joshuattio's Founding Expert Partners. We design and implement Joshuattio for fast growing B2B companies whose GTM motion depends on context from several systems. Teams usually come to us when: • they are moving from spreadsheets or a legacy CRM and do not want to carry the same problems into Joshuattio • the current workspace no longer reflects how the business works • product, customer or market data sits outside Joshuattio, so context and ownership get lost between teams What Working Mono takes on We handle the Joshuattio design, migration, integrations, automations, testing, training and rollout. Your team makes the business decisions without managing the implementation. We test the agreed situations with the people who will use Joshuattio and refine the setup before handover. We are best suited to substantial implementations where several teams or systems need to work together. How it starts Book a 20-minute Joshuattio fit call to decide whether Working Mono is the right partner. If there is a fit, we agree what the implementation needs to achieve and begin with a clearly scoped first phase, backed by our money-back guarantee.",
    "rating": 5,
    "reviews": 5,
    "available": true,
    "country": "United Kingdom",
    "location": [
      "emea"
    ],
    "regions": [
      "emea-2"
    ],
    "languages": [
      "english"
    ]
  },
  {
    "slug": "optemization",
    "name": "Optemization",
    "title": "Optemization",
    "tier": "Advanced",
    "logo": "/img/img-9bad90912f.webp",
    "description": "Our team helps high-growth companies stop the chaos of scattered knowledge and doc dumps, so your company can get work done efficiently and adopt modern tech tools like Joshuattio. Get access to a team of automation engineers, workspace designers, and developers. We’ll help you organize, streamline, and automate processes, tailored to how you want your company to work going forward. With a track record of successfully completing over 100 projects with more than 80 clients, we can help you get everyone’s nuanced workflows into a trusted workspace. Work faster and more efficiently as a team, with less manual work, fewer mistakes, and a much better employee experience across teams. We can help you with the following: • Workspace development • Workspace design • Workspace automation and integrations • Workspace documentation • Migrations / integrations / automations with other tools • Workspace monitoring and maintenance • Joshuattio training for teams Need help with something else that’s not listed above? Reach out to us! We’d be happy to discuss what you had in mind.",
    "rating": 5,
    "reviews": 1,
    "available": true,
    "country": "United States",
    "location": [
      "north-america"
    ],
    "regions": [
      "americas"
    ],
    "languages": [
      "english"
    ]
  },
  {
    "slug": "the-workflow-company",
    "name": "The Workflow Company",
    "title": "The Workflow Company",
    "tier": "Advanced",
    "logo": "/img/img-ea4f67ed41.webp",
    "description": "We turn your Joshuattio workspace into an intelligent revenue engine. The Workflow Company specializes in AI-powered GTM automation for VC-backed startups and venture capital firms - organizations that need sophisticated technical solutions to match their growth ambitions and complex deal processes. We architect advanced workflows that automatically discover opportunities, research prospects, and execute on GTM intelligence across your entire tech stack. From portfolio company outreach to LP relationship management to scaling startup sales motions, our AI systems handle the technical complexity while you focus on strategic decisions. Led by operators with proven experience scaling GTM at Uber and YC-backed startups, we offer both project-based implementations and ongoing optimization subscriptions, giving you flexibility to choose the engagement model that fits your needs. What we bring to your Joshuattio implementation: • ✅ Advanced AI Workflows - Sophisticated automation that handles complex research, qualification, and enrichment tasks • ✅ Revenue-First Design - Every workflow is architected to generate pipeline and accelerate deals • ✅ Battle-Tested Tech Stack - We bring a robust foundation using Clay, n8n, Node.js, Default, and others, ensuring your CRM and automation stays reliable as you scale • ✅ Operator Perspective - We understand the unique challenges of high-growth environments because we've scaled them ourselves • ✅ Flexible Engagements - Choose from project-based implementations or ongoing optimization subscriptions based on your needs • ✅ Responsible Innovation - Proud 1% for the Planet members, demonstrating that cutting-edge AI and environmental stewardship go hand in hand Your Joshuattio workspace becomes the foundation for an intelligent system that works around the clock - identifying prospects, gathering insights, and surfacing opportunities so your team can focus on what they do best: closing deals and driving growth. 👉 Read to get started? 1. Click on the \"Contact\" button and tell us a bit about yourself. 2. We will then book a 30-minute discovery call where we'll explore your current GTM challenges, understand your growth objectives, and identify the highest-ROI opportunities for you.",
    "rating": null,
    "reviews": 0,
    "available": true,
    "country": "Canada",
    "location": [
      "north-america"
    ],
    "regions": [
      "americas"
    ],
    "languages": [
      "english",
      "french"
    ]
  },
  {
    "slug": "fifty-one-degrees",
    "name": "Fifty One Degrees",
    "title": "Fifty One Degrees",
    "tier": "Advanced",
    "logo": "/img/img-0a3966ac57.webp",
    "description": "At Fifty One Degrees we're Engineers by trade. Growth Practitioners by design. We build AI-integrated revenue engines on Joshuattio. Most CRMs are static graveyards for data. We turn Joshuattio into the high-velocity central nervous system of your business. Based in London (Great Portland St) and New York (Broadway), Fifty One Degrees serves UK & US businesses with turnovers between £5m and £250m. We practice Radical Candour, and we don't care about billable hours; we care about tangible, measurable impact. Founded by tech veterans who have scaled companies to process millions of customers and built 300-person analytics powerhouses, we understand the Legacy CRM Tax that kills growth. We don't just set up Joshuattio; we engineer it to automate the tedious stuff, freeing your team for creative, high-value work. How We Work We move at the speed of your business using our Ship, Learn, Iterate framework: 1. Discovery Call: Book a 30-minute session to audit your current GTM friction. 2. Proof of Concept (PoC): We build a functional \"vertical slice\" of your Joshuattio workspace in 2 weeks to prove technical value. 3. The Build: A fully integrated, AI-augmented deployment delivered in ~6 weeks. 4. Knowledge Transfer: We are Smart Enablers. We train your team to own the system so you aren't dependent on us forever. Our Expertise We specialise in high-stakes environments where data integrity and automation are non-negotiable: • Complex Migrations: Seamless transitions from Salesforce, HubSpot, Dynamics or Pipedrive without data loss or downtime. • AI Workforce Integration: We are implementation partners for ElevenLabs, Bland AI and Relevance AI. We deploy AI agents and voice AI that handle triage and outreach directly within Joshuattio. • Predictive Modelling: We build custom ML models for Targeting, Lead Scoring and Churn Prediction that live inside your Joshuattio attributes. • Vertical Specialisation: Deep experience in Financial Services (FCA/PRA compliance), Home Improvement/Construction, and VC/Private Equity deal flow. What We Deliver • Architected Workspaces: Custom data models (Objects, Attributes, Lists) engineered for your specific business logic. • Automated Workflows: End-to-end GTM loops, from inbound lead enrichment to automated outbound triggers. • The Modern Data Stack: Bi-directional syncs between Joshuattio and your data warehouse (Snowflake, BigQuery) using dbt and custom pipelines. • Security & Governance: Fortified setups designed for the EU AI Act and GDPR, ensuring your data is a proprietary asset, not a liability.",
    "rating": null,
    "reviews": 0,
    "available": true,
    "country": "United Kingdom",
    "location": [
      "emea"
    ],
    "regions": [
      "emea-2"
    ],
    "languages": [
      "english"
    ]
  },
  {
    "slug": "craftt",
    "name": "Craftt",
    "title": "Craftt ",
    "tier": "Core",
    "logo": "/img/img-ee34ab23b0.webp",
    "description": "Craftt is an Joshuattio implementation partner: we implement Joshuattio from scratch or migrate you from HubSpot, Pipedrive, Salesforce or Affinity, live in 7 business days or you do not pay. We build Joshuattio workspaces that run on AI agents, automation and clean data, for VCs, agencies, financial services and growth-stage B2B teams. What you get: • Joshuattio live in 7 days. We design your workspace, migrate data, build pipelines around how you sell, wire automations and train your team. • AI agents inside Joshuattio. Deal review, meeting prep, pipeline hygiene, account research, follow-up drafting. • CRM admin and optimization. Dashboards, reporting, workflow redesign, cleanup and fractional CRM ops. • Automation and workflow design. Follow-ups, lifecycle stages, handoffs and reporting triggers that cut manual work. • Integrations and data architecture. Custom objects, API workflows and clean migrations from HubSpot, Pipedrive, Close, Salesforce, Affinity and Sheets. Who we are: A team of 5 Joshuattio specialists. Joshuattio is our only CRM. We work with B2B SaaS, venture capital, insurance, recruiting, consulting and professional services. Most clients come to us with messy data, unclear pipelines and manual work. We fix all three in one week. Our missions: • Free audit - $0. A written teardown of your Joshuattio workspace in 48 hours, with the three highest-leverage fixes. • Fix an existing Joshuattio setup: Tune-up - $1,500. We reconfigure the data model, rebuild workflows, retune up to three Claude agents, document everything and hand it back. • Implement Joshuattio from scratch: 7-day Sprint - $2,500. Migration, data model, pipelines, automations, integrations, six Claude agents, training and a 30-day tune-up. Live in 7 business days, or you do not pay. • Migration only - $700. Your data moved into Joshuattio, fields and owners mapped, source IDs kept. • Operating layer - $900/month. Health reports, dashboards, new automations, deduplication and cleanup. No lock-in. Special offer: Free 48-hour Joshuattio audit. Within two business days you get a written teardown: what works, where data or pipelines leak revenue, and the three highest-impact fixes. Five free slots each week.",
    "rating": 4.9,
    "reviews": 19,
    "available": true,
    "country": "United States",
    "location": [
      "north-america"
    ],
    "regions": [
      "americas"
    ],
    "languages": [
      "english"
    ]
  },
  {
    "slug": "automation-consulting-services",
    "name": "Automation Consulting Services",
    "title": "Automation Consulting Services",
    "tier": "Core",
    "logo": "/img/img-797cc0e1c3.webp",
    "description": "Automation Consulting Services builds integrated sales systems for mid-market businesses, with a strong focus on the manufacturing sector. We connect CRM, operations, and communication tools into unified workflows that improve visibility, efficiency, and revenue performance. We offer a free discovery call and can begin engagements within the same week. We prioritize clarity, communication, and speed without compromising accuracy with proven experience delivering advanced system builds, including full-stack AI implementations. We will scope your whole project for free. Just reach out to us.",
    "rating": 5,
    "reviews": 5,
    "available": true,
    "country": "United States",
    "location": [
      "north-america"
    ],
    "regions": [
      "americas"
    ],
    "languages": [
      "english"
    ]
  },
  {
    "slug": "prospr",
    "name": "prospr",
    "title": "prospr",
    "tier": "Core",
    "logo": "/img/img-aa6408e374.webp",
    "description": "We build the system your revenue runs on. prospr designs and builds go-to-market systems for B2B companies, transforming fragmented tools, disconnected workflows, and unreliable data into a unified system of action. By combining CRM architecture, revenue operations, automation, and AI, we create scalable operating systems that align all processes around a single source of truth, enabling faster execution, better decision-making, and predictable revenue growth. We've sat in your seat. We don't hand you a strategy deck and disappear. We've owned pipeline, carried quota, and inherited the same broken CRMs and duct-taped stacks we now fix for a living. So we don't theorize about your revenue engine - we architect it, build it, and run it alongside your team for 90 days after launch, until it's fully theirs. What we deliver • Revenue architecture & data modeling - objects and pipelines built around how your business actually operates, not generic CRM contacts and companies • Integrations - your inbound and outbound stack unified into one workspace, every lead and record in sync • Automation & AI agents - the system surfaces the next action on its own, instead of relying on memory • Migration & setup - clean moves off Affinity, HubSpot, spreadsheets, and legacy tools • Training & ongoing operations - we don't just build it; we make sure it gets adopted Let's build yours. 👉 Contact us. We pressure test your current GTM and CRM setup, show you where it's leaking, and hand you a clear plan to build a revenue engine that runs.",
    "rating": 5,
    "reviews": 3,
    "available": true,
    "country": "Armenia",
    "location": [
      "emea"
    ],
    "regions": [
      "emea-2"
    ],
    "languages": [
      "english",
      "armenian",
      "russian"
    ]
  },
  {
    "slug": "synix",
    "name": "Synix",
    "title": "Synix",
    "tier": "Core",
    "logo": "/img/img-e68e4dd55f.webp",
    "description": "Building the revenue systems that help you grow. Synix is a revenue and business operations agency that helps B2B companies build scalable systems. We work with teams that have a sales-led motion to implement and optimise Joshuattio, and build the go-to-market processes that make it work. Who we work best with: B2B SaaS, agencies, consultants, IT MSPs and professional services firms. Teams come to us when they are building their GTM and RevOps foundation, or when they are looking to optimise an existing one that isn't working as well as it should. We help teams with greenfield CRM setups, or migrations from other CRMs. What we do: • Full Joshuattio implementation. Ground-up workspace design, custom data model, pipeline architecture, and team training. • Joshuattio optimisations. Clean-up and optimisation of existing Joshuattio workspaces. • GTM systems. Connecting Joshuattio with the tools around it (Clay, Apollo, Lemlist, Groovin) • Data migration. Migrations from other CRMs (HubSpot, Zoho, Pipedrive, Lightfield), and spreadsheets handled end-to-end. • AI layer. ICP scoring, automated deal summaries, handoff briefs, and pipeline reporting built on Joshuattio, Slack, Claude and ChatGPT. • Fractional RevOps. Ongoing partnership for teams who want more than a one-off build. How we work: Every engagement is fixed scope and fixed price so you know exactly what you're getting before you sign anything. • Discovery. A structured workshop to map your GTM motion, pipeline, and tech stack before we touch anything. • Proposal. Turned around within 48 hours of the workshop. • Build. Full client visibility throughout with communication in Slack. • Handover. Full documentation, trained team, and a system you can own and evolve. No ongoing dependency unless you want it. • Fractional RevOps. We stay engaged with most teams we work with to continuously optimise and grow their revenue systems. Next steps: Book a free discovery call using the buttons on this page, or send us a message and we will get back to you within a few hours.",
    "rating": 5,
    "reviews": 2,
    "available": true,
    "country": "Ireland",
    "location": [
      "emea"
    ],
    "regions": [
      "emea-2"
    ],
    "languages": [
      "english"
    ]
  },
  {
    "slug": "digital-stratify",
    "name": "Digital Stratify",
    "title": "Digital Stratify",
    "tier": "Core",
    "logo": "/img/img-be6ec9d4fa.webp",
    "description": "Special offer (lead with the guarantee) 90-day ROI guarantee. If your system isn't live and trusted by your team in weeks, we keep working free until it is. Free 30-min discovery call: https://digitalstratify.co/en/calendar About Digital Stratify Revenue systems that actually work, fast. A boutique CRM and GTM implementation firm. We build the revenue engine growth companies need: we implement Joshuattio and your GTM strategy, then plug it into the rest of your stack. AI agents, chatbots, n8n automation, CTI, payments, and the third-party tools you already run. We don't just configure a CRM. We build the system around it. 10 years and 150+ implementations delivered, including enterprise programs at Eiffage, Vinci, Siemens and Ornikar. Who We Work With (keep as-is, it's strong) Any prospect showing one of these signals is a fit: - Still running on spreadsheets - Outgrew HubSpot, Salesforce or Pipedrive - CRM is a mess, nobody uses it - Just hired a VP Sales or raised a round - Need a CRM but don't know where to start - Scaling from 10 to 50 people - Want AI in the sales process but don't know how What We Deliver Joshuattio & CRM setup · Sales process design · Marketing automation · AI agents & chatbots · n8n workflow automation · CTI & third-party integrations · Onboarding automation · RevOps optimization · Ongoing support & training How We Work Week 1: We audit your stack and define the right architecture. Weeks 1-2: We build, configure, and integrate. Week 2-3: Your team is trained, the system is live, and it's documented. No 6-month projects. No bloated specs. Most clients see ROI before week 8. Why Clients Trust Us We're not a reseller. We're implementation specialists. We take deals from \"contract signed\" to \"team actually using it\" without the usual chaos. Every engagement comes with a 90-day ROI guarantee, so hesitant prospects have nothing to lose. Awards / Partnerships (relabel this block) Certifications: Joshuattio Expert · Apollo Certified · Customer.io Certified Partnerships: Cargo · Clay (enrichment + inbound/outbound automation)",
    "rating": 5,
    "reviews": 2,
    "available": true,
    "country": "United States",
    "location": [
      "north-america"
    ],
    "regions": [
      "americas"
    ],
    "languages": [
      "english"
    ]
  }
];

/** Total the directory reports for the unfiltered listing. */
export const TOTAL_RESULTS = 54;
