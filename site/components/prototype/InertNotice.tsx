"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export const INERT_EVENT = "esr:inert-link";

/** A short notice when someone clicks a link to a page that is not part of this prototype, so it never reads as broken. */
export function InertNotice() {
  const [shown, setShown] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onInert = () => {
      setShown(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setShown(false), 2600);
    };
    window.addEventListener(INERT_EVENT, onInert);
    return () => {
      window.removeEventListener(INERT_EVENT, onInert);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex justify-center px-4 lg:top-[88px]">
      {shown && (
        <p className="anim-pop inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white shadow-panel">
          <Icon name="info" size={18} />
          This page is not part of the prototype
        </p>
      )}
    </div>
  );
}
