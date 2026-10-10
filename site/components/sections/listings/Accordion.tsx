"use client";

import { Fragment, useId, useRef, useState } from "react";
import { Section, type SectionBg } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { PAD, T } from "@/components/ui/type";

export type AccordionLink = { label: string; href: string | null };

export type AccordionItem = {
  label: string;
  /** Panel body: plain text or any node (Medium 14/20 muted) */
  content?: React.ReactNode;
  /**
   * Download links shown as one underlined line, joined by ", " (SGOV §6). Each is its own (usually inert) link,
   * so the visible text reads exactly like the wireframe's single line.
   */
  links?: AccordionLink[];
};

export type AccordionProps = {
  title: string;
  items: AccordionItem[];
  /** Index (or indexes, with `multiple`) open on load; null for all closed. Default: the first item. */
  defaultOpen?: number | number[] | null;
  /** Independent toggles (many open). Default: single-open, opening one closes the others. */
  multiple?: boolean;
  bg?: SectionBg;
  id?: string;
  /** Level of the centred title; each item header sits one level below */
  headingLevel?: "h2" | "h3";
};

/**
 * B17 Accordion ("Blocks - Features": PROP §10 / DEV §10 FAQ, SGOV §6 "Past disclosures by year").
 * Band 64/64. Inner block padding 32 / 30 (the 30px sides drop below 768), gap 30. Title Medium 24, -0.48,
 * centred (20 on mobile). Items stacked with no gap: a 56px header button (padding 16, gap 16, surface
 * fill, 1px ink bottom border), label Medium 14/20 ink, then a 24px circle-plus (closed) or circle-minus
 * (open) in muted grey. Panel: white, padding 16, Medium 14/20 muted.
 * Buttons carry aria-expanded / aria-controls; Up / Down / Home / End move between headers.
 */
export function Accordion({ title, items, defaultOpen = 0, multiple = false, bg = "white", id, headingLevel: H = "h2" }: AccordionProps) {
  const base = useId();
  const titleId = `${base}-title`;
  const initial = defaultOpen === null ? [] : Array.isArray(defaultOpen) ? (multiple ? defaultOpen : defaultOpen.slice(0, 1)) : [defaultOpen];
  const [open, setOpen] = useState<number[]>(initial);
  const listRef = useRef<HTMLDivElement>(null);
  const ItemH = H === "h2" ? "h3" : "h4";

  const toggle = (i: number) =>
    setOpen((cur) => (cur.includes(i) ? cur.filter((v) => v !== i) : multiple ? [...cur, i] : [i]));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const buttons = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]") ?? []);
    const cur = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (cur === -1) return;
    e.preventDefault();
    const n = buttons.length;
    const next = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (cur + (e.key === "ArrowDown" ? 1 : -1) + n) % n;
    buttons[next]?.focus();
  };

  return (
    <Section bg={bg} id={id} aria-labelledby={titleId} className={PAD.mid}>
      <div className="flex flex-col gap-6 md:gap-[30px] md:px-[30px] md:py-8">
        <H id={titleId} className={`text-center ${T.h24m}`}>
          {title}
        </H>
        <div ref={listRef} onKeyDown={onKeyDown}>
          {items.map((item, i) => {
            const isOpen = open.includes(i);
            const btnId = `${base}-btn-${i}`;
            const panelId = `${base}-panel-${i}`;
            return (
              <div key={i}>
                <ItemH>
                  <button
                    id={btnId}
                    type="button"
                    data-accordion-trigger
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i)}
                    className="focus-inset flex min-h-14 w-full items-center gap-4 border-b border-ink bg-surface p-4 text-left text-[14px] font-medium leading-5 text-ink transition-colors hover:bg-[#EDEEF1]"
                  >
                    <span className="flex-1">{item.label}</span>
                    <Icon name={isOpen ? "do_not_disturb_on" : "add_circle"} size={24} className="text-muted" />
                  </button>
                </ItemH>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  hidden={!isOpen}
                  className="anim-fade bg-white p-4 text-[14px] font-medium leading-5 text-muted"
                >
                  {item.content}
                  {item.links && item.links.length > 0 && (
                    <p className="underline underline-offset-2">
                      {item.links.map((l, j) => (
                        <Fragment key={j}>
                          {j > 0 && ", "}
                          <SmartLink href={l.href} className="transition-colors hover:text-ink">
                            {l.label}
                          </SmartLink>
                        </Fragment>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
