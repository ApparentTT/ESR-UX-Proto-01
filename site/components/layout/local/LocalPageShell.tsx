import { LocalFooter } from "./LocalFooter";
import { LocalHeader } from "./LocalHeader";

/** Page frame for the Japan local market site (/jp): the local header and footer around the page. */
export function LocalPageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LocalHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <LocalFooter />
    </>
  );
}
