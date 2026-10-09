"use client";

/**
 * A card list that can be a horizontal scroll-snap row at small widths (its classes decide).
 * When a card inside receives keyboard focus while only partly visible, the row scrolls it fully into
 * view (respecting the row's scroll-padding and prefers-reduced-motion). Once the classes switch the row
 * to a static grid (overflow visible), the handler does nothing.
 */
export function ScrollRow({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const onFocus = (e: React.FocusEvent<HTMLUListElement>) => {
    const row = e.currentTarget;
    const item = (e.target as HTMLElement).closest("li");
    if (!item || row.scrollWidth <= row.clientWidth) return;
    const cs = getComputedStyle(row);
    if (cs.overflowX === "visible") return;
    const padL = parseFloat(cs.scrollPaddingLeft) || 0;
    const padR = parseFloat(cs.scrollPaddingRight) || 0;
    const r = row.getBoundingClientRect();
    const it = item.getBoundingClientRect();
    let delta = 0;
    if (it.left < r.left + padL) delta = it.left - (r.left + padL);
    else if (it.right > r.right - padR) delta = Math.min(it.right - (r.right - padR), it.left - (r.left + padL));
    if (!delta) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: delta, behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <ul role="list" className={className} onFocus={onFocus}>
      {children}
    </ul>
  );
}
