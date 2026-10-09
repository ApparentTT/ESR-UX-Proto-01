/** DEV §2 "End to end, in house" (inventory B19), verbatim. */
import type { ProcessStepsProps } from "@/components/sections/stats/ProcessSteps";

export const DEV_PROCESS: ProcessStepsProps = {
  title: "End to end, in house",
  sub: "We handle every stage of a development ourselves. One team, one point of accountability.",
  steps: [
    {
      number: "01",
      title: "Land sourcing",
      body: "We secure sites before they come to market, assessing zoning, power and access.",
    },
    {
      number: "02",
      title: "Design",
      body: "We plan the building around how the customer operates, from layout to sustainability.",
    },
    {
      number: "03",
      title: "Construction",
      body: "We manage delivery in house, from approvals through to practical completion.",
    },
    {
      number: "04",
      title: "Pre-leasing",
      body: "We lease space before it is built, so the facility is shaped around the customer.",
    },
  ],
};
