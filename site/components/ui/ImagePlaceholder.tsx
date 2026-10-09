/** Flat grey image placeholder with the Material image icon centred. */
export function ImagePlaceholder({ className = "", iconSize = 32 }: { className?: string; iconSize?: number }) {
  return (
    <div className={`flex items-center justify-center bg-placeholder ${className}`} role="img" aria-label="Image placeholder">
      <span aria-hidden="true" className="icon text-white" style={{ fontSize: iconSize }}>
        image
      </span>
    </div>
  );
}
