"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

export type PanelVariant = "popover" | "sheet" | "modal" | "fullsheet";

type FooterProps = {
  resetLabel: string;
  onReset: () => void;
  count: number;
  onApply: () => void;
};

type Props = {
  open: boolean;
  variant: PanelVariant;
  title: string;
  onClose: () => void;
  /** Popover only: the element the panel hangs from. Used for outside-click and focus return. */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** Element to focus when opened. Defaults to the first focusable element in the body. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  footer: FooterProps;
  children: React.ReactNode;
  /** Popover width in px */
  width?: number;
  /** Popover: render a visible heading row. Sheets and modals always do. */
  bodyClassName?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function showLabel(n: number) {
  return `Show ${n.toLocaleString("en-US")} ${n === 1 ? "property" : "properties"}`;
}

function PanelFooter({ resetLabel, onReset, count, onApply, sheet, wide }: FooterProps & { sheet: boolean; wide?: boolean }) {
  return (
    <div className={`flex shrink-0 items-center justify-between gap-4 border-t border-line bg-white ${sheet ? "px-5 py-4" : wide ? "px-8 py-5" : "px-5 py-3.5"}`}>
      <button type="button" onClick={onReset} className="rounded-btn px-1 py-2 text-sm text-muted hover:text-ink hover:underline">
        {resetLabel}
      </button>
      <button
        type="button"
        onClick={onApply}
        className={`inline-flex h-11 items-center justify-center rounded-btn bg-ink px-5 text-sm font-medium text-white tabular-nums transition-colors hover:bg-black ${
          sheet ? "flex-1" : ""
        }`}
      >
        <span aria-live="polite">{showLabel(count)}</span>
      </button>
    </div>
  );
}

/**
 * One frame for every filter surface: anchored popover (tablet and desktop dropdowns),
 * bottom sheet (dropdowns under 768), centred modal (all filters on desktop) and
 * full-height sheet (all filters under 768). Footer shows the live count.
 */
export function PanelFrame({ open, variant, title, onClose, anchorRef, initialFocusRef, footer, children, width = 380, bodyClassName = "" }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const returnFocus = useRef<HTMLElement | null>(null);
  const isModal = variant !== "popover";

  // Focus in on open, back to the trigger on close.
  useEffect(() => {
    if (!open) return;
    returnFocus.current = (document.activeElement as HTMLElement) ?? null;
    const t = requestAnimationFrame(() => {
      const target = initialFocusRef?.current ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(t);
      const el = returnFocus.current;
      if (el && document.contains(el) && el.tagName !== "INPUT") el.focus({ preventScroll: true });
    };
  }, [open, initialFocusRef]);

  // Escape closes; Tab is trapped in modal variants.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab" && isModal && panelRef.current) {
        const els = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, isModal]);

  // Popover: outside click closes (and discards the draft).
  useEffect(() => {
    if (!open || variant !== "popover") return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || anchorRef?.current?.contains(t)) return;
      onClose();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, variant, onClose, anchorRef]);

  // Modal variants lock page scroll.
  useEffect(() => {
    if (!open || !isModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isModal]);

  // Popover: keep inside the viewport horizontally.
  useLayoutEffect(() => {
    if (!open || variant !== "popover" || !panelRef.current) return;
    const measure = () => {
      const el = panelRef.current;
      if (!el) return;
      el.style.transform = "";
      const r = el.getBoundingClientRect();
      const over = r.right - (window.innerWidth - 16);
      setShift(over > 0 ? -over : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, variant]);

  if (!open) return null;

  if (variant === "popover") {
    return (
      <div
        ref={panelRef}
        role="dialog"
        aria-label={title}
        className="anim-pop absolute left-0 top-full z-40 mt-2 flex max-h-[min(640px,calc(100dvh-var(--bar-h,120px)-24px))] flex-col overflow-hidden rounded-card border border-line bg-white shadow-panel"
        style={{ width, maxWidth: "calc(100vw - 32px)", transform: shift ? `translateX(${shift}px)` : undefined }}
      >
        <div className={`thin-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5 ${bodyClassName}`}>{children}</div>
        <PanelFooter {...footer} sheet={false} />
      </div>
    );
  }

  const sheet = variant === "sheet" || variant === "fullsheet";
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div className="anim-fade absolute inset-0 bg-scrim" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        className={`relative flex w-full flex-col overflow-hidden bg-white ${
          sheet
            ? `anim-sheet rounded-t-[16px] ${variant === "fullsheet" ? "h-[calc(100dvh-24px)]" : "max-h-[calc(100dvh-48px)]"}`
            : "anim-pop mx-6 max-h-[calc(100dvh-80px)] max-w-[720px] rounded-[16px] shadow-panel"
        }`}
      >
        {sheet && <div aria-hidden="true" className="mx-auto mt-3 h-1 w-9 shrink-0 rounded-full bg-line" />}
        <div className={`flex shrink-0 items-center justify-between border-b border-line ${sheet ? "px-5 pb-4 pt-3" : "px-8 py-6"}`}>
          <h2 id="panel-title" className={`font-semibold ${sheet ? "text-xl" : "text-2xl"}`}>
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`} className="-mr-2 inline-flex size-11 items-center justify-center rounded-btn">
            <Icon name="close" size={24} />
          </button>
        </div>
        <div className={`thin-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain ${sheet ? "px-5 py-5" : "px-8 py-6"} ${bodyClassName}`}>
          {children}
        </div>
        <PanelFooter {...footer} sheet={sheet} wide={!sheet} />
      </div>
    </div>,
    document.body,
  );
}
