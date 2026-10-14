"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import type { EnquirySuccessCopy } from "./formPresets";

/**
 * Shared enquiry form states (Figma "Enquiry form — states" 1265:30373), used by every FormBlock variant and
 * ContactEnquiryForm: the error summary (1265:33788), the loading submit (1265:33852) and the success card
 * (1265:33904). Nothing is sent: a valid submit shows "Sending" for SEND_DELAY ms, then the success card.
 */

export type EnquiryStatus = "idle" | "sending" | "sent";
export const SEND_DELAY = 1200;

/** idle → sending (SEND_DELAY) → sent; reset() goes back to idle. The timer is cleared on unmount. */
export function useEnquiryStatus(delay = SEND_DELAY) {
  const [status, setStatus] = useState<EnquiryStatus>("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const send = () => {
    setStatus("sending");
    timer.current = window.setTimeout(() => setStatus("sent"), delay);
  };
  const reset = () => {
    window.clearTimeout(timer.current);
    setStatus("idle");
  };
  return { status, send, reset };
}

const COUNT = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

/**
 * Error summary under the intro copy (drawn: 1px error border, error-bg fill, r8, padding 14/16, gap 10,
 * 20px "error" icon, Regular 14/1.48). A polite live region that is always present, so it is announced when it
 * appears and when the count changes; focus itself goes to the first invalid field.
 */
export function ErrorSummary({ count, className = "" }: { count: number; className?: string }) {
  return (
    <div aria-live="polite" className={count > 0 ? className : ""}>
      {count > 0 && (
        <p className="anim-pop flex items-start gap-2.5 rounded-control border border-error bg-error-bg px-4 py-3.5 text-[14px] leading-[1.48] text-error">
          <Icon name="error" size={20} className="shrink-0" />
          <span className="min-w-0 flex-1">
            {count === 1 ? "One field needs" : `${COUNT[count] ?? count} fields need`} fixing before we can send this.
          </span>
        </p>
      )}
    </div>
  );
}

/**
 * Submit with the drawn loading treatment: a spinning "progress_activity" + "Sending". While sending the button
 * stays focusable (aria-disabled, so focus is not lost) and a visually hidden live region announces it.
 */
export function SubmitButton({
  sending,
  label,
  variant,
  className = "",
}: {
  sending: boolean;
  label: string;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <>
      <Button type="submit" variant={variant} aria-disabled={sending || undefined} className={`${className} ${sending ? "cursor-wait" : ""}`}>
        {sending ? (
          <>
            <Icon name="progress_activity" size={18} className="spin" />
            Sending
          </>
        ) : (
          label
        )}
      </Button>
      <span aria-live="polite" className="sr-only">
        {sending ? "Sending your enquiry" : ""}
      </span>
    </>
  );
}

/**
 * Success card that replaces the whole form row (drawn 1265:33904 / mobile 1265:33925): 1px line border, r12,
 * padding 36/32 (28/24 on mobile), gap 14. 48px ink circle with a white check, Bold 26/1.48 heading (22 on
 * mobile), 15/1.48 muted body, "Reference" + [XXXXXX] chip, then the dark primary and outline secondary
 * (full width and stacked on mobile). Focus moves to the heading on mount.
 */
export function EnquirySuccess({
  copy,
  onReset,
  headingLevel: H = "h2",
  card = "clear",
  className = "",
}: {
  copy: EnquirySuccessCopy;
  onReset: () => void;
  headingLevel?: "h2" | "h3";
  /** "white" on the grey form band, where the drawn line border would not show */
  card?: "clear" | "white";
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div
      className={`anim-pop flex w-full min-w-0 flex-col items-start gap-3.5 rounded-card border border-line px-6 py-7 md:px-8 md:py-9 ${
        card === "white" ? "bg-white" : ""
      } ${className}`}
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-ink text-white">
        <Icon name="check" size={24} />
      </span>
      <H ref={ref} tabIndex={-1} className="text-[22px] font-bold leading-[1.48] text-ink outline-none md:text-[26px]">
        {copy.title}
      </H>
      <p className="text-[15px] leading-[1.48] text-muted-surface">{copy.body}</p>
      {copy.reference && (
        <p className="flex items-center gap-2.5 pt-1">
          <span className="text-[13px] leading-[1.48] text-muted-surface">Reference</span>
          <span className="rounded-[4px] bg-surface px-2.5 py-[5px] text-[13px] font-medium leading-[1.48] text-ink">{copy.reference}</span>
        </p>
      )}
      <div className="flex w-full flex-col gap-3 pt-1.5 md:flex-row">
        {copy.primary && (
          <Button href={copy.primary.href} variant="dark" icon="arrow_forward" className="w-full md:w-auto">
            {copy.primary.label}
          </Button>
        )}
        <Button variant="outlineDark" onClick={onReset} className="w-full md:w-auto">
          {copy.resetLabel}
        </Button>
      </div>
    </div>
  );
}
