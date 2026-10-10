import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { HIT } from "@/components/ui/type";

/** One fund row (INV §6c), verbatim. "View fund" goes to an external market site: href null = inert. */
export type FundRow = {
  fund: string;
  strategy: string;
  markets: string;
  sector: string;
  link: { label: string; href: string | null };
};

/** Column headers, verbatim. `link` has no visible header in the wireframe: it is rendered visually hidden. */
export type FundColumns = { fund: string; strategy: string; markets: string; sector: string; link: string };

/**
 * B30 DataTable (INV §6c). A semantic <table> from 768 up: Fund | Strategy | Markets | Sector | link,
 * fluid columns in the wireframe's 1306 proportions (440 / 260 / 220 / 180 / 206 including the 20px gaps).
 * Header Medium 12/1.45 muted, pb 14. A 1px line under the header and after every row, doubled after the
 * last. Rows py 20; fund Medium 16 ink, other cells Regular 16 muted; "View fund ›" Regular 16 ink,
 * underlined, chevron nudges 2px on hover. Row hover #F9FAFB.
 * Below 768 the same rows render as a card list (fund name, a 2-column caption/value grid, "View fund ›").
 * `empty` replaces the rows when nothing matches.
 */
export function FundTable({ columns, rows, caption, empty }: { columns: FundColumns; rows: FundRow[]; caption: string; empty?: React.ReactNode }) {
  return (
    <>
      <table className="hidden w-full table-fixed border-collapse text-left md:table">
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          <col className="w-[30%] lg:w-[33.7%]" />
          <col className="w-[20%] lg:w-[19.9%]" />
          <col className="w-[18%] lg:w-[16.8%]" />
          <col className="w-[15%] lg:w-[13.8%]" />
          <col className="w-[17%] lg:w-[15.8%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-line">
            {[columns.fund, columns.strategy, columns.markets, columns.sector].map((h) => (
              <th key={h} scope="col" className="pb-3.5 pr-5 text-left text-[12px] font-medium leading-[1.45] text-muted">
                {h}
              </th>
            ))}
            <th scope="col" className="pb-3.5">
              <span className="sr-only">{columns.link}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && empty ? (
            <tr className="border-b-2 border-line">
              <td colSpan={5} className="py-5">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i} className={`transition-colors hover:bg-[#F9FAFB] ${i === rows.length - 1 ? "border-b-2" : "border-b"} border-line`}>
                <th scope="row" className="py-5 pr-5 text-left align-middle text-[15px] font-medium leading-[1.45] text-ink lg:text-[16px]">
                  {r.fund}
                </th>
                <td className="py-5 pr-5 align-middle text-[15px] leading-[1.45] text-muted lg:text-[16px]">{r.strategy}</td>
                <td className="py-5 pr-5 align-middle text-[15px] leading-[1.45] text-muted lg:text-[16px]">{r.markets}</td>
                <td className="py-5 pr-5 align-middle text-[15px] leading-[1.45] text-muted lg:text-[16px]">{r.sector}</td>
                <td className="py-5 align-middle">
                  <ViewFund row={r} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Below 768: the same rows as a stacked card list */}
      <div className="md:hidden">
        {rows.length === 0 && empty ? (
          <div className="border-y border-line py-5">{empty}</div>
        ) : (
          <ul role="list" aria-label={caption} className="border-t border-line">
            {rows.map((r, i) => (
              <li key={i} className={`flex flex-col gap-3 py-5 ${i === rows.length - 1 ? "border-b-2" : "border-b"} border-line`}>
                <p className="text-[16px] font-medium leading-[1.45] text-ink">{r.fund}</p>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {(
                    [
                      [columns.strategy, r.strategy],
                      [columns.markets, r.markets],
                      [columns.sector, r.sector],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-0.5">
                      <dt className="text-[12px] font-medium leading-[1.45] text-muted">{k}</dt>
                      <dd className="text-[15px] leading-[1.45] text-muted">{v}</dd>
                    </div>
                  ))}
                </dl>
                <ViewFund row={r} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function ViewFund({ row }: { row: FundRow }) {
  return (
    <SmartLink
      href={row.link.href}
      aria-label={`${row.link.label}: ${row.fund} (${row.strategy}, ${row.markets}, ${row.sector})`}
      className={`${HIT} group inline-flex items-center gap-0.5 text-[15px] leading-[1.45] text-ink lg:text-[16px]`}
    >
      <span className="underline underline-offset-4">{row.link.label}</span>
      <Icon name="chevron_right" size={18} className="text-black transition-transform duration-200 group-hover:translate-x-0.5" />
    </SmartLink>
  );
}
