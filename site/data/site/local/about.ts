/**
 * /jp/about: R2_Local_About (Key wireframes 1347:77157, mobile 1347:77158), verbatim.
 * The figures are indicative until ESR supplies them (Japan figures match the Investment management menu).
 */
import type { StatItem } from "@/components/sections/stats/StatRow";
import type { OutlineTextCardItem } from "@/components/sections/infocards/OutlineTextCard";
import type { MediaCardData } from "@/components/sections/cards/MediaCard";
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";
import type { LeaderGridItem } from "@/components/sections/blocks/LeaderGrid";
import { ABOUT_PURPOSE, ABOUT_PURPOSE_HEADING } from "@/data/site/purpose";
import { JP_LEADERS } from "./leadership";
import { JP } from "./shared";

export const JP_ABOUT_INTRO = {
  title: "About us",
  body: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.",
  /** Goes to the group About page */
  action: { label: "Discover more about ESR group", href: "/about" },
};

/** "Key stats / opt 2" (1348:77195): Local / Group toggle (Local first and shown by default) over four stats and a footnote */
export const JP_ABOUT_STATS: { label: string; options: { id: string; label: string; stats: StatItem[] }[]; footnotes: string[] } = {
  label: "Show figures for",
  options: [
    {
      id: "local",
      label: "Local",
      stats: [
        { value: "US $21.6B", label: "Total assets under management", sup: 1 },
        { value: "1.9m sqm", label: "Gross floor area" },
        { value: "620,000 sqm", label: "Development pipeline" },
        { value: "380+", label: "In-house experts" },
      ],
    },
    {
      id: "group",
      label: "Group",
      stats: [
        { value: "US $31.8B", label: "Total assets under management", sup: 1 },
        { value: "4.7m sqm", label: "Gross floor area" },
        { value: "2.1m sqm", label: "Development pipeline" },
        { value: "1,900+", label: "In-house experts" },
      ],
    },
  ],
  footnotes: ["Total AUM is comprised of Third-Party AUM plus Balance Sheet Real Estate. Data as at 31 December 2025."],
};

/** "Our purpose": the group cards; the Japan site has no destinations for them yet, so all three are inert */
export const JP_ABOUT_PURPOSE_HEADING = ABOUT_PURPOSE_HEADING;
export const JP_ABOUT_PURPOSE: OutlineTextCardItem[] = ABOUT_PURPOSE.map((c) => ({ ...c, href: null }));

/** One-line bios for the first three Japan leaders (same names and roles as /jp/leadership) */
const JP_LEADER_SUMMARIES = [
  "Leads ESR's business and strategy in Japan.",
  "Chairs ESR Japan and guides its long-term direction.",
  "Leads finance, capital management and reporting in Japan.",
];

/** Client feedback round 2: the group About leader grid (LeaderGrid), at most three Japan leaders, no LinkedIn */
export const JP_ABOUT_LEADERSHIP: { title: string; leaders: LeaderGridItem[]; cta: { label: string; href: string } } = {
  title: "Our leadership",
  leaders: JP_LEADERS.slice(0, 3).map((l, i) => ({ name: l.name, title: l.title, summary: JP_LEADER_SUMMARIES[i] ?? "" })),
  cta: { label: "Meet our full leadership team", href: JP.leadership },
};

export const JP_ABOUT_CAPABILITY: { title: string; body: string; actions: FeatureBandAction[] } = {
  title: "Proven capability",
  body: "Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
  actions: [{ label: "View all case studies", href: JP.provenCapability }],
};

/** Featured cards: Our people and Our customers go to the Japan pages */
export const JP_ABOUT_CARDS: MediaCardData[] = [
  { title: "Our people", href: "/jp/our-people" },
  { title: "Our customers", href: "/jp/our-customers" },
  { title: "News and insights", href: JP.news },
];
