/** Max content width 1280 with 80px gutters on desktop, 40px on tablet, 24px on mobile. */
export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return <Tag className={`mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-20 ${className}`}>{children}</Tag>;
}
