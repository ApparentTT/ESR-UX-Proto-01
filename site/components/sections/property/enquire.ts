/**
 * Moves the visitor to the property enquiry form (FormBlock with id ENQUIRY_ID): scrolls it into view, optionally
 * pre-fills the Message, and focuses the first field. Used by the drawn "Enquire about this property" button, each
 * Available space row's "Enquire" and the sticky "Enquire now" bar. Browser only (call from event handlers).
 */
export const ENQUIRY_ID = "property-enquiry";

/** Sets a React-controlled field's value and fires the input event React listens for (so counters update). */
function setFieldValue(el: HTMLTextAreaElement | HTMLInputElement, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

export function goToEnquiry(message?: string) {
  const section = document.getElementById(ENQUIRY_ID);
  if (!section) return;
  if (message) {
    const field = section.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
    if (field) setFieldValue(field, message.slice(0, field.maxLength > 0 ? field.maxLength : undefined));
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  // The first field, or (after a sent enquiry) the success card's first control
  const target = section.querySelector<HTMLElement>("input, select, textarea, button, a[href], [tabindex='-1']");
  target?.focus({ preventScroll: true });
}
