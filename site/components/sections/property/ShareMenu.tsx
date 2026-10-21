"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { ACTION_BUTTON, type ActionVariant } from "./actionStyles";
import { PANEL, PANEL_ITEM, usePopover } from "./usePopover";

export type ShareCopy = {
  share: string;
  copy: string;
  copied: string;
  email: string;
  linkedin: string;
  x: string;
  line: string;
  wechat: string;
  /** The WeChat panel: title, instruction, the QR placeholder's accessible name and its Back / Close controls */
  wechatTitle: string;
  wechatBody: string;
  wechatQr: string;
  back: string;
  close: string;
};

/** A plain "X" mark for the X (Twitter) row: Material Symbols has no brand glyphs */
function XMark() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden="true" focusable="false" className="shrink-0">
      <path d="M2.5 2h3.2l3 4.2L12.3 2h1.6L9.5 7.3 14 14h-3.2L7.6 9.4 3.7 14H2.1l4.7-5.5z" fill="currentColor" />
    </svg>
  );
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / blocked clipboard: the hidden textarea fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/**
 * Share (1507:52111): white, 1px line border, radius 8, Medium 14 with the share icon. A small disclosure menu,
 * the same on every device (no system share sheet, so WeChat is always reachable): Copy link (shows "Link copied",
 * announced politely), Email (mailto with subject and body), LinkedIn, X and LINE (each opens in a new tab), and
 * WeChat, which swaps the list for a "Share on WeChat" panel (QR code placeholder, Back to the list, Close).
 * Focus moves into the menu and into the WeChat panel; Back returns it to WeChat; Escape, Close and a click outside
 * close the menu and focus returns to Share. `variant` gives the sticky bar's compact and icon-only looks
 * (see actionStyles); `buttonClassName` replaces the look entirely (the news article's dark button, ArticleShare).
 */
export function ShareMenu({
  title,
  text,
  copy,
  panelClassName = "left-0",
  variant = "outline",
  buttonClassName,
  labelClassName,
  className = "",
}: {
  title: string;
  /** Email body text before the link (optional) */
  text?: string;
  copy: ShareCopy;
  /** Panel alignment under the button */
  panelClassName?: string;
  variant?: ActionVariant;
  /** Overrides the variant's button classes */
  buttonClassName?: string;
  /** Classes of the visible "Share" label (defaults by variant) */
  labelClassName?: string;
  /** Wrapper classes */
  className?: string;
}) {
  const { open, setOpen, close, wrapRef, buttonRef, onPanelKeyDown } = usePopover();
  const panelId = useId();
  const wechatTitleId = useId();
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const [view, setView] = useState<"menu" | "wechat">("menu");
  /** Where focus goes when the view changes: the list's first item on open, WeChat after Back, Back in the panel */
  const focusNext = useRef<"first" | "wechat" | "back" | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const firstRef = useRef<HTMLButtonElement>(null);
  const wechatRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) {
      setCopied(false);
      setView("menu");
      return;
    }
    const target = focusNext.current ?? "first";
    focusNext.current = null;
    (target === "wechat" ? wechatRef : target === "back" ? backRef : firstRef).current?.focus();
  }, [open, view]);

  const onShare = () => {
    setUrl(window.location.href.split("#")[0]);
    focusNext.current = "first";
    setOpen(!open);
  };

  const onCopy = async () => {
    const ok = await copyText(url || window.location.href.split("#")[0]);
    window.clearTimeout(timer.current);
    setCopied(ok);
    setStatus(ok ? copy.copied : "");
    timer.current = window.setTimeout(() => {
      setCopied(false);
      setStatus("");
    }, 2500);
  };

  const showView = (v: "menu" | "wechat") => {
    focusNext.current = v === "wechat" ? "back" : "wechat";
    setView(v);
  };

  const enc = encodeURIComponent;
  const links = [
    {
      key: "email",
      label: copy.email,
      href: `mailto:?subject=${enc(title)}&body=${enc(text ? `${text}\n\n${url}` : url)}`,
      icon: <Icon name="mail" size={18} />,
      external: false,
    },
    {
      key: "linkedin",
      label: copy.linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      icon: <SocialIcon brand="linkedin" size={16} />,
      external: true,
    },
    { key: "x", label: copy.x, href: `https://x.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`, icon: <XMark />, external: true },
    { key: "line", label: copy.line, href: `https://social-plugins.line.me/lineit/share?url=${enc(url)}`, icon: <Icon name="chat" size={18} />, external: true },
  ];

  return (
    <div ref={wrapRef} className={`relative shrink-0 ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onShare}
        className={buttonClassName ?? ACTION_BUTTON[variant]}
      >
        <Icon name="share" size={variant === "icon" ? 20 : 18} />
        <span className={labelClassName ?? (variant === "icon" ? "sr-only" : undefined)}>{copy.share}</span>
      </button>
      <div id={panelId} hidden={!open} onKeyDown={onPanelKeyDown} className={`${PANEL} ${panelClassName}`}>
        {view === "menu" ? (
          <ul aria-label={copy.share}>
            <li>
              <button ref={firstRef} type="button" data-popover-item onClick={onCopy} className={PANEL_ITEM}>
                <Icon name={copied ? "check" : "link"} size={18} />
                <span className="flex-1">{copied ? copy.copied : copy.copy}</span>
              </button>
            </li>
            {links.map((l) => (
              <li key={l.key}>
                <a
                  href={l.href}
                  data-popover-item
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => close(true)}
                  className={PANEL_ITEM}
                >
                  <span className="inline-flex size-[18px] items-center justify-center">{l.icon}</span>
                  <span className="flex-1">
                    {l.label}
                    {l.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </span>
                  {l.external && <Icon name="open_in_new" size={16} className="text-muted" />}
                </a>
              </li>
            ))}
            <li>
              <button
                ref={wechatRef}
                type="button"
                data-popover-item
                onClick={() => showView("wechat")}
                className={PANEL_ITEM}
              >
                {/* The footer's WeChat glyph (SOCIAL_LINKS) */}
                <span className="inline-flex size-[18px] items-center justify-center">
                  <SocialIcon brand="telegram" size={16} />
                </span>
                <span className="flex-1">{copy.wechat}</span>
                <Icon name="chevron_right" size={18} className="text-muted" />
              </button>
            </li>
          </ul>
        ) : (
          <div role="group" aria-labelledby={wechatTitleId} className="px-2 pb-3 pt-1">
            <div className="flex items-center justify-between gap-2">
              <button
                ref={backRef}
                type="button"
                data-popover-item
                onClick={() => showView("menu")}
                className="focus-inset -ml-1 inline-flex min-h-10 items-center gap-1 rounded-btn px-1 text-[14px] font-medium leading-5 text-ink hover:underline hover:underline-offset-4"
              >
                <Icon name="arrow_back" size={18} />
                {copy.back}
              </button>
              <button
                type="button"
                data-popover-item
                aria-label={copy.close}
                onClick={() => close(true)}
                className="focus-inset inline-flex size-10 items-center justify-center rounded-btn text-ink hover:bg-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <p id={wechatTitleId} className="mt-2 text-[16px] font-bold leading-6 text-ink">
              {copy.wechatTitle}
            </p>
            <div
              role="img"
              aria-label={copy.wechatQr}
              className="mx-auto mt-3 flex aspect-square w-full max-w-[180px] items-center justify-center rounded-control bg-line text-muted"
            >
              <Icon name="qr_code" size={56} />
            </div>
            <p className="mt-3 text-center text-[14px] leading-5 text-body">{copy.wechatBody}</p>
          </div>
        )}
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {status}
      </span>
    </div>
  );
}
