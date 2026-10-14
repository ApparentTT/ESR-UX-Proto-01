import type { Ref } from "react";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SmartLink } from "@/components/ui/SmartLink";
import { HIT } from "@/components/ui/type";

/** The card's lines as drawn in the "selected" variant (placeholders until there is market data). */
export const MAP_CARD_FACTS = [
  "Number of properties",
  "Assets under development",
  "[Optional] Number of data centers in progress",
];

/**
 * The market card that pops out of the "We span" map when a market is selected (Figma InteractiveMap
 * "selected", 592:49404 / Profile card 679:24020): white, 1px black border, r7, 16px padding; a grey
 * image placeholder (281 x 177, r8) with a 24px white close button in its top-right corner; the
 * SemiBold 24/1.3 name, three Medium 16 lines 8px apart, then "Explore {name}" (Bold 13 underlined
 * + arrow_outward) at the foot.
 *
 * From 1280 it overlays the map (315 wide, see MapExplorer); below that it sits under the map at full
 * width: stacked at 390, image beside the text from 768. A labelled region; MapExplorer announces it.
 */
export function MapMarketCard({
  id,
  name,
  facts = MAP_CARD_FACTS,
  href = "/jp",
  onClose,
  closeRef,
  className = "",
}: {
  /** id prefix for the heading (aria-labelledby) */
  id: string;
  name: string;
  facts?: string[];
  href?: string | null;
  onClose: () => void;
  closeRef?: Ref<HTMLButtonElement>;
  className?: string;
}) {
  const headingId = `${id}-card-title`;
  return (
    <section
      aria-labelledby={headingId}
      className={`anim-pop relative grid gap-3 rounded-[7px] border border-black bg-white p-4 [animation-duration:240ms] md:grid-cols-[minmax(0,282px)_minmax(0,1fr)] md:gap-6 xl:flex xl:flex-col xl:gap-[11px] ${className}`}
    >
      <ImagePlaceholder icon={false} className="h-[150px] rounded-control md:h-[177px] xl:w-full" />
      <div className="flex min-w-0 flex-col gap-4 xl:min-h-[169px] xl:justify-between">
        <div className="flex flex-col gap-2 text-ink">
          <h3 id={headingId} className="pr-10 text-[24px] font-semibold leading-[1.3] md:pr-0">
            {name}
          </h3>
          <ul role="list" className="flex flex-col gap-2 text-[16px] font-medium leading-[1.2] tracking-[-0.02em]">
            {facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <SmartLink
          href={href}
          className={`${HIT} group inline-flex w-fit items-center gap-3 text-[13px] font-bold leading-5 text-[#393939] underline underline-offset-2 hover:text-ink`}
        >
          {`Explore ${name}`}
          <Icon
            name="arrow_outward"
            size={18}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </SmartLink>
      </div>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={`Close ${name}`}
        className="absolute right-6 top-6 flex size-6 items-center justify-center rounded-btn bg-white text-ink before:absolute before:-inset-2 before:content-[''] hover:bg-surface md:left-[266px] md:right-auto xl:left-auto xl:right-[29px] xl:top-[25px]"
      >
        <Icon name="close_small" size={24} />
      </button>
    </section>
  );
}
