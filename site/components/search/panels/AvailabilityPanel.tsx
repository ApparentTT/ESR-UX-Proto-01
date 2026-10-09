"use client";

import { AVAILABILITY_OPTIONS } from "@/data/types";
import { availabilityCounts, type Filters } from "@/lib/filters";
import { CheckboxRow, RadioRow, TogglePill } from "@/components/ui/Controls";

type Props = { draft: Filters; onDraft: (f: Filters) => void; layout?: "list" | "pills"; showHeading?: boolean };

/** Single select with counts (mutually exclusive windows) plus a separate pre-lease checkbox. */
export function AvailabilityPanel({ draft, onDraft, layout = "list", showHeading = true }: Props) {
  const counts = availabilityCounts(draft);
  const value = draft.avail ?? "any";
  const set = (id: (typeof AVAILABILITY_OPTIONS)[number]["id"]) => onDraft({ ...draft, avail: id === "any" ? null : id });

  const preLease = (
    <CheckboxRow label="Include pre-lease and build to suit" checked={draft.pre} onChange={(on) => onDraft({ ...draft, pre: on })} />
  );

  if (layout === "pills")
    return (
      <div>
        <div role="radiogroup" aria-label="When do you need it?" className="flex flex-wrap gap-2.5">
          {AVAILABILITY_OPTIONS.map((o) => (
            <TogglePill key={o.id} role="radio" label={o.label} count={counts[o.id]} pressed={value === o.id} onClick={() => set(o.id)} />
          ))}
        </div>
        <div className="mt-3">{preLease}</div>
      </div>
    );

  return (
    <div>
      <fieldset>
        <legend className={showHeading ? "mb-2 text-[13px] text-muted" : "sr-only"}>When do you need it?</legend>
        {AVAILABILITY_OPTIONS.map((o) => (
          <RadioRow key={o.id} name="availability" label={o.label} count={counts[o.id]} checked={value === o.id} onChange={() => set(o.id)} />
        ))}
      </fieldset>
      <div className="mt-3 border-t border-line pt-3">{preLease}</div>
    </div>
  );
}
