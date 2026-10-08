import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/layout/Container";

export default function FirstVisitPage() {
  return (
    <PageShell>
      <section className="bg-surface">
        <Container className="py-10 md:py-14">
          <h1 className="text-[28px] font-semibold leading-tight md:text-[32px]">Find space for your business</h1>
        </Container>
      </section>
    </PageShell>
  );
}
