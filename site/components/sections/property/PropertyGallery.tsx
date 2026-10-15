"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "@/components/layout/nav/parts";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { FilterPills } from "@/components/ui/Tag";
import type { GalleryCategory, GalleryPhoto } from "@/data/site/local/property-detail";

export type GalleryCopy = {
  photos: GalleryPhoto[];
  categories: GalleryCategory[];
  showAll: string;
  back: string;
  allPhotos: string;
  all: string;
  close: string;
  caption: string;
  swipeHint: string;
};

/** How the gallery opens: the grid ("Show all photos"), or the lightbox at a photo (the images on the page) */
export type GalleryStart = { view: "grid" } | { view: "lightbox"; n: number };

const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex='-1'])";
const ALL = "all";

/**
 * Masonry slots for each block of nine photos in the 3-column grid (1507:59486): each column holds one 280, one
 * 200 and one 240 tile (7, 5 and 6 rows of 40 drawn px), so the three columns end level every nine photos. Listed
 * in reading order (by top edge), so the DOM and tab order follow what is seen.
 */
const SLOTS = [
  { c: 1, r: 0, s: 7 },
  { c: 2, r: 0, s: 6 },
  { c: 3, r: 0, s: 5 },
  { c: 3, r: 5, s: 6 },
  { c: 2, r: 6, s: 7 },
  { c: 1, r: 7, s: 5 },
  { c: 3, r: 11, s: 7 },
  { c: 1, r: 12, s: 6 },
  { c: 2, r: 13, s: 5 },
];
const BLOCK_ROWS = 18;

