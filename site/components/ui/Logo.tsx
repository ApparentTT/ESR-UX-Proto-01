/** Wireframe logo: grey disc and wordmark. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="size-7 rounded-full bg-line" />
      <span className="text-[17px] font-semibold tracking-tight text-ink">ESR</span>
    </span>
  );
}
