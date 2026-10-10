import { Section, type SectionBg } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { PAD, T } from "@/components/ui/type";

/** One downloadable document. No files exist in the prototype: href null = inert. */
export type DocumentItem = { name: string; href: string | null };
export type DocumentGroup = { label: string; documents: DocumentItem[] };

export type DocumentListProps = {
  /**
   * dottedLeader (SGOV §7 "Policies"): black text, Bold 32 title, 2 columns with Bold 24 headings,
   * rows "name ······ PDF" (the PDF label is the link).
   * downloadRows (CGOV §3 "Documents"): Bold 40 title, 3 columns of divider-separated rows, each row a
   * whole-row link "name · PDF · download icon".
   */
  variant: "dottedLeader" | "downloadRows";
  title: string;
  sub?: string;
  groups: DocumentGroup[];
  /** File-type label after each name, "PDF" */
  format?: string;
  /** downloadRows: 13px note under the groups */
  footnote?: string;
  bg?: SectionBg;
  id?: string;
};

/**
 * B36 DocumentList. Band 80/80. Columns stack below 768 (gap 32); downloadRows uses 2 columns at 768 and
 * 3 from 1024. Rows stay horizontal at every width: names wrap, and the dotted leader shrinks to 16px.
 * Every link is announced as "Download {name} ({format})".
 */
export function DocumentList({ variant, title, sub, groups, format = "PDF", footnote, bg = "white", id = variant === "dottedLeader" ? "policies" : "documents" }: DocumentListProps) {
  const headingId = `${id}-heading`;
  if (variant === "dottedLeader")
    return (
      <Section bg={bg} id={id} aria-labelledby={headingId} className={PAD.data} containerClassName="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5 pb-4 lg:pb-[30px]">
          <h2 id={headingId} className="text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-black lg:text-[32px]">
            {title}
          </h2>
          {sub && <p className="text-[16px] leading-6 text-black">{sub}</p>}
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-[30px]">
          {groups.map((g) => (
            <div key={g.label} className="flex flex-col gap-2.5">
              <h3 className="text-[20px] font-bold leading-[1.2] tracking-[-0.02em] text-black lg:text-[24px]">{g.label}</h3>
              <ul role="list" className="flex flex-col gap-2.5">
                {g.documents.map((d) => (
                  <li key={d.name} className="flex items-center gap-2.5 text-[16px] leading-6 text-black">
                    <span className="min-w-0 lg:whitespace-nowrap">{d.name}</span>
                    <span aria-hidden="true" className="h-0 min-w-4 flex-1 border-b border-dotted border-[#9CA3AF]" />
                    <SmartLink
                      href={d.href}
                      aria-label={`Download ${d.name} (${format})`}
                      className="shrink-0 underline underline-offset-4 hover:no-underline"
                    >
                      {format}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    );

  const muted = bg === "white" ? "text-muted" : "text-muted-surface";
  return (
    <Section bg={bg} id={id} aria-labelledby={headingId} className={PAD.data} containerClassName="flex flex-col gap-8 lg:gap-9">
      <div className="flex flex-col gap-2.5">
        <h2 id={headingId} className={T.h40b}>
          {title}
        </h2>
        {sub && <p className={`text-[16px] leading-[1.45] lg:text-[18px] ${muted}`}>{sub}</p>}
      </div>
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {groups.map((g) => (
          <div key={g.label} className="flex flex-col">
            <h3 className={`pb-2.5 text-[14px] font-medium leading-[1.45] ${muted}`}>{g.label}</h3>
            <ul role="list" className="border-t border-line">
              {g.documents.map((d) => (
                <li key={d.name} className="border-b border-line">
                  <SmartLink
                    href={d.href}
                    aria-label={`Download ${d.name} (${format})`}
                    className="group focus-inset flex min-h-14 items-center gap-3 py-4 transition-colors hover:bg-surface"
                  >
                    <span className="flex-1 text-[16px] leading-[1.45] text-ink underline-offset-4 group-hover:underline">{d.name}</span>
                    <span className={`shrink-0 text-[13px] leading-[1.45] ${muted} group-hover:text-muted-surface`}>{format}</span>
                    <Icon name="download" size={20} className="text-ink" />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {footnote && <p className={`text-[13px] leading-[1.45] ${muted}`}>{footnote}</p>}
    </Section>
  );
}
