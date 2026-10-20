"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { ACTION_BUTTON, type ActionVariant } from "./actionStyles";
import { PANEL, PANEL_ITEM, usePopover } from "./usePopover";

export type ShareCopy = { share: string; copy: string; copied: string; email: string; linkedin: string; x: string; line: string };

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
 * Share (1507:52111): white, 1px line border, radius 8, Medium 14 with the share icon. The menu is not drawn.
 * On touch devices with the Web Share API it opens the system share sheet; otherwise a small
 * disclosure menu: Copy link (shows "Link copied", announced politely), Email (mailto with subject and body),
 * LinkedIn, X and LINE (each opens in a new tab). Escape and a click outside close it and focus returns to Share.
 * `variant` gives the sticky bar's compact and icon-only looks (see actionStyles).
 */
export function ShareMenu({
  title,
  text,
  copy,
  panelClassName = "left-0",
  variant = "outline",
}: {
  title: string;
  text: string;
  copy: ShareCopy;
  /** Panel alignment under the button */
  panelClassName?: string;
  variant?: ActionVariant;
}) {
  const { open, setOpen, close, wrapRef, buttonRef, onPanelKeyDown } = usePopover();
  const panelId = useId();
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    firstRef.current?.focus();
  }, [open]);

  const onShare = async () => {
    const href = window.location.href.split("#")[0];
    setUrl(href);
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (!open && touch && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url: href });
        return;
      } catch (err) {
        if ((err as DOMException)?.name === "AbortError") return;
        // Not allowed or failed: fall back to the menu
      }
    }
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

  const enc = encodeURIComponent;
  const links = [
    {
      key: "email",
      label: copy.email,
      href: `mailto:?subject=${enc(title)}&body=${enc(`${text}\n\n${url}`)}`,
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
    <div ref={wrapRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onShare}
        className={ACTION_BUTTON[variant]}
      >
        <Icon name="share" size={variant === "icon" ? 20 : 18} />
        <span className={variant === "icon" ? "sr-only" : undefined}>{copy.share}</span>
      </button>
      <div id={panelId} hidden={!open} onKeyDown={onPanelKeyDown} className={`${PANEL} ${panelClassName}`}>
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
        </ul>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {status}
      </span>
    </div>
  );
}
