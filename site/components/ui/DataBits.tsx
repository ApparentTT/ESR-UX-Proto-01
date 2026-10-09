/** Footnotes, progress bars and legends (inventory A10-A12). */

export function Footnotes({ items, rule = true, className = "" }: { items: React.ReactNode[]; rule?: boolean; className?: string }) {
  return (
    <ol className={`list-decimal space-y-2 pl-[18px] pt-[30px] text-[12px] leading-[1.3] text-muted ${rule ? "border-t border-[#858585]" : ""} ${className}`}>
      {items.map((t, i) => (
        <li key={i} id={`fn${i + 1}`}>
          {t}
        </li>
      ))}
    </ol>
  );
}

/** 13px footnote paragraph (not a list). */
export function FootnoteText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[13px] leading-[1.45] text-muted ${className}`}>{children}</p>;
}

/**
 * 8px track. `segments` are percentages filled left to right: the first is ink, the second mid grey.
 * Give `label` for screen readers.
 */
export function ProgressBar({ segments, label, className = "" }: { segments: number[]; label: string; className?: string }) {
  const tones = ["bg-ink", "bg-[#A1A6AD]"];
  return (
    <div role="img" aria-label={label} className={`flex h-2 w-full overflow-hidden rounded-full bg-line ${className}`}>
      {segments.map((p, i) => (
        <span key={i} className={`h-full ${tones[i] ?? "bg-placeholder"}`} style={{ width: `${Math.max(0, Math.min(100, p))}%` }} />
      ))}
    </div>
  );
}

export function Legend({ items, className = "" }: { items: { label: string; tone: "dark" | "mid" | "track" }[]; className?: string }) {
  const tone = { dark: "bg-ink", mid: "bg-[#A1A6AD]", track: "bg-line" };
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 ${className}`}>
      {items.map((i) => (
        <li key={i.label} className="inline-flex items-center gap-2 text-[13px] leading-[1.45] text-muted">
          <span aria-hidden="true" className={`size-3 rounded-full ${tone[i.tone]}`} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
