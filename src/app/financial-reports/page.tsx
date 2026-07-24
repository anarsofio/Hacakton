import Header from "@/components/Header";
import { Card, PageHeading, SourceViewer } from "@/components/PageShell";
import AIBadge from "@/components/AIBadge";
import { financials } from "@/lib/mockData";

export default function FinancialReportsPage() {
  const medicalTotal = financials.medicalBills.reduce((a, b) => a + b.amount, 0);
  const otherTotal = financials.otherEconomic.reduce((a, b) => a + b.amount, 0);
  const grandTotal =
    medicalTotal + financials.lostWages.amount + financials.propertyDamage.amount + otherTotal;

  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <PageHeading
          eyebrow="Stage 6 · Damages"
          title="Financial Reports"
          description="AI-extracted totals from billing statements and wage documentation, broken down by damages category."
        />

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-6">
            <Card className="p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif-display text-lg font-semibold text-navy">AI Summary</h2>
                <AIBadge />
              </div>
              <p className="text-[15px] leading-relaxed text-navy/80">
                Confirmed economic damages total {fmt(grandTotal)} across five medical providers,
                lost wages from a partial return-to-work period, vehicle property damage, and
                incidental costs tied directly to treatment.
              </p>
            </Card>

            <Card className="overflow-hidden">
              <div className="border-b border-line/70 px-6 py-4">
                <h3 className="font-serif-display text-base font-semibold text-navy">
                  Medical bills
                </h3>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-line/60">
                  {financials.medicalBills.map((b) => (
                    <tr key={b.provider}>
                      <td className="px-6 py-3 text-navy/80">{b.provider}</td>
                      <td className="px-6 py-3 text-right font-medium text-navy">
                        {fmt(b.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-navy/[0.03]">
                    <td className="px-6 py-3 font-semibold text-navy">Medical specials total</td>
                    <td className="px-6 py-3 text-right font-semibold text-navy">
                      {fmt(medicalTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>

            <Card className="overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-line/60">
                  <tr>
                    <td className="px-6 py-3 text-navy/80">
                      Lost wages
                      <p className="text-xs text-muted">{financials.lostWages.description}</p>
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-navy">
                      {fmt(financials.lostWages.amount)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-navy/80">
                      Property damage
                      <p className="text-xs text-muted">{financials.propertyDamage.description}</p>
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-navy">
                      {fmt(financials.propertyDamage.amount)}
                    </td>
                  </tr>
                  {financials.otherEconomic.map((o) => (
                    <tr key={o.label}>
                      <td className="px-6 py-3 text-navy/80">{o.label}</td>
                      <td className="px-6 py-3 text-right font-medium text-navy">
                        {fmt(o.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-navy text-cream">
                    <td className="px-6 py-3 font-semibold">Total economic damages (confirmed)</td>
                    <td className="px-6 py-3 text-right font-serif-display text-lg font-semibold text-gold">
                      {fmt(grandTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            <SourceViewer filename="St_Marys_Billing_Statement.pdf" />
          </div>
        </div>
      </main>
    </div>
  );
}
