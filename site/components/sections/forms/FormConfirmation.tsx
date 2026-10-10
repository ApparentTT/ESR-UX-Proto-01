"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Inline greyscale confirmation shown in place of a prototype form after a valid submit
 * (no success state is designed). Takes focus so screen readers announce it; nothing navigates.
 */
export function FormConfirmation({
  message,
  note = "This is a prototype, nothing was sent.",
  onReset,
  resetLabel = "Start again",
}: {
  /** The spec's success copy, e.g. "Thanks — you're subscribed." */
  message: string;
  note?: string;
  /** Shows the form again (prototype convenience) */
  onReset?: () => void;
  resetLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      // Programmatic focus target only: no ring on the card itself
      style={{ outline: "none" }}
      className="anim-pop flex items-start gap-4 rounded-card border border-line bg-white p-6 lg:p-7"
    >
      <Icon name="check_circle" size={28} className="text-ink" />
      <div className="flex min-w-0 flex-col items-start gap-1">
        <p className="text-[18px] font-medium leading-[1.45] text-ink lg:text-[20px]">{message}</p>
        <p className="text-[14px] leading-[1.5] text-muted">{note}</p>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mt-3 text-[14px] font-medium leading-[1.45] text-ink underline underline-offset-4 hover:text-black"
          >
            {resetLabel}
          </button>
        )}
      </div>
    </div>
  );
}