/** Keeps Tab and Shift+Tab inside a modal layer */
function trapTab(e: React.KeyboardEvent<HTMLElement>) {
  if (e.key !== "Tab") return;
  const els = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
  if (!els.length) return;
  const first = els[0];
  const last = els[els.length - 1];
  if (e.shiftKey && (document.activeElement === first || !e.currentTarget.contains(document.activeElement))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/**
 * Property photo gallery, a full-screen layer over the page (portalled to body; the page behind is inert and
 * does not scroll). Rendered only while open; the opener restores focus on close.
 *
 * Grid (1507:59463, 390: 1507:59568): white, a sticky bar with "← Back to property" (390: a back arrow, "All
 * photos" and the count), the category chips (All 24 / Exterior / Interior / Aerial / Floor plans / Amenities, a
 * single-select radio group that filters the photos; a sideways row at 390) and a 3-column masonry grid (390: a
 * full-width photo then two halves). Clicking any photo opens the lightbox at that photo.
 *
 * Lightbox (1507:59500, 390: 1507:59592): dark, "Close" at the top left, category · "n / count" at the right
 * (390: the counter only, the category over the caption), the big image with the caption under it, white round
 * prev / next buttons beside it (from 768; arrow keys too) and a clickable thumbnail strip that keeps the current
 * thumb in view. Swipe left / right on the image to move (touch or mouse). It steps through the photos of the
 * grid's current category (all 24 when opened from the page), wrapping at the ends. The new photo is announced.
 *
 * Escape closes the top layer (lightbox back to the grid when it was opened from there, else the gallery);
 * "Back to property" and "Close" do the same. Tab is kept inside the open layer.
 */
export function PropertyGallery({ copy, name, start, onClose }: { copy: GalleryCopy; name: string; start: GalleryStart; onClose: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<string>(ALL);
  const [lightbox, setLightbox] = useState<{ list: GalleryPhoto[]; i: number; fromGrid: boolean } | null>(() =>
    start.view === "lightbox" ? { list: copy.photos, i: Math.max(0, start.n - 1), fromGrid: false } : null,
  );
  const showGrid = start.view === "grid";
  const titleId = useId();

  const photos = useMemo(() => (filter === ALL ? copy.photos : copy.photos.filter((p) => p.category.id === filter)), [copy.photos, filter]);

  useScrollLock(true);
  useEffect(() => setMounted(true), []);

  // The page behind leaves the tab order and the accessibility tree
  useEffect(() => {
    if (!mounted) return;
    const root = rootRef.current;
    const hidden = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== root && !el.inert && el.tagName !== "SCRIPT",
    );
    hidden.forEach((el) => (el.inert = true));
    return () => hidden.forEach((el) => (el.inert = false));
  }, [mounted]);

  useEffect(() => {
    if (mounted && showGrid) backRef.current?.focus();
  }, [mounted, showGrid]);

  const closeLightbox = useCallback(() => {
    if (!lightbox?.fromGrid) {
      onClose();
      return;
    }
    const n = lightbox.list[lightbox.i]?.n;
    setLightbox(null);
    requestAnimationFrame(() => gridRef.current?.querySelector<HTMLElement>(`[data-photo="${n}"]`)?.focus());
  }, [lightbox, onClose]);

  // Escape closes the top layer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      if (lightbox) closeLightbox();
      else onClose();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [lightbox, closeLightbox, onClose]);

  if (!mounted) return null;

  const options = [{ id: ALL, label: `${copy.all} ${copy.photos.length}` }, ...copy.categories];

  return createPortal(
    <div ref={rootRef} data-gallery>
      {showGrid && (
        <div
          ref={gridRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          inert={!!lightbox}
          onKeyDown={trapTab}
          className="anim-fade fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-white sb-pad"
        >
          <div className="sticky top-0 z-[1] border-b border-line bg-white">
            <div className="mx-auto flex h-14 max-w-(--page-max) items-center gap-3 px-4 md:h-[68px] md:gap-4 md:px-10">
              <button
                ref={backRef}
                type="button"
                onClick={onClose}
                aria-label={copy.back}
                className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-btn px-2 text-[15px] font-medium leading-[1.5] text-ink"
              >
                <Icon name="arrow_back" size={24} />
                <span className="hidden md:inline">{copy.back}</span>
              </button>
              <h2 id={titleId} className="min-w-0 flex-1 text-[17px] font-medium leading-[1.5] text-ink md:sr-only">
                {copy.allPhotos}
                <span className="sr-only">: {name}</span>
              </h2>
              <p className="text-[15px] leading-[1.5] text-muted md:hidden" aria-hidden="true">
                {photos.length}
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-(--page-max) px-4 pb-10 pt-5 md:px-10 md:pb-16 md:pt-[27px]">
            <FilterPills
              label="Photo categories"
              options={options}
              value={filter}
              onChange={setFilter}
              className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:gap-2.5 md:overflow-visible md:px-0 [&>*]:shrink-0 [&>*]:whitespace-nowrap"
            />
            <p className="sr-only" aria-live="polite">
              {photos.length} photos
            </p>
            <div className="@container mt-3 md:mt-5">
              <ul
                className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-x-3 md:gap-y-0 md:[grid-auto-rows:calc((100cqw_-_24px)_/_3_*_42_/_440)]"
                aria-label={copy.allPhotos}
              >
                {photos.map((p, i) => {
                  const slot = SLOTS[i % SLOTS.length];
                  const row = Math.floor(i / SLOTS.length) * BLOCK_ROWS + slot.r + 1;
                  const wide = i % 3 === 0;
                  return (
                    <li
                      key={p.n}
                      className={`md:aspect-auto md:pb-3 md:[grid-column:var(--c)] md:[grid-row:var(--r)] ${wide ? "col-span-2 aspect-[358/210] md:col-span-1" : "aspect-[175/140]"}`}
                      style={{ "--c": slot.c, "--r": `${row} / span ${slot.s}` } as React.CSSProperties}
                    >
                      <button
                        type="button"
                        data-photo={p.n}
                        onClick={() => setLightbox({ list: photos, i, fromGrid: true })}
                        aria-label={`${p.category.label}, photo ${i + 1} of ${photos.length}`}
                        className="group block size-full overflow-hidden rounded-control"
                      >
                        <ImagePlaceholder className="size-full transition-opacity group-hover:opacity-85" iconSize={32} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
      {lightbox && <Lightbox copy={copy} name={name} list={lightbox.list} index={lightbox.i} onIndex={(i) => setLightbox({ ...lightbox, i })} onClose={closeLightbox} />}
    </div>,
    document.body,
  );
}

function Lightbox({
  copy,
  name,
  list,
  index,
  onIndex,
  onClose,
}: {
  copy: GalleryCopy;
  name: string;
  list: GalleryPhoto[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const stripRef = useRef<HTMLUListElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const first = useRef(true);
  const photo = list[index];
  const count = list.length;
  const go = useCallback((d: number) => onIndex((index + d + count) % count), [index, count, onIndex]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Arrow keys move between photos
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        go(e.key === "ArrowRight" ? 1 : -1);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        onIndex(e.key === "Home" ? 0 : count - 1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onIndex, count]);

  // Keep the current thumbnail in view (scrolls the strip only, never the page; offsets are page pixels)
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const reduce = first.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    first.current = false;
    strip.scrollTo({ left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  }, [index]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swipe.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  const navBtn = (dir: 1 | -1) => (
    <button
      type="button"
      onClick={() => go(dir)}
      aria-label={dir === 1 ? "Next photo" : "Previous photo"}
      className={`absolute top-1/2 hidden size-[50px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink transition-colors hover:bg-line md:flex ${
        dir === 1 ? "-right-[72px]" : "-left-[74px]"
      }`}
    >
      <Icon name={dir === 1 ? "chevron_right" : "chevron_left"} size={26} />
    </button>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photos of ${name}`}
      onKeyDown={trapTab}
      className="anim-fade fixed inset-0 z-[60] flex flex-col bg-ink text-white sb-pad [&_*:focus-visible]:outline-white"
    >
      <div className="mx-auto flex h-[72px] w-full max-w-(--page-max) shrink-0 items-center gap-3 px-4 md:h-[100px] md:gap-4 md:px-8">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={copy.close}
          className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-btn px-2 text-[15px] font-medium leading-[1.5]"
        >
          <Icon name="close" size={24} />
          <span className="hidden md:inline">{copy.close}</span>
        </button>
        <span className="flex-1" />
        <p className="flex items-center gap-4 whitespace-nowrap text-[15px] leading-[1.5]">
          <span className="hidden md:inline">{photo.category.label}</span>
          <span aria-hidden="true" className="hidden opacity-50 md:inline">
            ·
          </span>
          <span className="font-medium">
            {index + 1} / {count}
          </span>
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-end pb-4 md:justify-start md:pb-10 md:pt-2.5">
        <div className="relative w-[min(100%,calc((var(--full-h)-310px)*390/420))] md:w-[min(900px,calc(100%-248px),calc((var(--full-h)-290px)*900/520))]">
          <div onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipe.current = null)} className="touch-pan-y select-none">
            <ImagePlaceholder
              key={photo.n}
              label={`${photo.category.label}, photo ${index + 1} of ${count}: ${copy.caption}`}
              className="anim-fade aspect-[390/420] w-full md:aspect-[900/520] md:rounded-[10px]"
              iconSize={56}
            />
          </div>
          {navBtn(-1)}
          {navBtn(1)}
          <div className="flex flex-col gap-1 px-4 pt-5 leading-[1.5] md:px-0 md:pt-4">
            <p className="text-[13px] font-medium opacity-60 md:hidden">{photo.category.label}</p>
            <p className="text-[15px] opacity-90 md:text-[14px] md:opacity-80">{copy.caption}</p>
          </div>
          <ul
            ref={stripRef}
            aria-label="Thumbnails"
            className="no-scrollbar relative mt-10 flex gap-2 overflow-x-auto px-4 md:mt-[33px] md:gap-2.5 md:px-0"
          >
            {list.map((p, i) => (
              <li key={p.n} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onIndex(i)}
                  aria-label={`${p.category.label}, photo ${i + 1} of ${count}`}
                  aria-current={i === index ? "true" : undefined}
                  className={`block h-[52px] w-[72px] overflow-hidden rounded-btn transition-opacity md:h-[70px] md:w-[104px] ${i === index ? "" : "opacity-45 hover:opacity-70"}`}
                >
                  <ImagePlaceholder className="size-full" icon={false} />
                </button>
              </li>
            ))}
          </ul>
          <p className="px-4 pt-4 text-[12px] leading-[1.5] opacity-55 md:hidden">{copy.swipeHint}</p>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {`Photo ${index + 1} of ${count}, ${photo.category.label}`}
      </p>
    </div>
  );
}
