"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SmartLink } from "@/components/ui/SmartLink";
import { PropertyGallery, type GalleryCopy, type GalleryStart } from "./PropertyGallery";

/**
 * "MediaGallery" (1507:52114): the hero media (870 x 460, radius 12) with a white round play button, and two
 * images stacked beside it (428 x 226, 8px apart), "Show all 24 photos" on the lower one. 390 (1507:58992): the
 * hero only, full bleed and 300 tall, with a smaller play button and "Show all" at its bottom right.
 * "Show all photos" opens the gallery grid; the hero and the two images open the lightbox at their photo
 * (photos 1 to 3). The video is a placeholder: its play button is an inert link (the "not part of the prototype"
 * notice). Focus returns to the control that opened the gallery when it closes.
 */
export function PropertyMedia({ gallery, name }: { gallery: GalleryCopy; name: string }) {
  const [start, setStart] = useState<GalleryStart | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const total = gallery.photos.length;

  const open = (s: GalleryStart) => (e: React.MouseEvent<HTMLElement>) => {
    opener.current = e.currentTarget;
    setStart(s);
  };
  const close = () => {
    setStart(null);
    const el = opener.current;
    requestAnimationFrame(() => el?.focus({ preventScroll: true }));
  };

  const photo = (n: number, className: string) => {
    const p = gallery.photos[n - 1];
    return (
      <button
        type="button"
        onClick={open({ view: "lightbox", n })}
        aria-label={`Open photo ${n} of ${total}: ${p.category.label}`}
        className={`group absolute inset-0 overflow-hidden ${className}`}
      >
        <ImagePlaceholder className="size-full transition-opacity group-hover:opacity-90" icon={false} />
      </button>
    );
  };

  const showAll = (className: string) => (
    <button
      type="button"
      onClick={open({ view: "grid" })}
      aria-haspopup="dialog"
      className={`absolute items-center gap-1.5 rounded-control bg-white px-3 py-2 text-[13px] font-medium leading-[1.5] text-ink shadow-sm transition-colors hover:bg-surface md:gap-2 md:px-3.5 md:py-2.5 md:text-[14px] ${className}`}
    >
      <Icon name="photo_library" size={18} />
      {gallery.showAll}
    </button>
  );

  return (
    <div className="mx-auto max-w-(--page-max) pb-6 md:px-10 lg:px-[67px]">
      <div role="group" aria-label={`Photos and video of ${name}`} className="grid gap-2 md:aspect-[1306/460] md:grid-cols-[minmax(0,870fr)_minmax(0,428fr)] md:grid-rows-2">
        <div className="relative h-[300px] md:row-span-2 md:h-auto">
          {photo(1, "md:rounded-card")}
          <SmartLink
            href={null}
            aria-label={`Play video of ${name}`}
            className="absolute left-1/2 top-1/2 flex size-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-sm md:size-[72px]"
          >
            <Icon name="play_arrow" size={32} />
          </SmartLink>
          {showAll("bottom-3 right-3 inline-flex md:hidden")}
        </div>
        <div className="relative hidden md:block">{photo(2, "rounded-card")}</div>
        <div className="relative hidden md:block">
          {photo(3, "rounded-card")}
          {showAll("bottom-3 right-2.5 hidden md:inline-flex")}
        </div>
      </div>
      {start && <PropertyGallery copy={gallery} name={name} start={start} onClose={close} />}
    </div>
  );
}
