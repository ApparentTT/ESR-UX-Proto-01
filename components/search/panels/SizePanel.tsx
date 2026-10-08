"use client";

import { SIZE_PRESETS, type Filters } from "@/lib/filters";
import { TogglePill } from "@/components/ui/Controls";
import { SizeInputs } from "./SizeInputs";
import { SizeRange } from "./SizeRange";

type Props = { draft: Filters; onDraft: (f: Filters) => void; showHeading?: boolean };

/** Typed min and max, histogram slider and presets. All three stay in sync through the draft. */
export function SizePanel({ draft, onDraft, showHeading = true }: Props) {
  const presetId = SIZE_PRESETS.find((p) => p.min === draft.min && p.max === draft.max)?.id;
  return (
    <div>
      {showHeading && <h3 className="mb-3 text-[13px] text-muted">Gross floor area (sqm)</h3>}
      <SizeInputs draft={draft} onDraft={onDraft} />
      <SizeRange draft={draft} onDraft={onDraft} />
      <div role="radiogroup" aria-label="Size presets" className="mt-2 flex flex-wrap gap-2.5">
        {SIZE_PRESETS.map((p) => (
          <TogglePill key={p.id} role="radio" label={p.label} pressed={presetId === p.id} onClick={() => onDraft({ ...draft, min: p.min, max: p.max })} />
        ))}
      </div>
    </div>
  );
}
