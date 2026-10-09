import { SmartLink } from "@/components/ui/SmartLink";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Tag } from "@/components/ui/Tag";
import { T } from "@/components/ui/type";

export type FeatureCardData = {
  /** Optional outline tag above the title, e.g. "Industrial and logistics" */
  tag?: string;
  title: string;
  description: string;
  /** Built route, or null for an inert link (page not wireframed) */
  href: string | null;
};

/**
 * HOME §4 FeatureCard: white card, 2px line border, media on top, then tag, Bold 20 title and
 * muted 16/24 description. The whole card is the link; hover darkens the border and underlines the title.
 */
export function FeatureCard({ tag, title, description, href, headingLevel: H = "h3" }: FeatureCardData & { headingLevel?: "h2" | "h3" | "h4" }) {
  return (
    <SmartLink
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-card border-2 border-line bg-white transition-colors hover:border-muted"
    >
      <ImagePlaceholder className="aspect-[374.5/230] w-full" />
      <div className="flex flex-col gap-4 p-5 lg:p-6">
        {tag && (
          <Tag size="md" className="-mb-1 self-start">
            {tag}
          </Tag>
        )}
        <H className="text-[18px] font-bold leading-[1.3] tracking-[-0.02em] text-ink underline-offset-4 group-hover:underline lg:text-[20px]">{title}</H>
        <p className={T.body16}>{description}</p>
      </div>
    </SmartLink>
  );
}
