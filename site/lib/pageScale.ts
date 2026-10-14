/**
 * Large screens scale the whole page with CSS zoom (see html in app/globals.css). Pointer positions and
 * getBoundingClientRect() are then in screen pixels, while layout sizes and an element's own scroll
 * offsets (offsetWidth, clientWidth, scrollLeft, scrollTop, scrollBy) stay in page pixels.
 * Divide screen pixels by this to get page pixels. 1 at 1440 and below. Measured, so it is right in
 * every browser whatever its zoom model.
 */
export function pageScale(): number {
  if (typeof document === "undefined") return 1;
  const b = document.body;
  const w = b?.offsetWidth;
  return w ? b.getBoundingClientRect().width / w : 1;
}
