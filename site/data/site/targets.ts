/**
 * SUS §4 "Our targets" (inventory B31), verbatim.
 * Progress values are the wireframe's placeholder fill widths (% of the track).
 */
import type { TargetProgressCardsProps } from "@/components/sections/stats/TargetProgressCards";

export const SUS_TARGETS: TargetProgressCardsProps = {
  title: "Our targets",
  sub: "What we have committed to, and where we are against it.",
  groups: [
    {
      title: "Environmental",
      items: [
        { label: "Net zero operational carbon", target: "2030", progress: 58, caption: "XX% complete" },
        { label: "Green certified portfolio", target: "XX% by 2030", progress: 69, caption: "XX% complete" },
        { label: "Rooftop solar installed", target: "XXX MW by 2030", progress: 45, caption: "XX% complete" },
      ],
    },
    {
      title: "Social",
      items: [
        { label: "Community investment", target: "US $XXm by 2030", progress: 51, caption: "XX% complete" },
        { label: "Workforce representation", target: "XX% by 2030", progress: 64, caption: "XX% complete" },
      ],
    },
    {
      title: "Governance",
      items: [{ label: "Suppliers assessed on ESG", target: "XX% by 2028", progress: 76, caption: "XX% complete" }],
    },
  ],
};
