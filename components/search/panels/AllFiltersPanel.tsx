"use client";

import { PanelFrame, type PanelVariant } from "@/components/ui/PanelFrame";
import { TogglePill } from "@/components/ui/Controls";
import { LocationPanel } from "./LocationPanel";
import { TypePanel } from "./TypePanel";
import { SizePanel } from "./SizePanel";
import { AvailabilityPanel } from "./AvailabilityPanel";
import { AMENITY_OPTIONS, SUSTAINABILITY_OPTIONS } from "@/data/types";
import { amenityCounts, sustainabilityCounts, type Filters } from "@/lib/filters";
import { MARKET } from "@/config/market";

type Props = {
  open: boolean;
  variant: PanelVariant;
  draft: Filters;
  onDraft: (f: Filters) => void;
  text: string;
  onText: (t: string) => void;
  onClose: () => void;
  footer: { resetLabel: string; onReset: () => void; count: number; onApply: () => void };
};

function Group({ title, sub, children, id }: { title: string; sub?: string; children: React.ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="border-b border-line py-7 first:pt-1 last:border-b-0">
      <h3 id={id} className="text-lg font-medium md:text-xl">
        {title}
      </h3>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Every filter in one continuous scroll with a sticky footer. Centred modal on desktop, full-height sheet on mobile. */
export function AllFiltersPanel({ open, variant, draft, onDraft, text, onText, onClose, footer }: Props) {
  const susCounts = sustainabilityCounts(draft);
  const amenCounts = amenityCounts(draft);

  const toggle = <K extends "sus" | "amen">(key: K, id: Filters[K][number]) => {
    const list = draft[key] as string[];
    onDraft({ ...draft, [key]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] });
  };

  return (
    <PanelFrame open={open} variant={variant} title="All filters" onClose={onClose} footer={footer}>
      <Group id="af-location" title="Location" sub={MARKET.regionHeading}>
        <LocationPanel draft={draft} onDraft={onDraft} text={text} onText={onText} showSearchInput layout="pills" listboxId="af-location-suggestions" />
      </Group>
      <Group id="af-type" title="Property type">
        <TypePanel draft={draft} onDraft={onDraft} layout="pills" />
      </Group>
      <Group id="af-size" title="Size" sub="Gross floor area (sqm)">
        <SizePanel draft={draft} onDraft={onDraft} showHeading={false} />
      </Group>
      <Group id="af-avail" title="Availability">
        <AvailabilityPanel draft={draft} onDraft={onDraft} layout="pills" />
      </Group>
      <Group id="af-sus" title="Sustainability">
        <div className="flex flex-wrap gap-2.5">
          {SUSTAINABILITY_OPTIONS.map((o) => (
            <TogglePill key={o.id} label={o.label} count={susCounts[o.id]} pressed={draft.sus.includes(o.id)} onClick={() => toggle("sus", o.id)} />
          ))}
        </div>
      </Group>
      <Group id="af-amen" title="Amenity and access">
        <div className="flex flex-wrap gap-2.5">
          {AMENITY_OPTIONS.map((o) => (
            <TogglePill key={o.id} label={o.label} count={amenCounts[o.id]} pressed={draft.amen.includes(o.id)} onClick={() => toggle("amen", o.id)} />
          ))}
        </div>
      </Group>
    </PanelFrame>
  );
}
