"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { PROPERTY_TYPES } from "@/data/types";

/**
 * "Find a development opportunity" (Local_Developments 1167:8998): grey band (72 top / 64 bottom), Medium 32
 * heading on the left (414 wide), then a row: "Development type" select (180), the search input and a grey
 * Search button (120). Submits to the ESR Japan property search with pre-lease and build to suit included
 * (?q=, ?type=, ?pre=1). The type options are the property search's. Stacks below 1024.
 */
export function DevOpportunitySearch({
  title,
  typeLabel,
  placeholder,
  submitLabel,
  searchPath = "/properties/search",
}: {
  title: string;
  typeLabel: string;
  placeholder: string;
  submitLabel: string;
  searchPath?: string;
}) {
  const router = useRouter();
  const [type, setType] = useState("");
  const [q, setQ] = useState("");
  const uid = useId();
  const headingId = `${uid}-title`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim().toLowerCase());
    if (type) p.set("type", type);
    p.set("pre", "1");
    router.push(`${searchPath}?${p.toString()}`);
  };

  const field = "h-11 rounded-btn border border-ink bg-white px-3 text-[14px] leading-5 text-ink";
  return (
    <Section bg="surface" aria-labelledby={headingId} className="pb-12 pt-12 md:pb-14 md:pt-16 lg:pb-16 lg:pt-[72px]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-[119px]">
        <h2 id={headingId} className="text-[26px] font-medium leading-[1.2] tracking-[-0.02em] text-ink md:text-[28px] lg:w-[414px] lg:shrink-0 lg:text-[32px]">
          {title}
        </h2>
        <form role="search" aria-labelledby={headingId} onSubmit={submit} className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row">
          <div className="relative md:w-[180px] md:shrink-0">
            <label htmlFor={`${uid}-type`} className="sr-only">
              {typeLabel}
            </label>
            <select
              id={`${uid}-type`}
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`${field} w-full appearance-none pr-9 ${type ? "" : "text-muted"}`}
            >
              <option value="">{typeLabel}</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <Icon name="keyboard_arrow_down" size={20} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink" />
          </div>
          <div className="relative min-w-0 flex-1">
            <label htmlFor={`${uid}-q`} className="sr-only">
              {placeholder}
            </label>
            <input
              id={`${uid}-q`}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={placeholder}
              className={`${field} w-full pr-10 placeholder:text-muted`}
            />
            <Icon name="search" size={20} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink" />
          </div>
          <button
            type="submit"
            className="h-11 shrink-0 rounded-btn border border-ink bg-muted px-3 text-[14px] font-medium leading-5 text-white transition-colors hover:bg-[#4B5563] md:w-[120px]"
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </Section>
  );
}
