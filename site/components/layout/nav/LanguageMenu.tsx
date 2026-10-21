"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import { GROUP_LANGUAGES } from "@/config/nav";

/** Moves focus among the dropdown's links: Arrow Up / Down (wrapping), Home and End. */
export function focusLanguageOption(list: HTMLElement | null, to: "first" | "last" | "next" | "prev") {
  const links = Array.from(list?.querySelectorAll<HTMLElement>("a") ?? []);
  if (!links.length) return;
  const at = links.indexOf(document.activeElement as HTMLElement);
  const i = to === "first" ? 0 : to === "last" ? links.length - 1 : to === "next" ? (at + 1) % links.length : (at - 1 + links.length) % links.length;
  links[i].focus();
}

const KEYS: Record<string, "first" | "last" | "next" | "prev"> = { ArrowDown: "next", ArrowUp: "prev", Home: "first", End: "last" };

/**
 * The group site's language dropdown (header, next to Find your market): a small white list under its
 * "EN" button, one link per group language, the current one (English) Bold with a check. English stays on
 * the page; the other three are not part of the prototype (inert notice). Arrow keys, Home and End move
 * between the options; Escape and focus leaving close it (SiteHeader).
 */
export function LanguageMenu({ id, labelledBy, animate }: { id: string; labelledBy: string; animate: boolean }) {
  const pathname = usePathname();
  return (
    <div
      id={id}
      className={`absolute right-0 top-full z-[3] mt-2 w-[200px] rounded-[4px] border border-line bg-white py-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)] ${animate ? "anim-pop" : ""}`}
    >
      <ul
        aria-labelledby={labelledBy}
        onKeyDown={(e) => {
          const to = KEYS[e.key];
          if (!to) return;
          e.preventDefault();
          focusLanguageOption(e.currentTarget, to);
        }}
      >
        {GROUP_LANGUAGES.map((l) => (
          <li key={l.text}>
            <SmartLink
              href={l.current ? pathname : null}
              hrefLang={l.hrefLang}
              aria-current={l.current ? "true" : undefined}
              className={`focus-inset flex h-10 items-center justify-between gap-3 px-4 text-[14px] leading-5 hover:bg-surface ${l.current ? "font-bold text-ink" : "font-medium text-body"}`}
            >
              {l.text}
              {l.current && <Icon name="check" size={18} className="text-ink" />}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
