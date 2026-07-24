import Header from "@/components/Header";
import { PageHeading } from "@/components/PageShell";
import PecuniaryDamagesClient from "@/components/PecuniaryDamagesClient";

export default function FinancialReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <PageHeading
          eyebrow="Stage 6 · Damages"
          title="Pecuniary Damages"
          description="Extracted totals from billing statements and wage documentation, broken down by damages category."
        />
        <PecuniaryDamagesClient />
      </main>
    </div>
  );
}
