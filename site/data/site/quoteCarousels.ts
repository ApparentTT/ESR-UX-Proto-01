/**
 * B10 QuoteCarousel content (PROP §5 customer, PEOPLE §5 employee), verbatim.
 * Only one slide is designed per carousel and the pager implies three, so the slide repeats verbatim.
 * "Watch the story" and "Read their story" have no wireframed destination, so both are inert (href null).
 */
import type { QuoteCarouselProps, QuoteSlide } from "@/components/sections/carousels/QuoteCarousel";

const repeat = (slide: QuoteSlide, n = 3): QuoteSlide[] => Array.from({ length: n }, () => slide);

/** PROP §5: customer variant, dots, white 30px strip above the band */
export const PROP_CUSTOMER_QUOTES: QuoteCarouselProps = {
  label: "Customer quotes",
  pager: "dots",
  topStrip: true,
  slides: repeat({
    quote: "“Write a quote here from one of your customers. Quotes are a great way to build confidence in your products or services.”",
    attribution: "Jane DOE • CEO of MyCompany",
    cta: { label: "Watch the story", href: null },
  }),
};

/** PEOPLE §5: employee variant, bars. The drawn "Read their story →" renders as a link with an arrow icon. */
export const PEOPLE_EMPLOYEE_QUOTES: QuoteCarouselProps = {
  label: "Employee quotes",
  pager: "bars",
  slides: repeat({
    quote: "“Write a quote here from someone in the team about what it's like to work at ESR.”",
    attribution: "Name • Role, Market",
    attributionLink: { label: "Read their story", href: null },
  }),
};
