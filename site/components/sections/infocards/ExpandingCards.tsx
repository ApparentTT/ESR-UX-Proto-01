"use client";

import { useId, useState } from "react";
import { Section, type SectionBg } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { OUTLINE_CARD_LINK, OUTLINE_CARD_SHELL, OUTLINE_CARD_TITLE } from "./OutlineTextCard";

/**
 * B22 ExpandingCards (DC §4b "Features and benefits"). Follows a SectionHeading "title".
 * Desktop (>=1280): one row of outline text cards, 405 tall, gap 16. Exactly one card is expanded
 * (596 of 1306 wide: flex-grow 2.7 vs 1) with the title and the description side by side (148 | 378)
 * and a "Close" link at the bottom; the others show the title and "Learn more". Clicking a card or its
 * "Learn more" expands it (flex-grow animates ~300ms, the description fades in). "Close" collapses
 * all, so the cards share the width equally.
 * From 1280 to 1439 the title steps down to 22px and the side padding to 20px so "Sustainability" fits a collapsed card.
 * The card's horizontal padding sits on the inner column so flex-basis 0 splits the full width by grow ratio.
 * Below 1280: a vertical accordion. The open card stacks title over description, then "Close".
 * Every toggle is a real <button> with aria-expanded and aria-controls.
 */
export type ExpandingCardItem = {
  title: string;
  /** Shown when the card is expanded. The wireframe reuses the Scalability copy for every card. */
  description: string;
};

export type ExpandingCardsProps = {
  items: ExpandingCardItem[];
  /** Index expanded on load (default 0, the wireframe's Scalability); null = all collapsed */
  defaultOpen?: number | null;
  learnMoreLabel?: string;
  closeLabel?: string;
  bg?: SectionBg;
  /** id of the heading that names this block (e.g. the SectionHeading h2), for aria-labelledby */
  labelledBy?: string;
  titleAs?: "h3" | "h4";
  className?: string;
};

export function ExpandingCards({
  items,
  defaultOpen = 0,
  learnMoreLabel = "Learn more",
  closeLabel = "Close",
  bg = "white",
  labelledBy,
  titleAs: H = "h3",
  className = "",
}: ExpandingCardsProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(defaultOpen);
  const uid = useId();

  return (
    <Section bg={bg} aria-labelledby={labelledBy} className={`pt-8 pb-12 md:pt-10 md:pb-16 lg:py-[72px] ${className}`}>
      <ul role="list" className="flex flex-col gap-4 xl:h-[405px] xl:flex-row">
        {items.map((item, i) => {
          const open = openIdx === i;
          const panelId = `${uid}-panel-${i}`;
          return (
            <li
              key={item.title}
              className={`group relative flex min-w-0 flex-col transition-[flex-grow,box-shadow] duration-300 ease-out xl:basis-0 ${OUTLINE_CARD_SHELL} ${
                open ? "xl:grow-[2.7]" : "hover:shadow-[inset_0_0_0_1px_#111826] xl:grow"
              }`}
            >
              <div
                className={`flex h-full flex-col gap-4 px-5 py-5 md:px-6 md:py-6 xl:max-[1439px]:px-5 xl:justify-between xl:gap-0 xl:pt-[35px] ${open ? "xl:pb-[19px]" : "xl:pb-[35px]"}`}
              >
                <div className={open ? "grid gap-3 xl:grid-cols-[minmax(min-content,148fr)_378fr] xl:gap-5" : ""}>
                  <H className={`self-start break-words ${OUTLINE_CARD_TITLE} xl:max-[1439px]:text-[22px]`}>{item.title}</H>
                  <div
                    id={panelId}
                    hidden={!open}
                    className="animate-[fade-in_300ms_ease-out_120ms_both] text-[17px] font-medium leading-[1.2] text-ink lg:text-[19px]"
                  >
                    {item.description}
                  </div>
                </div>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIdx(open ? null : i)}
                  className={`inline-flex cursor-pointer items-center gap-1 self-start ${OUTLINE_CARD_LINK} decoration-1 hover:text-ink hover:decoration-2 ${
                    open ? "" : "group-hover:text-ink group-hover:decoration-2 after:absolute after:inset-0 after:content-['']"
                  }`}
                >
                  {open ? closeLabel : learnMoreLabel}
                  <span className="sr-only">{open ? ` ${item.title}` : ` about ${item.title}`}</span>
                  {/* Accordion affordance below 1280 only. The wrapper hides it: .icon sets its own display. */}
                  <span aria-hidden="true" className="inline-flex xl:hidden">
                    <Icon name="keyboard_arrow_down" size={18} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                  </span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
