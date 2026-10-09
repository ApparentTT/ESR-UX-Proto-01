"use client";

import { PROPERTY_TYPES } from "@/data/types";
import { typeCounts, type Filters } from "@/lib/filters";
import { CheckboxRow, TogglePill } from "@/components/ui/Controls";

type Props = { draft: Filters; onDraft: (f: Filters) => void; layout?: "list" | "pills" };

/** Multi-select with live counts. Types with zero results are hidden, not disabled (unless already selected). */
export function TypePanel({ draft, onDraft, layout = "list" }: Props) {
  const counts = typeCounts(draft);
  const toggle = (id: (typeof PROPERTY_TYPES)[number]["id"], on: boolean) =>
    onDraft({ ...draft, type: on ? [...draft.type, id] : draft.type.filter((t) => t !== id) });
  const options = PROPERTY_TYPES.filter((t) => counts[t.id] > 0 || draft.type.includes(t.id));

  if (!options.length) return <p className="text-sm text-muted">No property types match the other filters.</p>;

  if (layout === "pills")
    return (
      <div className="flex flex-wrap gap-2.5">
        {options.map((t) => (
          <TogglePill key={t.id} label={t.label} count={counts[t.id]} pressed={draft.type.includes(t.id)} onClick={() => toggle(t.id, !draft.type.includes(t.id))} />
        ))}
      </div>
    );

  return (
    <fieldset>
      <legend className="sr-only">Property type</legend>
      {options.map((t) => (
        <CheckboxRow key={t.id} label={t.label} count={counts[t.id]} checked={draft.type.includes(t.id)} onChange={(on) => toggle(t.id, on)} />
      ))}
    </fieldset>
  );
}
