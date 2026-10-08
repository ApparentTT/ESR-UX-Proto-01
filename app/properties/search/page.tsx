import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/layout/Container";

export default function SearchPage() {
  return (
    <PageShell>
      <section className="bg-surface">
        <Container className="py-10">
          <h1 className="text-2xl font-semibold">Search results</h1>
        </Container>
      </section>
    </PageShell>
  );
}
