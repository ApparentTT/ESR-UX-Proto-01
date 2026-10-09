/** Wireframe logo: grey disc and bold wordmark. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[9px] py-1 ${className}`}>
      <span aria-hidden="true" className="size-[29px] rounded-full bg-line" />
      <span className="text-[17.78px] font-bold tracking-[-0.02em] text-black">ESR</span>
    </span>
  );
}
