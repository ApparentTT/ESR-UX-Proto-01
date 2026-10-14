"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/**
 * Disclosure popover state shared by the Share and Downloads menus: a trigger button and a panel in one wrapper.
 * Escape closes and returns focus to the trigger; a pointer press outside closes (focus goes back to the trigger
 * only if it was inside the panel); tabbing out of the wrapper closes without moving focus. Up / Down / Home / End
 * move between the panel's items.
 */
export function usePopover(): {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  close: (focusTrigger?: boolean) => void;
  wrapRef: RefObject<HTMLDivElement | null>;
  buttonRef: RefObject<HTMLButtonElement | null>;
  onPanelKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
} {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((focusTrigger = false) => {
    setOpen(false);
    if (focusTrigger) buttonRef.current?.focus();
  }, []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    if (!open) return;
    const wrap = wrapRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      close(true);
    };
    const onDown = (e: PointerEvent) => {
      if (wrap?.contains(e.target as Node)) return;
      const focusInside = wrap?.contains(document.activeElement);
      close(!!focusInside && document.activeElement !== buttonRef.current);
    };
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (next && !wrap?.contains(next)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    wrap?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      wrap?.removeEventListener("focusout", onFocusOut);
    };
  }, [open, close]);

  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[data-popover-item]"));
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLElement);
    const last = items.length - 1;
    const next = e.key === "Home" ? 0 : e.key === "End" ? last : e.key === "ArrowDown" ? (i < 0 || i === last ? 0 : i + 1) : i <= 0 ? last : i - 1;
    items[next]?.focus();
  };

  return { open, setOpen, toggle, close, wrapRef, buttonRef, onPanelKeyDown };
}

/** Outline button drawn for the About downloads (1138:10707): white, 1px line border, radius 6, Medium 14 */
export const OUTLINE_BTN =
  "inline-flex min-h-[46px] items-center justify-center gap-2 rounded-btn border border-line bg-white px-5 py-3 text-[14px] font-medium leading-[1.45] text-ink transition-colors hover:border-ink aria-expanded:border-ink";

/** Popover panel and its rows */
export const PANEL = "anim-pop absolute z-30 mt-2 w-[min(320px,calc(var(--full-w)-48px))] rounded-control border border-line bg-white p-1.5 shadow-panel";
export const PANEL_ITEM = "focus-inset flex min-h-11 w-full items-center gap-3 rounded-btn px-3 py-2 text-left text-[14px] leading-5 text-ink hover:bg-surface";
