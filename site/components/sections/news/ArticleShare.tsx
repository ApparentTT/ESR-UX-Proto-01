import { ShareMenu, type ShareCopy } from "@/components/sections/property/ShareMenu";

/**
 * Article Share (1508:34639): the dark ink button with the share icon, Medium 15 "Share" (icon only at 390,
 * 1519:37453). The menu is not drawn: it is the property page's Share menu (ShareMenu: Copy link, Email,
 * LinkedIn, X, LINE, WeChat with its QR panel), so the two stay the same across the site.
 */
export function ArticleShare({ title, copy, className = "" }: { title: string; copy: ShareCopy; className?: string }) {
  return (
    <ShareMenu
      title={title}
      copy={copy}
      className={className}
      panelClassName="right-0"
      buttonClassName="inline-flex h-full min-h-[50px] items-center justify-center gap-2 rounded-btn bg-ink px-[26px] py-3.5 text-[15px] font-medium leading-[1.5] text-white transition-colors hover:bg-black aria-expanded:bg-black"
      labelClassName="sr-only md:not-sr-only"
    />
  );
}
