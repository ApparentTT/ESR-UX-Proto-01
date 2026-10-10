/**
 * B11 LogoMarquee content. Logos are placeholders (7 per set) and are not links.
 * PORT §5 and PROP §6 are identical; INV §7 has no heading top padding and a 64 / 64 logo row.
 */
import type { LogoMarqueeProps } from "@/components/sections/carousels/LogoMarquee";

/** PORT §5 "Our customers" */
export const PORT_CUSTOMERS: LogoMarqueeProps = { title: "Our customers", count: 7, spacing: "customers", listLabel: "Customer logos" };

/** PROP §6 "Our customers" (identical to PORT §5) */
export const PROP_CUSTOMERS: LogoMarqueeProps = PORT_CUSTOMERS;

/** INV §7 "Our investors" */
export const INV_INVESTORS: LogoMarqueeProps = { title: "Our investors", count: 7, spacing: "investors", listLabel: "Investor logos" };
