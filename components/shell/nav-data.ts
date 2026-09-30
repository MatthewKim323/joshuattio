// Site navigation data shared by the desktop dropdowns and the mobile drawer.
export type NavLink = { label: string; href: string; description?: string };
export type NavSection = { heading: string; links: NavLink[] };
export type NavMenu = { id: string; label: string; columns: NavSection[]; cardSections: NavSection[] };
export type NavPlainLink = { id: string; label: string; href: string };
export type NavItem = NavMenu | NavPlainLink;

export const isMenu = (item: NavItem): item is NavMenu => "columns" in item;

export const NAVIGATION: NavItem[] = [
  {
    "id": "platform",
    "label": "Platform",
    "columns": [
      {
        "heading": "Context",
        "links": [
          {
            "label": "Universal Context",
            "href": "/platform/universal-context",
            "description": "The AI context layer"
          },
          {
            "label": "Data Model",
            "href": "/platform/data",
            "description": "Sync and structure your data"
          },
          {
            "label": "Enrichment",
            "href": "/platform/enrichment",
            "description": "Auto-enrich every record"
          },
          {
            "label": "Call Intelligence",
            "href": "/platform/call-intelligence",
            "description": "Record and analyze meetings"
          },
          {
            "label": "Reporting & Forecasts",
            "href": "/platform/reporting",
            "description": "Insights in real time"
          }
        ]
      },
      {
        "heading": "Agents & automations",
        "links": [
          {
            "label": "Ask Joshuattio",
            "href": "/platform/ask",
            "description": "Analyze and create with AI"
          },
          {
            "label": "Workflows",
            "href": "/platform/workflows",
            "description": "Orchestrate any revenue motion"
          },
          {
            "label": "Custom Agents",
            "href": "/platform/custom-agents",
            "description": "Agents ready for any task"
          },
          {
            "label": "Web Agent",
            "href": "/platform/web-agent",
            "description": "Research the web on autopilot"
          },
          {
            "label": "Sequences",
            "href": "/platform/sequences",
            "description": "Personalized outreach at scale"
          }
        ]
      },
      {
        "heading": "Ecosystem",
        "links": [
          {
            "label": "Apps",
            "href": "/apps",
            "description": "Discover the tools you need"
          },
          {
            "label": "MCP",
            "href": "/platform/mcp",
            "description": "Connect everywhere you work"
          },
          {
            "label": "Developer Platform",
            "href": "/platform/developers",
            "description": "Extend and integrate with Joshuattio"
          }
        ]
      }
    ],
    "cardSections": [
      {
        "heading": "Joshuattio for",
        "links": [
          {
            "label": "Slack",
            "href": "/apps/slack"
          },
          {
            "label": "ChatGPT",
            "href": "/apps/chatgpt"
          },
          {
            "label": "Claude",
            "href": "/apps/claude"
          }
        ]
      },
      {
        "heading": "Get started",
        "links": [
          {
            "label": "Joshuattio 101",
            "href": "/help/reference/joshuattio-101"
          },
          {
            "label": "Startup program",
            "href": "/startups"
          },
          {
            "label": "Talk to sales",
            "href": "/contact/sales"
          }
        ]
      }
    ]
  },
  {
    "id": "resources",
    "label": "Resources",
    "columns": [
      {
        "heading": "Support",
        "links": [
          {
            "label": "Help Center",
            "href": "/help",
            "description": "Learn about Joshuattio's features"
          },
          {
            "label": "Academy",
            "href": "/help/academy",
            "description": "Essential Joshuattio, explained"
          },
          {
            "label": "Developer Docs",
            "href": "#",
            "description": "Start building on Joshuattio"
          },
          {
            "label": "Joshuattio Community",
            "href": "#",
            "description": "Connect with other Joshuattio users"
          }
        ]
      }
    ],
    "cardSections": [
      {
        "heading": "Partners",
        "links": [
          {
            "label": "Technology partners",
            "href": "/partners/app-partners"
          },
          {
            "label": "Expert partners",
            "href": "/partners/expert-partners"
          },
          {
            "label": "Creator partners",
            "href": "/partners/creator-partners"
          }
        ]
      },
      {
        "heading": "Company",
        "links": [
          {
            "label": "Changelog",
            "href": "/changelog"
          },
          {
            "label": "Announcements",
            "href": "/blog"
          },
          {
            "label": "Engineering blog",
            "href": "/engineering/blog"
          },
          {
            "label": "Careers",
            "href": "/careers"
          }
        ]
      }
    ]
  },
  {
    "id": "developers",
    "label": "Developers",
    "href": "/platform/developers"
  },
  {
    "id": "customers",
    "label": "Customers",
    "href": "/customers"
  },
  {
    "id": "pricing",
    "label": "Pricing",
    "href": "/pricing"
  }
];
