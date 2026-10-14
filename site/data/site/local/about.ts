/**
 * /jp/about: R2_Local_About (Key wireframes 1347:77157, mobile 1347:77158), verbatim.
 * The drawn toggle shows the "Group" figures; the "Local" figures are not drawn, so they read "XX".
 */
import type { StatItem } from "@/components/sections/stats/StatRow";
import type { OutlineTextCardItem } from "@/components/sections/infocards/OutlineTextCard";
import type { MediaCardData } from "@/components/sections/cards/MediaCard";
import type { SplitBlockCta } from "@/components/sections/blocks/SplitBlock";
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";
import { ABOUT_PURPOSE, ABOUT_PURPOSE_HEADING } from "@/data/site/purpose";
import { JP } from "./shared";

export const JP_ABOUT_INTRO = {
  title: "About us",
  body: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.",
  /** Goes to the group About page */
  action: { label: "Discover more about ESR group", href: "/about" },
};

/** "Key stats / opt 2" (1348:77195): Group / Local toggle over four stats and a footnote */
export const JP_ABOUT_STATS: { label: string; options: { id: string; label: string; stats: StatItem[] }[]; footnotes: string[] } = {
  label: "Show figures for",
  options: [
    {
      id: "group",
      label: "Group",
      stats: [
        { value: "US $31.8B", label: "Total assets under management", sup: 1 },
        { value: "4.7m sqm", label: "Gross floor area" },
        { value: "XX sqm", label: "Development pipeline" },
        { value: "XX", label: "In-house experts" },
      ],
    },
    {
      id: "local",
      label: "Local",
      stats: [
        { value: "US $XXB", label: "Total assets under management", sup: 1 },
        { value: "XX sqm", label: "Gross floor area" },
        { value: "XX sqm", label: "Development pipeline" },
        { value: "XX", label: "In-house experts" },
      ],
    },
  ],
  footnotes: ["Total AUM is comprised of Third-Party AUM plus Balance Sheet Real Estate. Data as at 31 December 2025."],
};

/** "Our purpose": the group cards; the Japan site has no destinations for them yet, so all three are inert */
export const JP_ABOUT_PURPOSE_HEADING = ABOUT_PURPOSE_HEADING;
export const JP_ABOUT_PURPOSE: OutlineTextCardItem[] = ABOUT_PURPOSE.map((c) => ({ ...c, href: null }));

/** The CTA keeps the drawn double space ("Meet  our") */
export const JP_ABOUT_LEADERSHIP: { title: string; body: string; cta: SplitBlockCta } = {
  title: "Our leadership",
  body: "[Description about leadership team with ESR]",
  cta: { label: "Meet  our leadership team", href: JP.leadership },
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
