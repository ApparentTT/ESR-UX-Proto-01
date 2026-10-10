/**
 * Flat grey image placeholder with the Material image icon centred.
 * Decorative by default, so cards that wrap it in a link are named by their text alone.
 * Pass label only where the placeholder stands in for meaningful content on its own.
 */
export function ImagePlaceholder({ className = "", iconSize = 32, label }: { className?: string; iconSize?: number; label?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-placeholder ${className}`}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <span aria-hidden="true" className="icon text-white" style={{ fontSize: iconSize }}>
        image
      </span>
    </div>
  );
}
